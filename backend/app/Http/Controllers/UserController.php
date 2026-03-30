<?php

namespace App\Http\Controllers;

use App\Models\AcademicDegree;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Position;
use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    private function getAuthenticatedUser(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if (!$bearerToken) return null;

        $tokenRecord = Token::where("token", $bearerToken)->first();
        if (!$tokenRecord) return null;

        return User::find($tokenRecord->user_id);
    }
  public function me(Request $request)
{
    $userBase = $this->getAuthenticatedUser($request);

    if (!$userBase) {
        return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
    }

    $user = \App\Models\User::with([
        'position', 
        'academic_degree', 
        'faculty', 
        'department'
    ])->find($userBase->id);

    // 1. Считаем KPI
    $currentKpi = \App\Models\KpiActivity::where('user_id', $user->id)
        ->where('status', 'approved')
        ->sum('total_points');

    $pendingKpi = \App\Models\KpiActivity::where('user_id', $user->id)
        ->where('status', 'pending')
        ->sum('total_points');

    // 2. Генерируем данные для графика (за последние 6 месяцев)
    // Используем Carbon для работы с датами
    $chartData = collect(range(5, 0))->map(function ($i) use ($user) {
        $date = now()->subMonths($i);
        
        $monthlyPoints = \App\Models\KpiActivity::where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereMonth('created_at', $date->month)
            ->whereYear('created_at', $date->year)
            ->sum('total_points');

        return [
            // Формат месяца для фронта (напр. "Янв")
            'month' => $date->translatedFormat('M'), 
            'kpi'   => (int)$monthlyPoints
        ];
    });

    return response()->json([
        "status" => "success",
        "data" => [
            "id"              => $user->id,
            "name"            => $user->name,
            "position_title"  => $user->position?->title ?? 'Не указана',
            "academic_degree" => $user->academic_degree?->title ?? 'Без степени',
            "current_kpi"     => (int)$currentKpi, 
            "pending_kpi"     => (int)$pendingKpi,
            "min_kpi"         => (int)($user->position?->min_kpi_target ?? 0),
            "faculty"         => $user->faculty?->title ?? 'Вне факультета',
            "department"      => $user->department?->title ?? 'Вне кафедры',
            "dean"         => $user->faculty?->short_name ?? 'Вне факультета',
            "leader"      => $user->department?->short_name ?? 'Вне кафедры',
            
            // Данные для Recharts
            "chart_data"      => $chartData,
            
            "progress_percent" => ($user->position?->min_kpi_target > 0) 
                ? round(($currentKpi / $user->position->min_kpi_target) * 100, 1) 
                : 0
        ]
    ]);
}
public function index(Request $request)
{
    try {
        // 1. Инициализируем запрос с отношениями
        $query = User::with([
            'faculty:id,title,short_title',
            'department:id,title,short_title',
            'position:id,title',
            'academic_degree:id,title'
        ]);

        // 2. Добавляем подсчет активностей (approved)
        $query->withCount(['activities' => function ($q) {
            $q->where('status', 'approved');
        }]);

        // 3. Фильтрация (по аналогии с вашим монитором)
        if ($request->has('faculty') && $request->faculty !== 'all') {
            $query->whereHas('faculty', function($q) use ($request) {
                $q->where('short_title', $request->faculty)
                  ->orWhere('title', $request->faculty);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 4. Собираем статистику ДО пагинации, но ПОСЛЕ фильтрации
        $statsQuery = clone $query;
        $allFilteredUsers = $statsQuery->get();

        $stats = [
            'total' => $allFilteredUsers->count(),
            'active' => $allFilteredUsers->where('activities_count', '>', 0)->count(),
            'new' => $allFilteredUsers->where('activities_count', '==', 0)->count(),
            'admins' => $allFilteredUsers->where('is_admin', true)->count(),
        ];

        // 5. Сортировка и пагинация
        $perPage = $request->get('per_page', 20);
        $usersPaginator = $query->orderBy('name', 'asc')->paginate($perPage);

        // 6. Трансформация данных (через through, чтобы сохранить структуру пагинатора)
        $usersPaginator->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (bool)$user->is_admin,
                'faculty' => $user->faculty->title ?? 'Не указан',
                'department' => $user->department->title ?? 'Не указана',
                'faculty_short' => $user->faculty->short_title ?? '—',
                'position' => $user->position->title ?? 'Сотрудник',
                'academic_degree' => $user->academic_degree->title ?? 'Нет',
                'activities_count' => (int)$user->activities_count
            ];
        });

        // 7. Ответ в стиле вашего монитора
        return response()->json([
            'status' => 'success',
            'stats' => $stats,
            'data' => $usersPaginator->items(), // Только элементы текущей страницы
            'meta' => [
                'current_page' => $usersPaginator->currentPage(),
                'last_page'    => $usersPaginator->lastPage(),
                'per_page'     => $usersPaginator->perPage(),
                'total'        => $usersPaginator->total(),
            ],
            'message' => 'Список сотрудников успешно загружен'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка: ' . $e->getMessage()
        ], 500);
    }
}
    /**
 * Обновление данных пользователя
 */
public function update(Request $request, $id)
{
    try {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Пользователь не найден'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'faculty_id' => 'required|exists:faculties,id',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'academic_degree_id' => 'required|exists:academic_degrees,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'faculty_id' => $validated['faculty_id'],
            'department_id' => $validated['department_id'],
            'position_id' => $validated['position_id'],
            'academic_degree_id' => $validated['academic_degree_id'],
            'is_admin' => $request->is_admin ?? $user->is_admin,
        ];

        // Обновляем пароль только если он введен
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Данные сотрудника обновлены',
            'user' => $user
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка при обновлении: ' . $e->getMessage()
        ], 422);
    }
}
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Пользователь не найден'], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Пользователь успешно удален'
        ]);
    }

    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'by_faculty' => User::select('faculty', DB::raw('count(*) as total'))
                ->groupBy('faculty')
                ->get()
        ]);
    }


