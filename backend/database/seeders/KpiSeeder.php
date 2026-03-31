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
       
        User::create([
            'name' => 'Академический отдел (Учебная работа)',
            'email' => 'academic.study@kpi.test',
            'password' => Hash::make('password123'),
            'role' => 'academic_office',
            'academic_specialization' => 'учеб.работа',
            
            'department_id' => null, 
            'academic_degree_id' => 1,
            'faculty_id' => null,
            'position_id' => 1,
        ]);
     User::create([
            'name' => 'организационно-методическая работа',
            'email' => 'academic.study@kpi.test1',
            'password' => Hash::make('password123'),
            'role' => 'academic_office',
            'academic_specialization' => 'организационно-методическая работа',
            
            'department_id' => null, 
            'academic_degree_id' => 1,
            'faculty_id' => null,
            'position_id' => 1,
        ]);
    
    }
}