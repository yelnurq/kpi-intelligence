<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Token;
use App\Models\KpiActivity;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    // Твой метод подключения (оставляем без изменений)
    private function connectLdap()
    {
        $ldapHost = "ldap://10.0.1.30";
        $ldapPort = 389;
        $user = "api@kaztbu.edu.kz";
        $password = "KazUTB2023@";

        putenv('LDAPTLS_REQCERT=never');
        @ldap_set_option(null, LDAP_OPT_X_TLS_REQUIRE_CERT, LDAP_OPT_X_TLS_NEVER);

        $ldapConn = @ldap_connect($ldapHost, $ldapPort);
        if (!$ldapConn) return false;

        ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0);

        if (!@ldap_start_tls($ldapConn)) {
            @ldap_unbind($ldapConn);
            return false;
        }

        if (!@ldap_bind($ldapConn, $user, $password)) {
            @ldap_unbind($ldapConn);
            return false;
        }

        return $ldapConn;
    }

    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }

    public function admin(Request $request)
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);

            // --- 1. ПАГИНАЦИЯ ТАБЛИЦЫ KPI (БД) ---
            $query = KpiActivity::latest()->with(['user.faculty', 'indicator']);

            if ($user->role === 'academic_office' && $user->academic_specialization) {
                $query->whereHas('indicator', fn($q) => $q->where('category', $user->academic_specialization));
            }

            if ($request->filled('faculty') && $request->faculty !== 'all') {
                $query->whereHas('user.faculty', fn($q) => $q->where('short_title', $request->faculty));
            }

            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            $paginated = $query->paginate(15);

            // --- 2. СТАТИСТИКА KPI (ДЛЯ ГРАФИКА) ---
            $allKpiQuery = KpiActivity::query();
            if ($user->role === 'academic_office') {
                $allKpiQuery->whereHas('indicator', fn($q) => $q->where('category', $user->academic_specialization));
            }
            $allKpi = $allKpiQuery->get();

            // --- 3. ТАЙМЛАЙН (14 ДНЕЙ) ---
            $timeline = [];
            for ($i = 14; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $label = now()->subDays($i)->format('d.m');
                $timeline[] = [
                    'date' => $label,
                    'received' => $allKpi->filter(fn($x) => Carbon::parse($x->created_at)->format('Y-m-d') === $date)->count(),
                    'verified' => $allKpi->filter(fn($x) => $x->status === 'approved' && Carbon::parse($x->updated_at)->format('Y-m-d') === $date)->count(),
                ];
            }

            // --- 4. СИСТЕМНАЯ СТАТИСТИКА (LDAP С ПАГИНАЦИЕЙ) ---
            $ldapData = Cache::remember('ldap_full_sync_stats', 600, function() {
                $ldapConn = $this->connectLdap();
                if (!$ldapConn) return ['count' => 0, 'online' => false];

                $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
                $filter = "(&(objectCategory=person)(objectClass=user))";
                $totalFound = 0;
                $pageSize = 500; 
                $cookie = '';

                do {
                    $controls = [['oid' => LDAP_CONTROL_PAGEDRESULTS, 'iscritical' => true, 'value' => ['size' => $pageSize, 'cookie' => $cookie]]];
                    $search = @ldap_search($ldapConn, $baseDn, $filter, ["cn"], 0, 0, 0, LDAP_DEREF_NEVER, $controls);

                    if (!$search) break;

                    ldap_parse_result($ldapConn, $search, $errcode, $matcheddn, $errmsg, $referrals, $controls_response);
                    $entries = ldap_get_entries($ldapConn, $search);
                    
                    $totalFound += $entries["count"];
                    $cookie = $controls_response[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'] ?? '';

                } while ($cookie !== null && $cookie != '');

                @ldap_unbind($ldapConn);

                return [
                    'count' => $totalFound,
                    'online' => true
                ];
            });

            return response()->json([
                'status' => 'success',
                'specialization' => $user->academic_specialization,
                'data' => $paginated->items(),
                'stats' => [
                    'total' => $allKpi->count(),
                    'approved' => $allKpi->where('status', 'approved')->count(),
                    'pending' => $allKpi->where('status', 'pending')->count(),
                    'rejected' => $allKpi->where('status', 'rejected')->count(),
                    'timeline' => $timeline,
                    'users_db' => User::count(),
                    'users_ldap' => $ldapData['count'],
                    'ldap' => $ldapData['online']
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}