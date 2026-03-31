<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LdapController extends Controller
{
    public function getAllLdapUsers()
    {
        $ldapHost = "ldap://10.0.1.30";
        $ldapPort = 389;
        $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
        $user = "api@kaztbu.edu.kz";
        $password = "KazUTB2023@";

        putenv('LDAPTLS_REQCERT=never');
        @ldap_set_option(null, LDAP_OPT_X_TLS_REQUIRE_CERT, LDAP_OPT_X_TLS_NEVER);

        $ldapConn = @ldap_connect($ldapHost, $ldapPort);

        if (!$ldapConn) {
            return response()->json(['message' => 'Не удалось инициализировать LDAP'], 500);
        }

        ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0);

        if (!@ldap_start_tls($ldapConn)) {
            $error = ldap_error($ldapConn);
            ldap_unbind($ldapConn);
            return response()->json([
                'status' => 'error',
                'message' => 'StartTLS не запустился: ' . $error
            ], 500);
        }

        if (!@ldap_bind($ldapConn, $user, $password)) {
            $error = ldap_error($ldapConn);
            ldap_unbind($ldapConn);
            return response()->json(['status' => 'error', 'message' => 'Bind error: ' . $error], 401);
        }

        $filter = "(&(objectCategory=person)(objectClass=user))";
        $attributes = ["cn", "mail", "title", "department", "displayname"];
        
        $users = [];
        $pageSize = 500; 
        $cookie = '';

        // Современный способ постраничной загрузки (PHP 7.3+)
        do {
            $controls = [
                [
                    'oid' => LDAP_CONTROL_PAGEDRESULTS,
                    'iscritical' => true,
                    'value' => [
                        'size' => $pageSize,
                        'cookie' => $cookie,
                    ],
                ]
            ];

            $search = @ldap_search($ldapConn, $baseDn, $filter, $attributes, 0, 0, 0, LDAP_DEREF_NEVER, $controls);

            if (!$search) {
                break;
            }

            // Извлекаем данные и новый cookie из ответа
            ldap_parse_result($ldapConn, $search, $errcode, $matcheddn, $errmsg, $referrals, $controls_response);

            $entries = ldap_get_entries($ldapConn, $search);

            for ($i = 0; $i < $entries["count"]; $i++) {
                $users[] = [
                    'name'       => $entries[$i]["displayname"][0] ?? ($entries[$i]["cn"][0] ?? 'N/A'),
                    'email'      => $entries[$i]["mail"][0] ?? 'N/A',
                    'company'   => $entries[$i]["company"][0] ?? 'N/A',
                    'position'   => $entries[$i]["title"][0] ?? 'N/A',
                    'department' => $entries[$i]["department"][0] ?? 'N/A',
                ];
            }

            // Обновляем cookie для следующей итерации
            if (isset($controls_response[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'])) {
                $cookie = $controls_response[LDAP_CONTROL_PAGEDRESULTS]['value']['cookie'];
            } else {
                $cookie = '';
            }

        } while ($cookie !== null && $cookie != '');

        ldap_unbind($ldapConn);

        return response()->json([
            'status' => 'success',
            'total_found' => count($users),
            'users' => $users
        ]);
    }
}