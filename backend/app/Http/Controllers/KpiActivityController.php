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
        // Добавляем latest() в начало, чтобы база сразу отдала свежие записи
        $query = \App\Models\KpiActivity::latest()
            ->with(['user.faculty', 'indicator', 'evidence']);

        // Фильтрация по факультету
        if ($request->has('faculty') && $request->faculty !== 'all') {
            $query->whereHas('user.faculty', function($q) use ($request) {
                $q->where('title', $request->faculty); 
            });
        }

        $activities = $query->get();

        $allFaculties = \App\Models\Faculty::pluck('title')->toArray();

        // Группировка
        $groupedByFaculty = $activities->groupBy(function ($activity) {
            return $activity->user->faculty->title ?? 'Общий факультет';
        })->map(function ($facultyActivities, $facultyName) {
            return [
                'faculty' => $facultyName,
                // Сортировка внутри группы (на случай, если groupBy перемешал)
                'items' => $facultyActivities->sortByDesc('created_at')->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'user_name' => $item->user->name ?? 'Сотрудник',
                        'title' => $item->title ?? ($item->indicator->title ?? 'Без названия'),
                        'category' => $item->indicator->category ?? 'Общее',
                        'date' => $item->created_at->format('d.m.Y H:i'), // Добавил время для точности
                        'total_points' => $item->total_points,
                        'status' => $item->status,
                        'comment' => $item->comment,
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
                // Используем значения констант или строковые литералы как в базе
                'approved' => $activities->where('status', 'approved')->count(),
                'pending' => $activities->where('status', 'pending')->count(),
                'rejected' => $activities->where('status', 'rejected')->count(),
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error', 
            'message' => 'Ошибка сервера: ' . $e->getMessage()
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

    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    $request->validate([
        'indicator_id' => 'required|exists:kpi_indicators,id',
        'quantity'     => 'required|integer|min:1',
        'title'        => 'required|string|max:255',
        'date'         => 'required|date',
        'files'        => 'required|array|min:1',
        'files.*'      => 'file|max:10240',
    ]);

    // 1. Получаем индикатор из базы по переданному ID
    // 1. Находим индикатор по ID
$indicator = \App\Models\KpiIndicator::findOrFail($request->indicator_id);

// 2. Берем чистый балл из индикатора (без умножения на quantity)

// 3. Создаем запись
$activity = \App\Models\KpiActivity::create([
    'user_id'      => $user->id,
    'indicator_id' => $request->indicator_id,
    'title'        => $request->title,
    'quantity'     => $request->quantity, // Количество сохраняем просто для инфо
    'status'       => 'pending',
    'date'         => $request->date,
]);

    // 4. Сохранение доказательств (файлов)
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
        'message' => 'Заявка отправлена. Ожидайте верификации.',
        'data' => [
            'id' => $activity->id,
            'points_added_to_pending' => $activity->total_points
        ]
    ]);
}
}
