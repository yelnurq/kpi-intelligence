<?php

namespace App\Http\Controllers;

use App\Models\KpiActivity;
use App\Models\User;
use App\Models\Token;
use Illuminate\Http\Request;

class KpiActivityController extends Controller
{
private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }
public function index(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $query = KpiActivity::where('user_id', $user->id)
        ->with(['indicator', 'evidence']) // Жадная загрузка индикатора
        ->orderBy('created_at', 'desc');

    $activities = $query->get();

    $stats = [
        'total' => $activities->count(),
        'approved' => $activities->where('status', 'approved')->count(),
        'pending' => $activities->where('status', 'pending')->count(),
        'rejected' => $activities->where('status', 'rejected')->count(),
    ];

    return response()->json([
        'status' => 'success',
        'data' => $activities->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title ?? $item->indicator->title,
                'category' => $item->indicator->category ?? 'Общее',
                'date' => $item->created_at->format('d.m.Y'),
                // Берем баллы напрямую из связанного индикатора
                'points' => $item->indicator ? $item->indicator->points : 0, 
                // Если нужно общее кол-во (баллы * количество), оставь так:
                'total_points' => $item->total_points, 
                'status' => $item->status,
                'reason' => $item->rejection_reason,
                'files_count' => $item->evidence->count(),
                'files' => $item->evidence->map(function ($file) {
                    return [
                        'name' => $file->file_name,
                        'url' => asset('storage/' . $file->file_path),
                    ];
                }),
            ];
        }),
        'stats' => $stats
    ]);
}
public function store(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $request->validate([
        'indicator_id' => 'required|exists:kpi_indicators,id',
        'quantity' => 'required|integer|min:1',
        'files.*' => 'required|file|max:10240', // 10MB на файл
    ]);

    $activity = KpiActivity::create([
        'user_id' => $user->id,
        'indicator_id' => $request->indicator_id,
        'quantity' => $request->quantity,
        'status' => 'pending'
    ]);

    // 2. Сохраняем файлы в таблицу KpiEvidence
    if ($request->hasFile('files')) {
        foreach ($request->file('files') as $file) {
            $path = $file->store('kpi_evidence', 'public');
            
            $activity->evidence()->create([
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType()
            ]);
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => 'Заявка отправлена',
        'activity_id' => $activity->id
    ]);
}
}
