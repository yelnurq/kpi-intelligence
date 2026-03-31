<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function ldapLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $ldapHost = "ldaps://10.0.1.30"; // ldaps:// для SSL порта 636
        $ldapPort = 636;
        $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
        putenv("LDAPTLS_CACERT=C:\\Users\\User\\Documents\\GitHub\\kpi-intelligence\\kaztbu.cer");
        // 1. Инициализация соединения
        $ldapConn = ldap_connect($ldapHost, $ldapPort);

        if (!$ldapConn) {
            return response()->json(['message' => 'Не удалось связаться с сервером AD'], 500);
        }

        // 2. Опции протокола
        ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0);

        try {
            // 3. Попытка входа (Bind)
            // В Active Directory обычно логин — это полный email
            $isAuthenticated = @ldap_bind($ldapConn, $request->email, $request->password);

            if ($isAuthenticated) {
                // 4. Поиск или создание пользователя в вашей БД (MySQL)
                $user = User::where('email', $request->email)->first();

                if (!$user) {
                    // Автоматическая регистрация, если пользователя еще нет в системе KPI
                    $user = User::create([
                        'name' => explode('@', $request->email)[0], // берем часть до @
                        'email' => $request->email,
                        'password' => Hash::make(Str::random(24)), // пароль в БД не важен
                        'role' => 'teacher', // роль по умолчанию
                        'faculty_id' => null, // позже назначим через админку или логику AD
                    ]);
                }

                // 5. Генерация токена (Sanctum)
                $token = $user->createToken('kpi_access_token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'token' => $token,
                    'user' => $user
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка сервера авторизации: ' . $e->getMessage()], 500);
        } finally {
            ldap_unbind($ldapConn);
        }

        return response()->json(['message' => 'Неверный логин или пароль университета'], 401);
    }
    public function register(Request $request)
    {
        $rules = [
            "name" => "required|string|max:255",
            "email" => "required|string|email|unique:users,email|max:255",
            "password" => "required|string|min:8|confirmed", 
        ];

        $messages = [
            "name.required" => "Поле Name обязательно для заполнения",
            "name.string"   => "Name должен быть строкой",
            "name.max"      => "Name не должен превышать 255 символов",
            
            "email.required" => "Поле Email обязательно для заполнения",
            "email.string"   => "Email должен быть строкой",
            "email.email"    => "Введите корректный адрес электронной почты",
            "email.unique"   => "Пользователь с таким Email уже зарегистрирован",
            "email.max"      => "Email не должен превышать 255 символов",

            "password.required"  => "Поле Пароль обязательно для заполнения",
            "password.string"    => "Пароль должен быть строкой",
            "password.min"       => "Пароль должен содержать минимум :min символов",
            "password.confirmed" => "Пароли не совпадают", 
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        
        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "errors" => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                "name" => $request->name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
            ]);

            $tokenValue = Str::random(60);
            $token = Token::create([
                "token"=>$tokenValue,
                "user_id"=>$user->id,    
            ]);

            return response()->json([
                "status" => "success",
                "user" => $user,
                "access_token" => $token,
                "token_type" => "Bearer",
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Ошибка при регистрации",
                "debug" => $e->getMessage(),
            ], 500);
        }
    }

public function login(Request $request)
{
    $rules = [
        "email"    => "required|string", 
        "password" => "required|string",
    ];  

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return response()->json(["status" => "error", "errors" => $validator->errors()], 422);
    }

    $authenticated = false;
    $ldapData = null;
    $ldapError = null;

    // --- 1. ПРОВЕРКА В ACTIVE DIRECTORY ---
    try {
        $ldapHost = "ldaps://10.0.1.30"; 
        $ldapPort = 636;
        $ldapConn = @ldap_connect($ldapHost, $ldapPort);
        
        if ($ldapConn) {
            ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($ldapConn, LDAP_OPT_NETWORK_TIMEOUT, 2);
            putenv('LDAPTLS_REQCERT=never'); 

            // Пытаемся забиндиться под данными пользователя
            if (@ldap_bind($ldapConn, $request->email, $request->password)) {
                $authenticated = true;

                // Если бинд успешен, вытаскиваем данные этого пользователя из AD
                $baseDn = "OU=Univer,DC=kaztbu,DC=edu,DC=kz";
                $filter = "(userPrincipalName=" . $request->email . ")";
                $attributes = ["displayname", "userprincipalname", "title", "department"];
                $search = ldap_search($ldapConn, $baseDn, $filter, $attributes);
                $entries = ldap_get_entries($ldapConn, $search);

                if ($entries['count'] > 0) {
                    $ldapData = [
                        'name' => $entries[0]['displayname'][0] ?? $entries[0]['cn'][0] ?? 'User',
                        'email' => $entries[0]['userprincipalname'][0],
                        'position' => $entries[0]['title'][0] ?? 'N/A',
                        'department' => $entries[0]['department'][0] ?? 'N/A',
                    ];
                }
            } else {
                $ldapError = ldap_error($ldapConn);
            }
            @ldap_unbind($ldapConn);
        }
    } catch (\Exception $e) {
        $ldapError = $e->getMessage();
    }

    // --- 2. СИНХРОНИЗАЦИЯ С ЛОКАЛЬНОЙ БАЗОЙ ---
    // Ищем пользователя в БД (по UPN)
    $user = User::where("email", $request->email)->first();

    if ($authenticated && $ldapData) {
        // Если в AD всё ок, а в БД пользователя нет — создаем его
        if (!$user) {
            $user = User::create([
                'name' => $ldapData['name'],
                'email' => $ldapData['email'], // Сохраняем UPN как email
                'password' => Hash::make($request->password),
                'role' => 'user', // Роль по умолчанию
                'position' => $ldapData['position'],
                'department' => $ldapData['department'],
            ]);
        } else {
            // Если пользователь уже есть, обновляем ему пароль и данные
            $user->update([
                'password' => Hash::make($request->password),
                'name' => $ldapData['name'],
                'position' => $ldapData['position']
            ]);
        }
    } else {
        // Если LDAP не сработал (например, нет сети), пробуем локальный вход
        if ($user && Hash::check($request->password, $user->password)) {
            $authenticated = true;
        }
    }

    // --- 3. ПРОВЕРКА РЕЗУЛЬТАТА ---
    if (!$authenticated || !$user) {
        return response()->json([
            "status"  => "error",
            "message" => "Неверный логин или пароль",
            "debug"   => $ldapError
        ], 401);
    }

    // --- 4. ГЕНЕРАЦИЯ ТОКЕНА ---
    try {
        Token::where('user_id', $user->id)->delete(); 
        $tokenValue = Str::random(60);
        $token = Token::create([
            "token"   => $tokenValue,
            "user_id" => $user->id,    
        ]);

        return response()->json([
            "status"       => "success",
            "access_token" => $token,
            "user"         => $user
        ]);
    } catch (\Exception $e) {
        return response()->json(["status" => "error", "message" => "Ошибка авторизации"], 500);
    }
}
    public function logout(Request $request)
    {
        try {
            $tokenRecord = $request->bearerToken();
            $token = Token::where("token", $tokenRecord)->first();
            $token->delete();

            return response()->json([
                "status" => "success",
                "message" => "Вы успешно вышли из системы",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Ошибка при выходе",
                "debug"=>$e->getMessage(),
            ], 500);
        }
    }
}