public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'faculty_id' => 'required|exists:faculties,id',
            'department_id' => 'required|exists:departments,id',
            'position_id' => 'required|exists:positions,id',
            'academic_degree_id' => 'required|exists:academic_degrees,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'faculty_id' => $validated['faculty_id'],
            'department_id' => $validated['department_id'],
            'position_id' => $validated['position_id'],
            'academic_degree_id' => $validated['academic_degree_id'],
            'is_admin' => $request->is_admin ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Сотрудник успешно создан',
            'user' => $user
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка при создании: ' . $e->getMessage()
        ], 422);
    }
}
public function getOptions()
{
    try {
        $categoryOrder = [
            'учеб.работа', 
            'учебно-методическая работа', 
            'организационно-методическая работа', 
            'научно-исследовательская работа', 
            'воспитательная работа', 
            'повышение квалификации'
        ];

        // Строим конструкцию CASE WHEN для универсальной сортировки
        $cases = [];
        foreach ($categoryOrder as $index => $category) {
            $cases[] = "WHEN category = '{$category}' THEN " . ($index + 1);
        }
        $orderRaw = "CASE " . implode(' ', $cases) . " ELSE 999 END";

        $kpi_metrics = \App\Models\KpiIndicator::select('id', 'title as name', 'category')
            ->orderByRaw($orderRaw) // Универсальная сортировка для SQLite и MySQL
            ->orderBy('title', 'asc')
            ->get()
            ->groupBy('category');

        return response()->json([
            'kpi_metrics' => $kpi_metrics,
            'faculties' => \App\Models\Faculty::select('id', 'title as name', 'short_name')->orderBy('title')->get(),
            'departments' => \App\Models\Department::select('id', 'title as name', 'short_name')->orderBy('title')->get(),
            'positions' => \App\Models\Position::select('id', 'title as name')->orderBy('title')->get(),
            'degrees' => \App\Models\AcademicDegree::select('id', 'title as name')->orderBy('title')->get(),
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка: ' . $e->getMessage()
        ], 500);
    }
}
public function postOptions(Request $request)
{
    try {
        $type = $request->input('type');
        $name = $request->input('name'); // Это 'title' в базе

        $models = [
            'kpi'         => \App\Models\KpiIndicator::class,
            'faculties'   => \App\Models\Faculty::class,
            'departments' => \App\Models\Department::class,
            'positions'   => \App\Models\Position::class,
            'degrees'     => \App\Models\AcademicDegree::class,
        ];

        if (!isset($models[$type])) {
            return response()->json(['message' => 'Неверный тип справочника'], 400);
        }

        $modelClass = $models[$type];
        $item = new $modelClass();
        
        // Все ваши таблицы используют поле "title" для названия
        $item->title = $name;

        switch ($type) {
            case 'kpi':
                $item->category = $request->input('category');
                $item->points = $request->input('points', 0);
                $item->difficulty = $request->input('difficulty', 'easy');
                $item->year = $request->input('year', date('Y'));
                break;

            case 'faculties':
                $item->short_name = $request->input('short_name', '');
                $item->short_title = $request->input('short_title', ''); // Из вашей миграции
                $item->dean = $request->input('dean', 'Не назначен');
                break;

            case 'departments':
                $item->short_name = $request->input('short_name', '');
                $item->leader = $request->input('leader', 'Не назначен');
                $item->faculty_id = $request->input('faculty_id'); // Обязательно для внешнего ключа
                break;

            case 'positions':
                $item->min_kpi_target = $request->input('min_kpi_target', 0);
                break;
        }

        $item->save();

        return response()->json(['status' => 'success', 'item' => $item], 201);

    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}
// Метод для УДАЛЕНИЯ
public function deleteOption(Request $request, $id)
{
    try {
        $type = $request->query('type');
        $models = [
            'kpi'         => \App\Models\KpiIndicator::class,
            'faculties'   => \App\Models\Faculty::class,
            'departments' => \App\Models\Department::class,
            'positions'   => \App\Models\Position::class,
            'degrees'     => \App\Models\AcademicDegree::class,
        ];

        if (!isset($models[$type])) return response()->json(['message' => 'Тип не найден'], 400);

        $item = $models[$type]::findOrFail($id);
        $item->delete();

        return response()->json(['status' => 'success']);
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

// Метод для РЕДАКТИРОВАНИЯ (Обновления)
public function updateOption(Request $request, $id)
{
    try {
        $type = $request->input('type');
        $models = [
            'kpi'         => \App\Models\KpiIndicator::class,
            'faculties'   => \App\Models\Faculty::class,
            'departments' => \App\Models\Department::class,
            'positions'   => \App\Models\Position::class,
            'degrees'     => \App\Models\AcademicDegree::class,
        ];

        $item = $models[$type]::findOrFail($id);
        
        // Универсальное обновление заголовка
        $item->title = $request->input('name');

        // Специфичные поля
        if ($type === 'kpi') {
            $item->category = $request->input('category');
            $item->points = $request->input('points');
        } 
        if (in_array($type, ['faculties', 'departments'])) {
            $item->short_name = $request->input('short_name') ?? '';
        }
        if ($type === 'departments') {
            $item->faculty_id = $request->input('faculty_id');
        }

        $item->save();
        return response()->json(['status' => 'success', 'item' => $item]);
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}
}
