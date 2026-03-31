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
    // 1. Валидация: меняем 'email' на 'string', чтобы проходил UPN (логин@домен)
    $rules = [
        "email"    => "required|string", 
        "password" => "required|string",
    ];  

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return response()->json(["status" => "error", "errors" => $validator->errors()], 422);
    }

    // Ищем пользователя в локальной БД (UPN должен быть сохранен в колонке email)
    $user = User::where("email", $request->email)->first();

    if (!$user) {
        return response()->json([
            "status" => "error",
            "message" => "Пользователь не найден в системе",
        ], 401);
    }

    $authenticated = false;
    $ldapError = null;

    // --- 2. ПРОВЕРКА ЧЕРЕЗ LDAP (Аналогично вашему рабочему методу) ---
    try {
        // Используем LDAPS (порт 636), так как сервер требует Strong Authentication
        $ldapHost = "ldaps://10.0.1.30"; 
        $ldapPort = 636;
        $ldapConn = @ldap_connect($ldapHost, $ldapPort);
        
        if ($ldapConn) {
            ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0);
            ldap_set_option($ldapConn, LDAP_OPT_NETWORK_TIMEOUT, 2);
            
            // Игнорируем проверку SSL сертификата (частая проблема в локальных сетях)
            putenv('LDAPTLS_REQCERT=never'); 

            // Bind по userPrincipalName (логин из запроса)
            if (@ldap_bind($ldapConn, $request->email, $request->password)) {
                $authenticated = true;
                // Синхронизируем пароль в локальной БД (хэшируем)
                $user->update(['password' => Hash::make($request->password)]);
            } else {
                $ldapError = ldap_error($ldapConn);
            }
            @ldap_unbind($ldapConn);
        }
    } catch (\Exception $e) {
        $ldapError = $e->getMessage();
    }

    // --- 3. ЛОКАЛЬНАЯ ПРОВЕРКА (Если AD недоступен или пароль не подошел) ---
    if (!$authenticated) {
        if (Hash::check($request->password, $user->password)) {
            $authenticated = true;
        }
    }

    // --- 4. РЕЗУЛЬТАТ ---
    if (!$authenticated) {
        return response()->json([
            "status"  => "error",
            "message" => "Неверный логин или пароль",
            "debug"   => $ldapError // Оставь для тестов в Postman, потом удалишь
        ], 401);
    }

    // --- 5. ТОКЕН (Как в твоем React) ---
    try {
        Token::where('user_id', $user->id)->delete(); 
        
        $tokenValue = Str::random(60);
        $token = Token::create([
            "token"   => $tokenValue,
            "user_id" => $user->id,    
        ]);

        return response()->json([
            "status"       => "success",
            "access_token" => $token, // Возвращаем объект, как просит фронт
            "token_type"   => "Bearer",
            "user"         => $user
        ]);
    } catch (\Exception $e) {
        return response()->json(["status" => "error", "message" => "Ошибка токена"], 500);
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