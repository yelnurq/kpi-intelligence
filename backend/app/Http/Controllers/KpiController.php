<?php

namespace App\Http\Controllers;

use App\Exports\KPIExport;
use App\Models\KpiActivity;
use App\Models\Department;
use App\Models\KpiIndicator;
use App\Models\Token; 
use App\Models\User;
use App\Models\UserKpiPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class KpiController extends Controller
{
    public function export(Request $request)
    {
    $user = $this->getAuthenticatedUser($request);
    $year = $request->query('year');
    
    $indicatorIds = $request->input('indicator_ids', []);
    $selectedItems = \App\Models\KpiIndicator::whereIn('id', $indicatorIds)->get();

    $data = [
        'user' => $user,
        'year' => $year,
        'selectedItems' => $selectedItems 
    ];

    return Excel::download(new KPIExport($data), 'kpi_report.xlsx');
}
    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }

    public function storeActivity(Request $request)
    {
        $user = $this->getAuthenticatedUser($request);
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'indicator_id' => 'required|exists:kpi_indicators,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $activity = KpiActivity::create([
            'user_id' => $user->id, 
            'indicator_id' => $request->indicator_id,
            'quantity' => $request->quantity,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Успешно сохранено', 'data' => $activity], 201);
    }

    public function myRating(Request $request)
    {
        $user = $this->getAuthenticatedUser($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->loadSum(['activities' => function($query) {
            $query->where('status', 'approved');
        }], 'total_points');

        return response()->json([
            'name' => $user->name,
            'total_kpi' => (float) ($user->activities_sum_total_points ?? 0)
        ]);
    }

    public function departmentRating($id)
    {
        $department = Department::findOrFail($id);
        
        $rating = User::where('department_id', $id)
            ->withSum(['activities' => function($query) {
                $query->where('status', 'approved');
            }], 'total_points')
            ->orderBy('activities_sum_total_points', 'desc')
            ->get();

        return response()->json([
            'department' => $department->title, 
            'rating' => $rating
        ]);
    }
public function savePlan(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $request->validate([
        'items' => 'required|array',
        'academic_year' => 'required|string'
    ]);

    UserKpiPlan::where('user_id', $user->id)
        ->where('academic_year', $request->academic_year)
        ->delete();

    $data = [];
    foreach ($request->items as $item) {
        $data[] = [
            'user_id'          => $user->id,
            'kpi_indicator_id' => (int)$item['indicator_id'],
            'academic_year'    => $request->academic_year,
            // Явно берем deadline из входящего массива
            'deadline'         => $item['deadline'] ?? null, 
            'created_at'       => now(),
            'updated_at'       => now(),
        ];
    }

    if (!empty($data)) {
        // Используем DB фасад или модель для вставки
        \DB::table('user_kpi_plans')->insert($data);
    }

    return response()->json([
        'status' => 'success', 
        'saved_count' => count($data),
        'first_item_deadline' => $data[0]['deadline'] // Для теста в ответе
    ]);
}
    public function getPlan(Request $request)
    {
        $user = $this->getAuthenticatedUser($request);
        
        $ids = UserKpiPlan::where('user_id', $user->id)
            ->where('academic_year', $request->query('year'))
            ->pluck('kpi_indicator_id');

        return response()->json(['status' => 'success', 'data' => $ids]);
    }
    public function getIndicators()
    {
        $indicators = KpiIndicator::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $indicators
        ]);
    }
    public function getMyIndicators(Request $request)
{
    // 1. Получаем текущего авторизованного пользователя
    $user = $this->getAuthenticatedUser($request);

    $myPlans = \App\Models\UserKpiPlan::where('user_id', $user->id)
        ->with('indicator')
        ->get();

    // 3. Форматируем данные, чтобы фронтенд получил чистый список объектов индикаторов
    $indicators = $myPlans->map(function ($plan) {
        return [
            'id' => $plan->indicator->id,
            'title' => $plan->indicator->title,
            'points' => $plan->indicator->points,
            'category' => $plan->indicator->category,
            // можно добавить данные из плана, если нужно (например, целевое количество)
            'target_quantity' => $plan->target_quantity ?? 0, 
        ];
    });

    return response()->json([
        'status' => 'success',
        'data' => $indicators
    ]);
}
public function getMyIndicatorsDeadline(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $myPlans = \App\Models\UserKpiPlan::where('user_id', $user->id)
        ->with('indicator')
        ->get();

    $indicators = $myPlans->map(function ($plan) {
        return [
            'id' => $plan->indicator->id,
            'title' => $plan->indicator->title,
            'weight' => $plan->indicator->points, // На фронте у тебя weight
            'category' => $plan->indicator->category,
            'target_quantity' => $plan->target_quantity ?? 0,
            // Добавляем дедлайн. Если в БД он типа Date, Carbon отформатирует его
            'deadline' => $plan->deadline ? $plan->deadline->format('Y-m-d') : '2026-12-31', 
            // Добавим прогресс (если есть в таблице планов, иначе 0)
            'progress' => $plan->progress ?? 0, 
        ];
    });

    return response()->json([
        'status' => 'success',
        'data' => $indicators
    ]);
}
}