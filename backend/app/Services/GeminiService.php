<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class GeminiService
{
    protected $apiKey;
    // Используй 1.5-flash или 2.0-flash. 2.5 может быть еще недоступна.
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    public function ask($prompt)
    {
        // 1. Берем историю из сессии. Если пусто — создаем массив.
        $messages = Session::get('chat_history', []);

        // 2. Добавляем текущее сообщение пользователя
        $messages[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $prompt]
            ]
        ];

        // 3. Отправляем запрос
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}?key={$this->apiKey}", [
            'contents' => $messages, // Отправляем ВСЮ цепочку сообщений
            'generationConfig' => [
                'temperature' => 0.8,
                'maxOutputTokens' => 1000,
            ]
        ]);

        // 4. Проверка на ошибки API
        if ($response->failed()) {
            $error = $response->json()['error']['message'] ?? 'Unknown API Error';
            
            // Если ошибка из-за слишком большой истории, можно очистить её
            if (str_contains($error, 'context window')) {
                Session::forget('chat_history');
                return "История была слишком длинной, я её очистил. Попробуй еще раз!";
            }

            return "Ошибка системы: " . $error;
        }

        $result = $response->json();

        // 5. Проверяем, есть ли ответ в структуре
        if (!isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            return "Бот не смог сформировать ответ. Возможно, сработал фильтр контента.";
        }

        $answer = $result['candidates'][0]['content']['parts'][0]['text'];

        // 6. Добавляем ответ бота в историю для памяти
        $messages[] = [
            'role' => 'model',
            'parts' => [
                ['text' => $answer]
            ]
        ];

        // 7. Сохраняем обновленную историю в сессию
        Session::put('chat_history', $messages);

        return $answer;
    }

    public function clear()
    {
        Session::forget('chat_history');
    }
}