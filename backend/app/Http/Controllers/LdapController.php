<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str; 
use App\Models\User;

class LdapController extends Controller
{
    /**
     * Приватный метод для подключения к LDAP
     */
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
            ldap_unbind($ldapConn);
            return false;
        }

        if (!@ldap_bind($ldapConn, $user, $password)) {
            ldap_unbind($ldapConn);
            return false;
        }

        return $ldapConn;
    }

    /**
     * Получение всех пользователей (для списка в React)
     */
    public function getAllLdapUsers()
    {
        $ldapConn = $this->connectLdap();
        if (!$ldapConn) {
            return response()->json(['status' => 'error', 'message' => 'LDAP connection/bind failed'], 500);
        }

        $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
        $filter = "(&(objectCategory=person)(objectClass=user))";
        $attributes = ["cn", "mail", "title", "department", "displayname", "company"];
        
        $users = [];
        $pageSize = 500; 
        $cookie = '';

        do {
            $controls = [['oid' => LDAP_CONTROL_PAGEDRESULTS, 'iscritical' => true, 'value' => ['size' => $pageSize, 'cookie' => $cookie]]];
            $search = @ldap_search($ldapConn, $baseDn, $filter, $attributes, 0, 0, 0, LDAP_DEREF_NEVER, $controls);

            if (!$search) break;

            ldap_parse_result($ldapConn, $search, $errcode, $matcheddn, $errmsg, $referrals, $controls_response);
            $entries = ldap_get_entries($ldapConn, $search);

            for ($i = 0; $i < $entries["count"]; $i++) {
                $users[] = [
                    'name'       => $entries[$i]["displayname"][0] ?? ($entries[$i]["cn"][0] ?? 'N/A'),
                    'email'      => $entries[$i]["mail"][0] ?? 'N/A',
                    'company'    => $entries[$i]["company"][0] ?? 'N/A',
                    'position'   => $entries[$i]["title"][0] ?? 'N/A',
                    'department' => $entries[$i]["department"][0] ?? 'N/A',
                ];
            }
            $cookie = $controls_response[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'] ?? '';

        } while ($cookie !== null && $cookie != '');

        ldap_unbind($ldapConn);

        return response()->json([
            'status' => 'success',
            'total_found' => count($users),
            'users' => $users
        ]);
    }

    /**
     * Импорт одного пользователя
     */
public function importSingleUser(Request $request)
{
    $inputEmail = trim($request->input('email'));
    $inputName = trim($request->input('name')); // Добавим имя как запасной вариант

    if (!$inputEmail || $inputEmail === 'N/A') {
        // Если почты нет, пробуем искать по точному ФИО
        $filter = "(|(cn=$inputName)(displayname=$inputName))";
    } else {
        // Если почта есть, ищем по почте или логину
        $filter = "(|(mail=$inputEmail)(userPrincipalName=$inputEmail)(sAMAccountName=$inputEmail))";
    }

    $ldapConn = $this->connectLdap();
    if (!$ldapConn) return response()->json(['message' => 'LDAP connection failed'], 500);

    $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
    $attributes = ["cn", "mail", "title", "department", "displayname", "userprincipalname", "samaccountname"];

    $search = @ldap_search($ldapConn, $baseDn, $filter, $attributes);
    $entries = ldap_get_entries($ldapConn, $search);

    if ($entries['count'] == 0) {
        ldap_unbind($ldapConn);
        return response()->json([
            'message' => "Пользователь [$inputName] не найден в AD ни по почте, ни по имени.",
            'debug_filter' => $filter
        ], 404);
    }

    $entry = $entries[0];
    
    // Пытаемся вытащить почту из AD, если её нет — создаем временную на основе логина
    $ldapEmail = $entry['mail'][0] ?? ($entry['userprincipalname'][0] ?? null);
    
    if (!$ldapEmail) {
        $login = $entry['samaccountname'][0] ?? Str::slug($inputName);
        $ldapEmail = $login . "@kaztbu.edu.kz"; // Генерируем, если в AD пусто
    }

    $user = User::updateOrCreate(
        ['email' => $ldapEmail],
        [
            'name' => $entry['displayname'][0] ?? ($entry['cn'][0] ?? $inputName),
            'position' => $entry['title'][0] ?? 'Сотрудник',
            'department' => $entry['department'][0] ?? 'Университет',
            'password' => bcrypt(Str::random(16)), 
            'email_verified_at' => now(),
        ]
    );

    ldap_unbind($ldapConn);

    return response()->json([
        'status' => 'success',
        'message' => "Успешно: " . $user->name,
        'user' => $user
    ]);
}
}