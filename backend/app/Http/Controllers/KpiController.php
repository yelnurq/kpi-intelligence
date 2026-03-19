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
            'indicator_ids' => 'required|array',
            'academic_year' => 'required|string'
        ]);

        UserKpiPlan::where('user_id', $user->id)
            ->where('academic_year', $request->academic_year)
            ->delete();

        $data = collect($request->indicator_ids)->map(function($id) use ($user, $request) {
            return [
                'user_id' => $user->id,
                'kpi_indicator_id' => $id,
                'academic_year' => $request->academic_year,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        UserKpiPlan::insert($data);

        return response()->json(['status' => 'success', 'message' => 'План успешно сохранен']);
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

    // 2. Делаем запрос к модели UserKpiPlan, вытягивая только индикаторы этого юзера
    // Используем with('indicator'), чтобы подгрузить данные из основной таблицы kpi_indicators
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
}