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
        $tableName = 'kpi_activities'; 

        $faculties = Faculty::withCount(['users as total_staff']) // Общий штат факультета
            ->addSelect([
                // 1. Суммарный балл (Approved)
                'total_score' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->selectRaw('COALESCE(SUM(total_points), 0)'),

                // 2. Активные сотрудники (уникальные user_id с одобренными записями)
                'active_staff_count' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->selectRaw('COUNT(DISTINCT user_id)'),

                // 3. Эффективность (среднее по активностям)
                'efficiency_raw' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->selectRaw('COALESCE(AVG(total_points), 0)'),

                // 4. Баллы неделю назад
                'last_week_score' => DB::table($tableName)
                    ->join('users', "$tableName.user_id", '=', 'users.id')
                    ->whereColumn('users.faculty_id', 'faculties.id')
                    ->where("$tableName.status", '=', 'approved')
                    ->where("$tableName.created_at", '<', Carbon::now()->subWeek())
                    ->selectRaw('COALESCE(SUM(total_points), 0)')
            ])
            ->orderByDesc('total_score')
            ->get();

        $formattedFaculties = $faculties->map(function ($faculty, $index) {
            $current = (int) $faculty->total_score;
            $old = (int) $faculty->last_week_score;
            $active = (int) $faculty->active_staff_count;
            $total = (int) $faculty->total_staff;

            return [
                'id' => $faculty->id,
                'name' => $faculty->title, 
                'short' => $faculty->short_title ?? $faculty->short_name, 
                'score' => $current,
                'students' => $active, // Для совместимости с твоим фронтендом (используем активных для расчета среднего)
                'active_staff' => $active,
                'total_staff' => $total,
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
        $target = 100; // Целевой средний балл за одну активность
        return min(round(((float)$avg / $target) * 100), 100);
    }

    private function getChange($current, $old): string 
    {
        if ($old <= 0) return $current > 0 ? '+100%' : '+0%';
        $diff = (($current - $old) / $old) * 100;
        return ($diff >= 0 ? '+' : '') . round($diff, 1) . '%';
    }

    private function getColor($i): string 
    {
        $colors = ['bg-blue-600', 'bg-slate-800', 'bg-slate-600', 'bg-slate-400', 'bg-slate-300'];
        return $colors[$i] ?? 'bg-slate-200';
    }
}