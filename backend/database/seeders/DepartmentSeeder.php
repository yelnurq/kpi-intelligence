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
            ['title' => 'Технологический факультет'],
            ['title' => 'Факультет экономики и бизнеса'],
            ['title' => 'Факультет инжиниринга и информационных технологий'],
        ];
        foreach ($deps as $dep) {
            Department::create($dep);
        }

    }
}
