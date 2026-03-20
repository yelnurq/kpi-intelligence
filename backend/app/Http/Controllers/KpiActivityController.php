<?php

namespace App\Http\Controllers;

use App\Models\KpiActivity;
use App\Models\User;
use App\Models\Token;
use Illuminate\Http\Request;
use App\Models\UserKpiPlan;
use Illuminate\Validation\Rule;
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
    public function latest(Request $request)
    {
        $user = $this->getAuthenticatedUser($request);

        $query = KpiActivity::where('user_id', $user->id)
            ->with(['indicator', 'evidence'])
            ->orderBy('created_at', 'desc')
            ->limit(5); 

        $activities = $query->get();

        $allStats = KpiActivity::where('user_id', $user->id)->select('status')->get();

        $stats = [
            'total' => $allStats->count(),
            'approved' => $allStats->where('status', 'approved')->count(),
            'pending' => $allStats->where('status', 'pending')->count(),
            'rejected' => $allStats->where('status', 'rejected')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $activities->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title ?? ($item->indicator->title ?? 'Без названия'),
                    'category' => $item->indicator->category ?? 'Общее',
                    'date' => $item->created_at->format('d.m.Y'),
                    'points' => $item->indicator ? $item->indicator->points : 0, 
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
public function admin(Request $request)
{
    try {
        $query = \App\Models\KpiActivity::with(['user.faculty', 'indicator', 'evidence']);

        if ($request->has('faculty') && $request->faculty !== 'all') {
            $query->whereHas('user.faculty', function($q) use ($request) {
                $q->where('title', $request->faculty); 
            });
        }

        $activities = $query->orderBy('created_at', 'desc')->get();

        $allFaculties = \App\Models\Faculty::pluck('title')->toArray();

        $groupedByFaculty = $activities->groupBy(function ($activity) {
            return $activity->user->faculty->title ?? 'Общий факультет';
        })->map(function ($facultyActivities, $facultyName) {
            return [
                'faculty' => $facultyName,
                'items' => $facultyActivities->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'user_name' => $item->user->name ?? 'Сотрудник',
                        'title' => $item->title ?? ($item->indicator->title ?? 'Без названия'),
                        'category' => $item->indicator->category ?? 'Общее',
                        'date' => $item->created_at->format('d.m.Y'),
                        'total_points' => $item->indicator->points,
                        'status' => $item->status,
                        'comment' => $item->comment, // Твой комментарий (причина отказа)
                        'files' => $item->evidence ? $item->evidence->map(fn($f) => [
                            'name' => $f->file_name,
                            'url' => asset('storage/' . $f->file_path)
                        ]) : [],
                    ];
                })->values()
            ];
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $groupedByFaculty,
            'faculties' => $allFaculties,
            'stats' => [
                'total' => $activities->count(),
                'approved' => $activities->where('status', 'approved')->count(),
                'pending' => $activities->where('status', 'pending')->count(),
                'rejected' => $activities->where('status', 'rejected')->count(),
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error', 
            'message' => 'Ошибка SQL: ' . $e->getMessage()
        ], 500);
    }
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
                    'total_points' => $item->indicator->points ?? 0, 
                    'status' => $item->status,
                    'comment' => $item->comment,
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
public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|in:approved,rejected',
        'comment' => 'nullable|string'
    ]);

    // Загружаем активность вместе с индикатором
    $activity = \App\Models\KpiActivity::with('indicator')->findOrFail($id);
    
    $activity->status = $request->status;
    
    if ($request->status === 'approved') {
        // Очищаем комментарий при одобрении
        $activity->comment = null;
        
        // РАСЧЕТ: Берем актуальный вес из индикатора и умножаем на количество в заявке
        // Если вес не найден в индикаторе, оставляем старый total_points или ставим 0
        if ($activity->indicator) {
            $activity->total_points = $activity->indicator->points;
        }
    } else {
        // Если отклонено (rejected)
        $activity->comment = $request->comment;
        // Опционально: можно обнулять баллы при отказе, чтобы они не путались в статистике
        // $activity->total_points = 0; 
    }

    $activity->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Статус успешно обновлен',
        'data' => [
            'new_status' => $activity->status,
            'final_points' => $activity->total_points
        ]
    ]);
}

public function store(Request $request)
{
    $user = $this->getAuthenticatedUser($request);

    $request->validate([
        // Проверяем, что индикатор не просто существует, 
        // а привязан именно к этому пользователю в таблице планов
        'indicator_id' => [
            'required',
            Rule::exists('user_kpi_plans', 'kpi_indicator_id')->where(function ($query) use ($user) {
                $query->where('user_id', $user->id);
                // Если у тебя есть учебные года, можно добавить и текущий год:
                // ->where('academic_year', '2025-2026'); 
            }),
        ],
        'quantity' => 'required|integer|min:1',
        'files' => 'required|array|min:1', // Убедимся, что файлы переданы
        'files.*' => 'file|max:10240',
    ], [
        'indicator_id.exists' => 'Вы не можете подавать отчет по индикатору, которого нет в вашем плане.'
    ]);

    // Дальше твой код создания записи
    $activity = KpiActivity::create([
        'user_id' => $user->id,
        'indicator_id' => $request->indicator_id,
        'quantity' => $request->quantity,
        'status' => 'pending'
    ]);

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
