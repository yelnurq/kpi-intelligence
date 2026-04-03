<?php

namespace App\Http\Middleware;

use App\Models\Token;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminCheck
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bearerToken = $request->bearerToken();
        
        $tokenRecord = Token::where("token", $bearerToken)->with('user')->first();

        if (!$tokenRecord || !$tokenRecord->user || $tokenRecord->user->role === 'teacher') {
            return response()->json([
                "status" => "unsuccess",
                "message" => "Access denied. Admins only."
            ], 403);
        }

        return $next($request);
    }
}