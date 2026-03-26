<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserKpiPlan; // Твоя текущая модель для индикаторов
use App\Models\KpiPlanSubmission; // Новая модель для статуса
use Illuminate\Support\Facades\Auth;

class KPIPlanController extends Controller
{
    // 1. Получение данных: индикаторы + статус плана
    public function getPlanStatus(Request $request)
    {
        $userId = Auth::id();
        $year = $request->query('year', '2025/2026');

        // Получаем все ID выбранных индикаторов из твоей таблицы
        $selectedIds = UserKpiPlan::where('user_id', $userId)
            ->where('academic_year', $year)
            ->pluck('kpi_indicator_id');

        // Получаем общую информацию о подаче (статус)
        $submission = KpiPlanSubmission::where('user_id', $userId)
            ->where('academic_year', $year)
            ->first();

        return response()->json([
            'status' => 'success',
            'selected_ids' => $selectedIds,
            'plan_status' => $submission ? $submission->status : 'draft',
            'comment' => $submission ? $submission->comment : null
        ]);
    }

    // 2. Финальная отправка плана декану
    public function submitPlan(Request $request)
    {
        $userId = Auth::id();
        $year = $request->academic_year;

        $existing = KpiPlanSubmission::where('user_id', $userId)
            ->where('academic_year', $year)
            ->first();

        if ($existing && $existing->status === 'approved') {
            return response()->json(['message' => 'План уже утвержден'], 403);
        }

        KpiPlanSubmission::updateOrCreate(
            ['user_id' => $userId, 'academic_year' => $year],
            [
                'status' => 'submitted',
                'submitted_at' => now(),
                'comment' => null // Очищаем старые комменты при переподаче
            ]
        );

        return response()->json(['status' => 'success', 'message' => 'План отправлен на проверку']);
    }
}