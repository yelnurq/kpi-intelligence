<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request, GeminiService $gemini)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $answer = $gemini->ask($request->message);

        return response()->json([
            'status' => 'success',
            'answer' => $answer
        ]);
    }
}