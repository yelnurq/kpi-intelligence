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
    // 1. Используем твой кастомный метод для получения юзера
    $userBase = $this->getAuthenticatedUser($request);

    if (!$userBase) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    // 2. Загружаем связи (Eager Loading), чтобы не делать 5 лишних запросов к базе
    $user = \App\Models\User::with([
        'position', 
        'academic_degree', 
        'faculty', 
        'department'
    ])->find($userBase->id);

    // 3. Считаем подтвержденные баллы
    $currentKpi = \App\Models\KpiActivity::where('user_id', $user->id)
        ->where('status', 'approved')
        ->sum('total_points');

    // 4. Считаем баллы в ожидании (те, что админ еще не проверил)
    $pendingKpi = \App\Models\KpiActivity::where('user_id', $user->id)
        ->where('status', 'pending')
        ->sum('total_points');

    return response()->json([
        "status" => "success",
        "data" => [
            "id"              => $user->id,
            "name"            => $user->name,
            "email"           => $user->email,
            "position_title"  => $user->position?->title ?? 'Не указана',
            "academic_degree" => $user->academic_degree?->title ?? 'Без степени',
            "dean"            => $user->faculty?->short_name ?? '',
            "faculty"         => $user->faculty?->title ?? 'Вне факультета',
            "department"      => $user->department?->title ?? 'Вне кафедры',
            "department_leader" => $user->department?->short_name ?? '',
            "min_kpi"         => (int)($user->position?->min_kpi_target ?? 0),
            
            // Основной балл
            "current_kpi"     => (int)$currentKpi, 
            
            // Баллы "в пути" (на проверке)
            "pending_kpi"     => (int)$pendingKpi,
            
            // Процент выполнения плана (если min_kpi > 0)
            "progress_percent" => ($user->position?->min_kpi_target > 0) 
                ? round(($currentKpi / $user->position->min_kpi_target) * 100, 1) 
                : 0
        ]
    ]);
}
}
