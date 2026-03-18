<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Position;
use App\Models\KpiIndicator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class KpiSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Наполняем Кафедры
        $deps = [
            ['title' => 'Информационные технологии'],
            ['title' => 'Высшая математика'],
            ['title' => 'Программная инженерия'],
        ];
        foreach ($deps as $dep) {
            Department::create($dep);
        }

        // 2. Наполняем Должности
        $positions = [
            ['title' => 'Профессор', 'min_kpi_target' => 500],
            ['title' => 'Ассоциированный профессор', 'min_kpi_target' => 400],
            ['title' => 'Старший преподаватель', 'min_kpi_target' => 300],
            ['title' => 'Преподаватель', 'min_kpi_target' => 200],
        ];
        foreach ($positions as $pos) {
            Position::create($pos);
        }


        User::create([
            'name' => 'Yelnur Z',
            'email' => 'test@kpi.test',
            'password' => Hash::make('test@kpi.test'),
            'department_id' => 1,
            'position_id' => 1,
        ]);
    }
}