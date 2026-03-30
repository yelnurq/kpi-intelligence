<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserKpiPlan; // Твоя текущая модель для индикаторов
use App\Models\KpiPlanSubmission; // Новая модель для статуса
use App\Models\Token;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class KPIPlanController extends Controller
{
    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }

   // В твоем KPIPlanController.php проверь этот кусок:
public function getPlanStatus(Request $request)
{
    $user = $this->getAuthenticatedUser($request);
    $year = $request->query('year', '2025/2026');

    // 1. Тянем данные по индикаторам (ID + Дедлайны)
    $planData = \App\Models\UserKpiPlan::where('user_id', $user->id)
        ->where('academic_year', $year)
        ->get(['kpi_indicator_id', 'deadline']);

    // Превращаем в плоский массив для синих галочек [1, 5, 10...]
    $selectedIds = $planData->pluck('kpi_indicator_id');

    // Превращаем в объект для дедлайнов { "1": "2026-05-20", "5": "2026-06-01" }
    $deadlines = $planData->pluck('deadline', 'kpi_indicator_id');

    // 2. Тянем статус сабмита
    $submission = \App\Models\KpiPlanSubmission::where('user_id', $user->id)
        ->where('academic_year', $year)
        ->first();

    return response()->json([
        'status' => 'success',
        'selected_ids' => $selectedIds,
        'deadlines'    => $deadlines, // Добавляем этот ключ!
        'plan_status'  => $submission ? $submission->status : 'draft',
        'comment'      => $submission ? $submission->comment : null
    ]);
}
 public function submitPlan(Request $request)
{
    $user = $this->getAuthenticatedUser($request);
    $year = $request->academic_year;

    // 1. Валидация входных данных
    $request->validate([
        'items' => 'required|array',
        'academic_year' => 'required|string'
    ]);

    // 2. Проверка статуса (нельзя менять утвержденный план)
    $existingSubmission = KpiPlanSubmission::where('user_id', $user->id)
        ->where('academic_year', $year)
        ->first();

    if ($existingSubmission && $existingSubmission->status === 'approved') {
        return response()->json(['message' => 'План уже утвержден и не может быть изменен'], 403);
    }

    try {
        \DB::beginTransaction();

        // 3. УДАЛЯЕМ старые индикаторы за этот год и ЗАПИСЫВАЕМ новые с дедлайнами
        \DB::table('user_kpi_plans')
            ->where('user_id', $user->id)
            ->where('academic_year', $year)
            ->delete();

        $plansToInsert = [];
        foreach ($request->items as $item) {
            $plansToInsert[] = [
                'user_id'          => $user->id,
                'kpi_indicator_id' => $item['indicator_id'],
                'academic_year'    => $year,
                'deadline'         => $item['deadline'], // Теперь записываем дату!
                'created_at'       => now(),
                'updated_at'       => now(),
            ];
        }

        if (!empty($plansToInsert)) {
            \DB::table('user_kpi_plans')->insert($plansToInsert);
        }

        // 4. Обновляем статус подачи
        KpiPlanSubmission::updateOrCreate(
            ['user_id' => $user->id, 'academic_year' => $year],
            [
                'status' => 'submitted',
                'submitted_at' => now(),
                'comment' => null 
            ]
        );

        \DB::commit();
        return response()->json(['status' => 'success', 'message' => 'Индикаторы сохранены, план отправлен на проверку']);

    } catch (\Exception $e) {
        \DB::rollBack();
        return response()->json([
            'status' => 'error', 
            'message' => 'Ошибка при сохранении: ' . $e->getMessage()
        ], 500);
    }
}
public function getDeanSubmissions(Request $request)
{
    try {
        // 1. Получаем текущего пользователя через Sanctum/JWT
    $user = $this->getAuthenticatedUser($request);
        
        // 2. Проверка доступа: разрешаем только Декану и Супер-админу
        $allowedRoles = ['dean', 'super_admin'];
        if (!$user || !in_array($user->role, $allowedRoles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Доступ запрещен: недостаточно прав'
            ], 403);
        }

        // 3. Получаем параметры фильтрации из запроса
        $year = $request->query('year', '2025/2026');
        $deptId = $request->query('department_id'); // Если захочешь фильтровать по конкретной кафедре

        // 4. Строим запрос
        $query = \App\Models\User::query()
            // Присоединяем таблицу заявок (submissions)
            ->join('kpi_plan_submissions', 'users.id', '=', 'kpi_plan_submissions.user_id')
            // Присоединяем факультеты и кафедры для отображения названий
            ->leftJoin('faculties', 'users.faculty_id', '=', 'faculties.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            // Фильтр по учебному году
            ->where('kpi_plan_submissions.academic_year', $year);

        // --- ЛОГИКА ОГРАНИЧЕНИЯ ДЛЯ ДЕКАНА ---
        if ($user->role === 'dean') {
            if (!$user->faculty_id) {
                return response()->json(['message' => 'Ошибка: Декан не привязан к факультету'], 400);
            }
            // Декан видит ТОЛЬКО сотрудников своего факультета (и их кафедры)
            $query->where('users.faculty_id', $user->faculty_id);
        }

        // --- ДОПОЛНИТЕЛЬНЫЙ ФИЛЬТР ПО КАФЕДРЕ (если выбран на фронте) ---
        if ($deptId && $deptId !== 'all') {
            $query->where('users.department_id', $deptId);
        }

        // 5. Выбираем нужные поля
        $submissions = $query->select(
                'users.id as user_id',
                'users.name',
                'faculties.title as faculty_name',      // Полное название
                'faculties.short_title as faculty',     // Сокращение (ФИТ, ФЭ...)
                'departments.title as department', // Сокращение (ИТ, Экономика...)
                'kpi_plan_submissions.status',
                'kpi_plan_submissions.academic_year',
                'kpi_plan_submissions.submitted_at',
                'kpi_plan_submissions.comment'
            )
            ->orderBy('kpi_plan_submissions.submitted_at', 'desc')
            ->get()
            ->map(function($item) {
                // 6. Считаем сумму баллов по каждому плану
                // Соединяем таблицу планов пользователя с таблицей эталонных индикаторов
                $item->total_points = \App\Models\UserKpiPlan::where('user_id', $item->user_id)
                    ->where('academic_year', $item->academic_year)
                    ->join('kpi_indicators', 'user_kpi_plans.kpi_indicator_id', '=', 'kpi_indicators.id')
                    ->sum('kpi_indicators.points');
                
                return $item;
            });

        return response()->json([
            'status' => 'success',
            'count' => $submissions->count(),
            'data' => $submissions
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка сервера: ' . $e->getMessage()
        ], 500);
    }
}
public function getUserPlanDetails(Request $request, $userId)
{
    $year = $request->query('year', '2025/2026');

    $indicators = \App\Models\UserKpiPlan::where('user_id', $userId)
        ->where('academic_year', $year)
        ->join('kpi_indicators', 'user_kpi_plans.kpi_indicator_id', '=', 'kpi_indicators.id')
        ->select(
            'kpi_indicators.title', 
            'kpi_indicators.points', 
            'user_kpi_plans.deadline' 
        )
        ->get();

    return response()->json([
        'status' => 'success',
        'indicators' => $indicators
    ]);
}

// 2. Обновление статуса (Approved/Rejected)
public function updatePlanStatus(Request $request)
{
    $request->validate([
        'user_id' => 'required',
        'status' => 'required|in:approved,rejected',
        'academic_year' => 'required'
    ]);

    $submission = \App\Models\KpiPlanSubmission::where('user_id', $request->user_id)
        ->where('academic_year', $request->academic_year)
        ->first();

    if ($submission) {
        $submission->update([
            'status' => $request->status,
            'comment' => $request->comment
        ]);
        return response()->json(['status' => 'success']);
    }

    return response()->json(['status' => 'error', 'message' => 'Запись не найдена'], 404);
}
    }