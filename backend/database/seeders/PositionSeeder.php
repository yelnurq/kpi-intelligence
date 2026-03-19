<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $positions = [
            ['title' => 'Профессор', 'min_kpi_target' => 500],
            ['title' => 'Ассоциированный профессор (Доцент)', 'min_kpi_target' => 400],
            ['title' => 'Старший преподаватель', 'min_kpi_target' => 300],
            ['title' => 'Преподаватель', 'min_kpi_target' => 200],
            ['title' => 'Ассистент', 'min_kpi_target' => 150],

            ['title' => 'Заведующий кафедрой', 'min_kpi_target' => 600], 
            ['title' => 'Декан факультета', 'min_kpi_target' => 700],
            ['title' => 'Заместитель декана по учебной работе', 'min_kpi_target' => 550],
            ['title' => 'Заместитель декана по научной работе', 'min_kpi_target' => 550],

            ['title' => 'Главный научный сотрудник', 'min_kpi_target' => 650],
            ['title' => 'Ведущий научный сотрудник', 'min_kpi_target' => 500],
            ['title' => 'Старший научный сотрудник', 'min_kpi_target' => 400],
            ['title' => 'Младший научный сотрудник', 'min_kpi_target' => 250],

            ['title' => 'Методист факультета', 'min_kpi_target' => 150],
            ['title' => 'Лаборант', 'min_kpi_target' => 100],
        ];

        foreach ($positions as $pos) {
            Position::create($pos);
        }
    }
}
