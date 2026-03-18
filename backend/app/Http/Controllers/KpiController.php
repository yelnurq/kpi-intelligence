<?php

namespace App\Http\Controllers;

use App\Models\KpiActivity;
use App\Models\Department;
use App\Models\KpiIndicator;
use App\Models\Token; // Твоя модель токенов
use App\Models\User;
use App\Models\UserKpiPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KpiController extends Controller
{
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

    // Удаляем старые записи
    UserKpiPlan::where('user_id', $user->id)
        ->where('academic_year', $request->academic_year)
        ->delete();

    // Подготавливаем данные для одного запроса
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

    public function getIndicators()
    {
        $indicators = KpiIndicator::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $indicators
        ]);
    }
}