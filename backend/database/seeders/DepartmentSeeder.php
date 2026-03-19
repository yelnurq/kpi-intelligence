<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $deps = [
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
                'short_name' => 'Серимбетов Б.С.',
            ],
        
        ];
        foreach ($deps as $dep) {
            Department::create($dep);
        }

    }
}
