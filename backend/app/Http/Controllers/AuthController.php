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
            "email" => "required|email",
            "password" => "required",
        ];  

        $messages = [
            "email.required" => "Введите ваш Email",
            "email.email"    => "Введите корректный адрес электронной почты",
            "password.required" => "Введите пароль",
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "errors" => $validator->errors(),
            ], 422);
        }

        $user = User::where("email", $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => "error",
                "message" => "Неверное имя пользователя или пароль",
            ], 401);
        }

        try {
            $user->tokens()->delete();
            $tokenValue = Str::random(60);
            $token = Token::create([
                "token"=>$tokenValue,
                "user_id"=>$user->id,    
            ]);

            return response()->json([
                "status" => "success",
                "access_token" => $token,
                "token_type" => "Bearer",
                "user" => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Ошибка сервера при создании токена",
                "debug"=>$e->getMessage(),
            ], 500);
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