<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }
public function me(Request $request)
{
    // Загружаем пользователя сразу со всеми связями
    $user = $this->getAuthenticatedUser($request);

    return response()->json([
        "status" => "success",
        "data" => [
            "id"              => $user->id,
            "name"            => $user->name,
            "email"           => $user->email,
            "position_title"  => $user->position?->title ?? 'Не указана',
            "academic_degree" => $user->academic_degree?->title ?? 'Без степени',
            "department"      => $user->department?->title ?? 'Вне кафедры',
            "dean"            => $user->department?->short_name ?? '',
            "min_kpi"         => $user->position?->min_kpi_target ?? 0,
            "current_kpi"     => $user->current_kpi ?? 0, // если есть такое поле
        ]
    ]);
}
}
