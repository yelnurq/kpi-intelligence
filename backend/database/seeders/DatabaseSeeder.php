<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\UserKpiPlan;
use App\Models\KpiActivity;
use App\Models\KpiEvidence;
use App\Models\KpiPlanSubmission;
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
//     public function run(): void
//     {
//     //     $this->call([
//     //         DepartmentSeeder::class,   
//     //         AcademicSeeder::class,      
//     //         PositionSeeder::class,      
//     //         KpiIndicatorSeeder::class,      
//     //     ]);

       
    //     User::create([
    //         'name' => 'Yelnur Z',
    //         'email' => 'test@kpi.test',
    //         'password' => Hash::make('test@kpi.test'),
    //         'department_id' => 1,
    //         'academic_degree_id' => 1,
    //         'faculty_id' => 1,
    //         'position_id' => 1,
    //     ]);
        
    //     User::create([
    //         'name' => 'Yelnur Админ',
    //         'email' => 'admin@kpi.test',
    //         'password' => Hash::make('admin@kpi.test'),
    //         'role' => 'super_admin',
    //         'department_id' => 1,
    //         'academic_degree_id' => 1,
    //         'faculty_id' => 1,
    //         'position_id' => 1,
    //     ]);
        


//         User::factory(50)->create();

//         // 2. Выбираем тех, кто будет "преподавателями" (роль 'user')
//         // Это важно для связи с KpiPlanSubmission
//         $teachers = User::where('role', 'teacher')->get();

//         // 3. Создаем планы для юзеров (индивидуальные показатели)
//         UserKpiPlan::factory(40)->create();

//         // 4. Создаем активности с прикрепленными файлами (уже выполненные дела)
//         KpiActivity::factory(25)
//             ->create()
//             ->each(function ($activity) {
//                 // Для каждой активности создаем от 1 до 3 файлов доказательств
//                 KpiEvidence::factory(rand(1, 3))->create([
//                     'kpi_activity_id' => $activity->id
//                 ]);
//             });

//         // 5. Создаем записи о ПОДАЧЕ планов (Submission) 
//         // Статус 'submitted' означает, что декан увидит их в списке на утверждение
//      // ... остальной код сидера

// foreach ($teachers as $teacher) {
//     // Этот метод проверит, есть ли запись. Если есть — обновит, если нет — создаст.
//     \App\Models\KpiPlanSubmission::updateOrCreate(
//         [
//             'user_id' => $teacher->id,
//             'academic_year' => '2025/2026',
//         ],
//         [
//             'status' => 'submitted',
//             'submitted_at' => now(),
//             'comment' => 'Генерация тестовых данных',
//         ]
//     );
// }
// }
public function run(): void
{
    // --- 1. СОЗДАНИЕ СТРУКТУРЫ УНИВЕРСИТЕТА ---
    $faculties = [
        [
            'title' => 'Технологический факультет',
            'short_title' => 'ТФ',
            'dean' => 'Ахметов Бахытжан Куанышевич',
            'short_name' => 'Ахметов Б.К.',
        ],
        [
            'title' => 'Факультет экономики и бизнеса',
            'short_title' => 'ФЭиБ',
            'dean' => 'Оспанова Гульнур Маратовна',
            'short_name' => 'Оспанова Г.М.',
        ],
        [
            'title' => 'Факультет инжиниринга и информационных технологий',
            'short_title' => 'ФИиИТ',
            'dean' => 'Серимбетов Бауыржан Айдарханович',
            'short_name' => 'Серимбетов Б.А.',
        ],
    ];

    foreach ($faculties as $f) {
        \App\Models\Faculty::updateOrCreate(['title' => $f['title']], $f);
    }

    $tf = \App\Models\Faculty::where('short_title', 'ТФ')->first()->id;
    $feb = \App\Models\Faculty::where('short_title', 'ФЭиБ')->first()->id;
    $fiit = \App\Models\Faculty::where('short_title', 'ФИиИТ')->first()->id;

    $deps = [
        ['title' => 'Кафедра "Технология и стандартизация"', 'faculty_id' => $tf],
        ['title' => 'Кафедра "Технология легкой промышленности и дизайна"', 'faculty_id' => $tf],
        ['title' => 'Кафедра "Социально-гуманитарные дисциплины"', 'faculty_id' => $tf],
        ['title' => 'Кафедра "Туризм и сервис"', 'faculty_id' => $feb],
        ['title' => 'Кафедра "Экономика и управление"', 'faculty_id' => $feb],
        ['title' => 'Кафедра "Финансы и учёт"', 'faculty_id' => $feb],
        ['title' => 'Кафедра "Государственный и иностранные языки"', 'faculty_id' => $feb],
        ['title' => 'Кафедра "Информационные технологии"', 'faculty_id' => $fiit],
        ['title' => 'Кафедра "Компьютерная инженерия и автоматизация"', 'faculty_id' => $fiit],
        ['title' => 'Кафедра "Химия, химическая технология и экология"', 'faculty_id' => $fiit],
    ];

    foreach ($deps as $dep) {
        \App\Models\Department::updateOrCreate(['title' => $dep['title']], $dep);
    }
        $this->call([
            // DepartmentSeeder::class,   
            AcademicSeeder::class,      
            PositionSeeder::class,      
            KpiIndicatorSeeder::class,      
        ]);

       
        User::create([
            'name' => 'Yelnur Z',
            'email' => 'test@kpi.test',
            'password' => Hash::make('test@kpi.test'),
            'department_id' => 1,
            'academic_degree_id' => 1,
            'faculty_id' => 1,
            'position_id' => 1,
        ]);
        
        User::create([
            'name' => 'Yelnur Админ',
            'email' => 'admin@kpi.test',
            'password' => Hash::make('admin@kpi.test'),
            'role' => 'super_admin',
            'department_id' => 1,
            'academic_degree_id' => 1,
            'faculty_id' => 1,
            'position_id' => 1,
        ]);    




    // // --- 2. ГЕНЕРАЦИЯ ПОЛЬЗОВАТЕЛЕЙ ---
    // // Убедись, что в UserFactory роль установлена как 'teacher'
    // \App\Models\User::factory(50)->create();

    // // Выбираем всех преподавателей для создания KPI данных
    // $teachers = \App\Models\User::where('role', 'teacher')->get();

    // // --- 3. ПЛАНЫ KPI ---
    // \App\Models\UserKpiPlan::factory(40)->create();

    // // --- 4. АКТИВНОСТИ И ДОКАЗАТЕЛЬСТВА ---
    // \App\Models\KpiActivity::factory(25)
    //     ->create()
    //     ->each(function ($activity) {
    //         \App\Models\KpiEvidence::factory(rand(1, 3))->create([
    //             'kpi_activity_id' => $activity->id
    //         ]);
    //     });

    // // --- 5. ПОДАЧА ПЛАНОВ (SUBMISSIONS) ---
    // foreach ($teachers as $teacher) {
    //     \App\Models\KpiPlanSubmission::updateOrCreate(
    //         [
    //             'user_id' => $teacher->id,
    //             'academic_year' => '2025/2026',
    //         ],
    //         [
    //             'status' => 'submitted',
    //             'submitted_at' => now(),
    //             'comment' => 'Генерация тестовых данных',
    //         ]
    //     );
    // }
}
}