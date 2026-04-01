<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Token;
use App\Models\Faculty;
use App\Models\KpiActivity;
use App\Models\UserKpiPlan;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
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

    /**
     * Основной метод Dashboard для Админа
     */
    public function admin(Request $request)
    {
        try {
            $user = $this->getAuthenticatedUser($request);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);

            $facultyId = $request->query('faculty_id');
            $year = $request->query('year', '2025/2026');

            // --- 1. СТАТИСТИКА KPI (АКТИВНОСТЬ) ---
            $allKpiQuery = KpiActivity::query();
            if ($facultyId && $facultyId !== 'all') {
                $allKpiQuery->whereHas('user', fn($q) => $q->where('faculty_id', $facultyId));
            }
            $allKpi = $allKpiQuery->get();

            // --- 2. МОНИТОРИНГ ПОДГОТОВКИ ПЛАНОВ ---
            $planQuery = User::query()
                ->join('kpi_plan_submissions', 'users.id', '=', 'kpi_plan_submissions.user_id')
                ->where('kpi_plan_submissions.academic_year', $year);

            if ($facultyId && $facultyId !== 'all') {
                $planQuery->where('users.faculty_id', $facultyId);
            }

            $planStats = [
                'total' => (clone $planQuery)->count(),
                'pending' => (clone $planQuery)->where('kpi_plan_submissions.status', 'submitted')->count(),
                'approved' => (clone $planQuery)->where('kpi_plan_submissions.status', 'approved')->count(),
                'rejected' => (clone $planQuery)->where('kpi_plan_submissions.status', 'rejected')->count(),
            ];

            $timeline = [];
            for ($i = 14; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $label = now()->subDays($i)->format('d.m');
                
                // Фильтруем коллекцию KPI по конкретной дате один раз для оптимизации
                $dayKpis = $allKpi->filter(fn($x) => \Carbon\Carbon::parse($x->created_at)->format('Y-m-d') === $date);
                
                $timeline[] = [
                    'date' => $label,
                    // Сколько всего поступило (все статусы)
                    'received' => $dayKpis->count(), 
                    // Сколько из них уже отработано (статус approved)
                    'processed' => $dayKpis->where('status', 'approved')->count(), 
                ];
            }
            // --- 4. LDAP СТАТИСТИКА (Кэшируем на 10 минут) ---
            $ldapStats = Cache::remember('ldap_admin_count', 600, function() {
                $ldapConn = $this->connectLdap();
                if (!$ldapConn) return ['count' => 0, 'online' => false];
                
                $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
                $filter = "(&(objectCategory=person)(objectClass=user))";
                $total = 0; $cookie = '';

                do {
                    $controls = [['oid' => LDAP_CONTROL_PAGEDRESULTS, 'value' => ['size' => 1000, 'cookie' => $cookie]]];
                    $search = @ldap_search($ldapConn, $baseDn, $filter, ['cn'], 0, 0, 0, LDAP_DEREF_NEVER, $controls);
                    if (!$search) break;
                    ldap_parse_result($ldapConn, $search, $err, $dn_m, $msg, $ref, $servControls);
                    $total += ldap_count_entries($ldapConn, $search);
                    $cookie = $servControls[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'] ?? '';
                } while ($cookie !== null && $cookie !== '');

                @ldap_unbind($ldapConn);
                return ['count' => $total, 'online' => true];
            });

        // Добавьте этот расчет перед return в методе admin()
            $apiLogsCount = \DB::table('api_logs')->count();

            return response()->json([
                'status' => 'success',
                'stats' => [
                    'plan_monitoring' => $planStats,
                    'total' => $allKpi->count(),
                    'approved' => $allKpi->where('status', 'approved')->count(),
                    'timeline' => $timeline,
                    'users_db' => User::count(),
                    'users_ldap' => $ldapStats['count'],
                    'ldap' => $ldapStats['online'],
                    // Добавляем новую метрику
                    'api_logs_total' => $apiLogsCount, 
                    'faculty_analysis' => $this->getFacultyDeadlineComparisonInternal(),
                    'faculties' => Faculty::select('id', 'short_title', 'title')->get()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Вспомогательный метод для получения анализа по факультетам
     */
    private function getFacultyDeadlineComparisonInternal()
    {
        $faculties = Faculty::with(['users' => function($q) {
            $q->withCount([
                'kpiPlans as total',
                'kpiPlans as approved' => function($q) {
                    $q->whereHas('indicator.activities', fn($sub) => $sub->whereColumn('user_id', 'users.id'));
                },
                'kpiPlans as overdue' => function($q) {
                    $q->where('deadline', '<', now())
                      ->whereDoesntHave('indicator.activities', fn($sub) => $sub->whereColumn('user_id', 'users.id'));
                }
            ]);
        }])->get();

        return $faculties->map(function($faculty) {
            $app = $faculty->users->sum('approved');
            $ovr = $faculty->users->sum('overdue');
            $ttl = $faculty->users->sum('total');
            return [
                'name' => $faculty->short_title ?? $faculty->title,
                'approved' => (int)$app,
                'pending' => (int)max(0, $ttl - ($app + $ovr)),
                'rejected' => (int)$ovr, 
            ];
        });
    }

    /**
     * Полный список пользователей из LDAP (для таблицы в React)
     */
    public function getAllLdapUsers()
    {
        $ldapConn = $this->connectLdap();
        if (!$ldapConn) return response()->json(['status' => 'error', 'message' => 'LDAP connection failed'], 500);

        $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
        $filter = "(&(objectCategory=person)(objectClass=user))";
        $attributes = ["cn", "userPrincipalName", "title", "department", "displayname", "company", "mobile"];
        
        $users = []; $cookie = '';
        do {
            $controls = [['oid' => LDAP_CONTROL_PAGEDRESULTS, 'iscritical' => true, 'value' => ['size' => 500, 'cookie' => $cookie]]];
            $search = @ldap_search($ldapConn, $baseDn, $filter, $attributes, 0, 0, 0, LDAP_DEREF_NEVER, $controls);
            if (!$search) break;

            ldap_parse_result($ldapConn, $search, $err, $dn_m, $msg, $ref, $resp_controls);
            $entries = ldap_get_entries($ldapConn, $search);

            for ($i = 0; $i < $entries["count"]; $i++) {
                $users[] = [
                    'name' => $entries[$i]["displayname"][0] ?? ($entries[$i]["cn"][0] ?? 'N/A'),
                    'userPrincipalName' => $entries[$i]["userprincipalname"][0] ?? 'N/A', 
                    'company'  => $entries[$i]["company"][0] ?? 'N/A',
                    'position' => $entries[$i]["title"][0] ?? 'N/A', 
                    'mobile'   => $entries[$i]["mobile"][0] ?? 'N/A',
                ];
            }
            $cookie = $resp_controls[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'] ?? '';
        } while ($cookie !== null && $cookie != '');

        ldap_unbind($ldapConn);
        return response()->json(['status' => 'success', 'total_found' => count($users), 'users' => $users]);
    }
}