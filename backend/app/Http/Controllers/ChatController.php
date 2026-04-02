<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ChatGptService; // Импортируем новый сервис
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Отправка сообщения в ChatGPT
     */
    public function sendMessage(Request $request, ChatGptService $chatGpt)
    {
        $request->validate([
            'message' => 'required|string|max:5000'
        ]);

        // Вызываем метод ask у нового сервиса
        $answer = $chatGpt->ask($request->message);

        return response()->json([
            'status' => 'success',
            'answer' => $answer
        ]);
    }

    /**
     * Очистка истории переписки
     */
    public function resetChat(ChatGptService $chatGpt)
    {
        $chatGpt->clear();

        return response()->json([
            'status' => 'success',
            'message' => 'История успешно очищена'
        ]);
    }
}