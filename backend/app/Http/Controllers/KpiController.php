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
        ->with(['indicator.activities' => function($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->get();

    $indicators = $myPlans->map(function ($plan) {
        $activities = $plan->indicator->activities;
        
        $isApproved = $activities->where('status', 'approved')->isNotEmpty();
        $isPending = $activities->where('status', 'pending')->isNotEmpty();

        // Определяем системный прогресс
        $progress = 0;
        $displayStatus = 'active'; // по умолчанию

        if ($isApproved) {
            $progress = 100;
            $displayStatus = 'completed';
        } elseif ($isPending) {
            $progress = 50; // Условный прогресс для анимации полоски
            $displayStatus = 'checking';
        }

        return [
            'id' => $plan->indicator->id,
            'title' => $plan->indicator->title,
            'weight' => $plan->indicator->points,
            'category' => $plan->indicator->category,
            'deadline' => $plan->deadline ? $plan->deadline->format('Y-m-d') : '2026-12-31', 
            'progress' => $progress,
            'db_status' => $displayStatus // Передаем статус для фронта
        ];
    });

    return response()->json([
        'status' => 'success',
        'data' => $indicators
    ]);
}
public function getStaffDeadlineMonitor(Request $request) 
{
    // Загружаем юзеров со всеми планами и всеми их активностями
    $users = User::with(['kpiPlans.indicator', 'activities', 'faculty'])
        ->get()
        ->map(function($user) {
            
            $plans = $user->kpiPlans;
            $allUserActivities = $user->activities; // Коллекция всех загрузок юзера
            
            // 1. Считаем выполненные планы
            // Мы смотрим, есть ли в коллекции активностей записи с нужным indicator_id
            $completedCount = $plans->filter(function($plan) use ($allUserActivities) {
                return $allUserActivities->where('indicator_id', $plan->kpi_indicator_id)->isNotEmpty();
            })->count();

            // 2. Расчет прогресса
            $totalCount = $plans->count();
            $progress = $totalCount > 0 ? round(($completedCount / $totalCount) * 100) : 0;

            // 3. Считаем просроченные (Дедлайн прошел И активности нет)
            $overdueCount = $plans->filter(function($plan) use ($allUserActivities) {
                $hasActivity = $allUserActivities->where('indicator_id', $plan->kpi_indicator_id)->isNotEmpty();
                return $plan->deadline < now() && !$hasActivity;
            })->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'faculty' => $user->faculty->short_title ?? $user->faculty->title ?? '—',
                'overdue' => $overdueCount,
                'progress' => $progress,
                'indicators' => $plans->map(function($plan) use ($allUserActivities) {
                    $hasActivity = $allUserActivities->where('indicator_id', $plan->kpi_indicator_id)->isNotEmpty();
                    $isOverdue = $plan->deadline < now() && !$hasActivity;
                    
                    return [
                        'id' => $plan->id,
                        'title' => $plan->indicator->name ?? $plan->indicator->title ?? 'Без названия',
                        'status' => $hasActivity ? 'completed' : ($isOverdue ? 'overdue' : 'pending'),
                        'date' => $plan->deadline ? $plan->deadline->format('Y-m-d') : '—'
                    ];
                })
            ];
        });

    return response()->json(['status' => 'success', 'data' => $users]);
}
}