<?php

namespace App\Http\Middleware;

use App\Models\Token;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        // Возвращаем только ID, чтобы не тянуть весь объект в память
        return $tokenRecord->user_id;
    }    

    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Теперь здесь будет либо число (ID), либо null
        $userId = $this->getAuthenticatedUser($request);

        // Выполняем запрос дальше по цепочке
        $response = $next($request);

        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000); 

        // Для SQLite лучше ограничить размер ответа, чтобы база не раздулась
        $safeResponse = mb_substr($response->getContent(), 0, 5000);

        DB::table('api_logs')->insert([
            'user_id'     => $userId, // Передаем ID (число)
            'method'      => $request->method(),
            'url'         => $request->fullUrl(),
            'payload'     => json_encode($request->except(['password', 'password_confirmation'])), 
            'response'    => $safeResponse,
            'ip_address'  => $request->ip(),
            'duration_ms' => $duration,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return $response;
    }
}