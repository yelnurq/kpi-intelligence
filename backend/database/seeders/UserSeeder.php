<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
// Данные для создания аккаунтов деканов на основе твоих факультетов
$deanAccounts = [
    [
        'name' => 'Ахметов Бахытжан Куанышевич',
        'email' => 'dean.tf@kpi.test',
        'short_title' => 'ТФ'
    ],
    [
        'name' => 'Оспанова Гульнур Маратовна',
        'email' => 'dean.feb@kpi.test',
        'short_title' => 'ФЭиБ'
    ],
    [
        'name' => 'Серимбетов Бауыржан Айдарханович',
        'email' => 'dean.fiit@kpi.test',
        'short_title' => 'ФИиИТ'
    ],
];

foreach ($deanAccounts as $account) {
    // Ищем ID факультета по short_title
    $facultyId = Faculty::where('short_title', $account['short_title'])->first()->id;

    User::updateOrCreate(
        ['email' => $account['email']], // Чтобы не дублировать при повторном сиде
        [
            'name' => $account['name'],
            'password' => Hash::make('password123'),
            'role' => 'dean',
            'faculty_id' => $facultyId,
            'department_id' => null, // Декан привязан к факультету, а не к конкретной кафедре
            'academic_degree_id' => 2, // Кандидат наук / Доктор
            'position_id' => 2,        // ID должности "Декан"
            'academic_specialization' => 'Деканат ' . $account['short_title'],
        ]
    );
}
    }
}
