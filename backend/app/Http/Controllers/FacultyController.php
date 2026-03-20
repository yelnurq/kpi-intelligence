<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FacultyController extends Controller
{
    public function index(): JsonResponse
    {
        // Указываем правильное имя таблицы из твоей модели KpiActivity
        $tableName = 'kpi_activities'; 

        $faculties = Faculty::withCount(['users as students_count'])
            ->addSelect([
                // Используем total_points вместо points
                'total_score' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->selectRaw('SUM(total_points)'),

                // Эффективность (среднее по total_points)
                'efficiency_raw' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->selectRaw('COALESCE(AVG(total_points), 0)'),

                // Баллы неделю назад для тренда
                'last_week_score' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->where("$tableName.created_at", '<', Carbon::now()->subWeek())
                    ->selectRaw('SUM(total_points)')
            ])
            ->orderByDesc('total_score')
            ->get();

        $formattedFaculties = $faculties->map(function ($faculty, $index) {
            $current = (int) $faculty->total_score;
            $old = (int) $faculty->last_week_score;

            return [
                'id' => $faculty->id,
                'name' => $faculty->title, // Полное название из твоей модели
                'short' => $faculty->short_title ?? $faculty->short_name, // Пробуем short_title, иначе short_name
                'score' => $current,
                'students' => $faculty->students_count,
                'efficiency' => $this->calculateEff($faculty->efficiency_raw),
                'trend' => $current >= $old ? 'up' : 'down',
                'change' => $this->getChange($current, $old),
                'color' => $this->getColor($index),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'faculties' => $formattedFaculties,
                'total_fund' => $formattedFaculties->sum('score'),
                'last_updated' => now()->format('H:i'),
            ]
        ]);
    }

    private function calculateEff($avg): int 
    {
        // Допустим, 100 total_points в среднем на человека — это 100% эффективность
        $target = 100; 
        return min(round(((float)$avg / $target) * 100), 100);
    }

    private function getChange($current, $old): string 
    {
        if ($old <= 0) return '+0%';
        $diff = (($current - $old) / $old) * 100;
        return ($diff >= 0 ? '+' : '') . round($diff, 1) . '%';
    }

    private function getColor($i): string 
    {
        $colors = ['bg-blue-600', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
        return $colors[$i] ?? 'bg-slate-500';
    }
}