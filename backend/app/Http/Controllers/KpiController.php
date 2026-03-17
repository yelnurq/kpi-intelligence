<?php

namespace App\Http\Controllers;

use App\Models\KpiActivity;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KpiController extends Controller
{
    public function storeActivity(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'indicator_id' => 'required|exists:kpi_indicators,id',
            'quantity' => 'required|integer|min:1',
            'evidence_link' => 'nullable|url'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $activity = KpiActivity::create([
            'user_id' => auth()->id(),
            'indicator_id' => $request->indicator_id,
            'quantity' => $request->quantity,
            'status' => 'pending'
        ]);

        if ($request->evidence_link) {
            $activity->evidence()->create(['link' => $request->evidence_link]);
        }

        return response()->json(['message' => 'Заявка отправлена', 'data' => $activity], 201);
    }

    public function myRating()
    {
        $user = auth()->user()->loadSum(['activities' => function($query) {
            $query->where('status', 'approved');
        }], 'total_points');

        return response()->json([
            'name' => $user->name,
            'total_kpi' => $user->activities_sum_total_points ?? 0
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
            'department' => $department->name,
            'rating' => $rating
        ]);
    }
}