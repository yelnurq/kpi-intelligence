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

        // 3. Наполняем Справочник KPI (Индикаторы)
        $indicators = [
            ['title' => 'Статья в журнале Scopus (Q1/Q2)', 'weight' => 200, 'unit' => 'шт'],
            ['title' => 'Статья в журнале КОКСНВО', 'weight' => 50, 'unit' => 'шт'],
            ['title' => 'Прохождение курса на Skills Enbek', 'weight' => 30, 'unit' => 'курс'],
            ['title' => 'Издание учебного пособия', 'weight' => 100, 'unit' => 'шт'],
            ['title' => 'Разработка новой ОП', 'weight' => 150, 'unit' => 'программа'],
        ];
        foreach ($indicators as $ind) {
            KpiIndicator::create($ind);
        }

        // 4. Создаем Тестового Администратора
        User::create([
            'name' => 'Yelnur Z',
            'email' => 'test@kpi.test',
            'password' => Hash::make('test@kpi.test'),
            'department_id' => 1,
            'position_id' => 1,
        ]);
    }
}