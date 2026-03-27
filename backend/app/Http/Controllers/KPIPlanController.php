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

    // Тянем ID индикаторов, которые мы только что сохранили в savePlan
    $selectedIds = UserKpiPlan::where('user_id', $user->id)
        ->where('academic_year', $year)
        ->pluck('kpi_indicator_id');

    // Тянем статус из таблицы сабмитов (отправлено/утверждено)
    $submission = KpiPlanSubmission::where('user_id', $user->id)
        ->where('academic_year', $year)
        ->first();

    return response()->json([
        'status' => 'success',
        'selected_ids' => $selectedIds, // Это заполнит синие галочки на фронте
        'plan_status' => $submission ? $submission->status : 'draft',
        'comment' => $submission ? $submission->comment : null
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
        
        // Проверка на админа
        if (!$user || (int)$user->is_admin !== 1) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $year = $request->query('year', '2025/2026');

        // ВАЖНО: Проверь правильность имен таблиц (faculties, departments)
        $submissions = \App\Models\User::join('kpi_plan_submissions', 'users.id', '=', 'kpi_plan_submissions.user_id')
            ->leftJoin('faculties', 'users.faculty_id', '=', 'faculties.id')
            ->leftJoin('departments', 'users.department_id', '=', 'departments.id')
            ->where('kpi_plan_submissions.academic_year', $year)
            ->select(
                'users.id as user_id',
                'users.name',
                'faculties.short_title as faculty',
                'departments.short_name as department',
                'kpi_plan_submissions.status',
                'kpi_plan_submissions.academic_year',
                'kpi_plan_submissions.submitted_at',
                'kpi_plan_submissions.comment'
            )
            ->get()
            ->map(function($item) {
                // Считаем баллы
                $item->total_points = \App\Models\UserKpiPlan::where('user_id', $item->user_id)
                    ->where('academic_year', $item->academic_year)
                    ->join('kpi_indicators', 'user_kpi_plans.kpi_indicator_id', '=', 'kpi_indicators.id')
                    ->sum('kpi_indicators.points');
                
                return $item;
            });

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ]);

    } catch (\Exception $e) {
        // Если будет ошибка в SQL, мы увидим её в JSON, а не в HTML
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}
// 1. Получение индикаторов конкретного пользователя
public function getUserPlanDetails(Request $request, $userId)
{
    $year = $request->query('year', '2025/2026');

    $indicators = \App\Models\UserKpiPlan::where('user_id', $userId)
        ->where('academic_year', $year)
        ->join('kpi_indicators', 'user_kpi_plans.kpi_indicator_id', '=', 'kpi_indicators.id')
        ->select('kpi_indicators.title', 'kpi_indicators.points')
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