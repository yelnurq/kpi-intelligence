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
        // 1. Используем твой кастомный метод для получения юзера
        $userBase = $this->getAuthenticatedUser($request);

        if (!$userBase) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        // 2. Загружаем связи (Eager Loading), чтобы не делать 5 лишних запросов к базе
        $user = \App\Models\User::with([
            'position', 
            'academic_degree', 
            'faculty', 
            'department'
        ])->find($userBase->id);

        // 3. Считаем подтвержденные баллы
        $currentKpi = \App\Models\KpiActivity::where('user_id', $user->id)
            ->where('status', 'approved')
            ->sum('total_points');

        // 4. Считаем баллы в ожидании (те, что админ еще не проверил)
        $pendingKpi = \App\Models\KpiActivity::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('total_points');

        return response()->json([
            "status" => "success",
            "data" => [
                "id"              => $user->id,
                "name"            => $user->name,
                "email"           => $user->email,
                "position_title"  => $user->position?->title ?? 'Не указана',
                "academic_degree" => $user->academic_degree?->title ?? 'Без степени',
                "dean"            => $user->faculty?->short_name ?? '',
                "faculty"         => $user->faculty?->title ?? 'Вне факультета',
                "department"      => $user->department?->title ?? 'Вне кафедры',
                "department_leader" => $user->department?->short_name ?? '',
                "min_kpi"         => (int)($user->position?->min_kpi_target ?? 0),
                
                // Основной балл
                "current_kpi"     => (int)$currentKpi, 
                
                // Баллы "в пути" (на проверке)
                "pending_kpi"     => (int)$pendingKpi,
                
                // Процент выполнения плана (если min_kpi > 0)
                "progress_percent" => ($user->position?->min_kpi_target > 0) 
                    ? round(($currentKpi / $user->position->min_kpi_target) * 100, 1) 
                    : 0
            ]
        ]);
    }
    public function index()
{
    try {
        // Используем eager loading (Eager Loading), чтобы подтянуть названия вместо ID
        $users = User::with([
                'faculty:id,title',     // Берем только id и название факультета
                'department:id,title',  // Кафедра
                'position:id,title',    // Должность
                'academic_degree:id,title' // Ученая степень
            ])
            ->withCount(['activities' => function ($query) {
                $query->where('status', 'approved');
            }])
            // ->where('role', '!=', 'admin') 
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($user) {
                // Преобразуем структуру для фронтенда, чтобы не менять React-компонент
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'faculty' => $user->faculty->title ?? 'Не указан',
                    'department' => $user->department->title ?? 'Не указана',
                    'position' => $user->position->title ?? 'Сотрудник',
                    'academic_degree' => $user->academic_degree->title ?? 'Нет',
                    'activities_count' => $user->activities_count
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $users,
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
     * Удаление пользователя
     */
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
            'role' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'faculty_id' => $validated['faculty_id'],
            'department_id' => $validated['department_id'],
            'position_id' => $validated['position_id'],
            'academic_degree_id' => $validated['academic_degree_id'],
            'role' => $request->role ?? 'user',
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
        // Добавляем \App\Models\ перед каждой моделью, чтобы точно избежать конфликтов
        return response()->json([
            'faculties' => \App\Models\Faculty::select('id', 'title as name')->orderBy('title')->get(),
            'departments' => \App\Models\Department::select('id', 'title as name')->orderBy('title')->get(),
            'positions' => \App\Models\Position::select('id', 'title as name')->orderBy('title')->get(),
            'degrees' => \App\Models\AcademicDegree::select('id', 'title as name')->orderBy('title')->get(),
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Ошибка при загрузке справочников: ' . $e->getMessage()
        ], 500);
    }
}
}
