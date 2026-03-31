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
        $user = $this->getAuthenticatedUser($request);
        $allowedRoles = ['dean', 'super_admin'];
        if (!$user || !in_array($user->role, $allowedRoles)) {
            return response()->json(['status' => 'error', 'message' => 'Доступ запрещен'], 403);
        }

        $year = $request->query('year', '2025/2026');
        $deptId = $request->query('department_id');
        $perPage = $request->query('per_page', 10);

        // Создаем базовый запрос для статистики (без пагинации и селекта)
        $baseQuery = \App\Models\User::query()
            ->join('kpi_plan_submissions', 'users.id', '=', 'kpi_plan_submissions.user_id')
            ->where('kpi_plan_submissions.academic_year', $year);

        if ($user->role === 'dean') {
            $baseQuery->where('users.faculty_id', $user->faculty_id);
        }

        // РАСЧЕТ СТАТИСТИКИ ПО ВСЕЙ БАЗЕ
        // Копируем запрос, чтобы фильтры по кафедрам/статусам не ломали общую статистику 
        // (или наоборот, если статистика должна зависеть от фильтра кафедры - уберите/оставьте условия ниже)
        $statsData = [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('kpi_plan_submissions.status', 'submitted')->count(),
            'approved' => (clone $baseQuery)->where('kpi_plan_submissions.status', 'approved')->count(),
            'rejected' => (clone $baseQuery)->where('kpi_plan_submissions.status', 'rejected')->count(),
        ];

        // ПРИМЕНЯЕМ ФИЛЬТРЫ ДЛЯ ОСНОВНОГО СПИСКА
        $query = (clone $baseQuery)
            ->leftJoin('faculties', 'users.faculty_id', '=', 'faculties.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id');

        if ($deptId && $deptId !== 'all') {
            $query->where('users.department_id', $deptId);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('kpi_plan_submissions.status', $request->status);
        }

        $submissionsPaginator = $query->select(
                'users.id as user_id',
                'users.name',
                'faculties.short_title as faculty',
                'departments.title as department',
                'kpi_plan_submissions.status',
                'kpi_plan_submissions.academic_year',
                'kpi_plan_submissions.submitted_at',
                'kpi_plan_submissions.comment'
            )
            ->orderBy('kpi_plan_submissions.submitted_at', 'desc')
            ->paginate($perPage);

        $submissionsPaginator->through(function($item) {
            $item->total_points = \App\Models\UserKpiPlan::where('user_id', $item->user_id)
                ->where('academic_year', $item->academic_year)
                ->join('kpi_indicators', 'user_kpi_plans.kpi_indicator_id', '=', 'kpi_indicators.id')
                ->sum('kpi_indicators.points');
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $submissionsPaginator->items(),
            'stats' => $statsData, // Передаем статистику всей базы
            'meta' => [
                'current_page' => $submissionsPaginator->currentPage(),
                'last_page' => $submissionsPaginator->lastPage(),
                'total' => $submissionsPaginator->total(), // Всего записей с учетом текущих фильтров
                'per_page' => $submissionsPaginator->perPage(),
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
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