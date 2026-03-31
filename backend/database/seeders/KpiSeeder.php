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
       
    //     User::create([
    //         'name' => 'Академический отдел (Учебная работа)',
    //         'email' => 'academic.study@kpi.test',
    //         'password' => Hash::make('password123'),
    //         'role' => 'academic_office',
    //         'academic_specialization' => 'учеб.работа',
            
    //         'department_id' => null, 
    //         'academic_degree_id' => 1,
    //         'faculty_id' => null,
    //         'position_id' => 1,
    //     ]);
    //  User::create([
    //         'name' => 'организационно-методическая работа',
    //         'email' => 'academic.study@kpi.test1',
    //         'password' => Hash::make('password123'),
    //         'role' => 'academic_office',
    //         'academic_specialization' => 'организационно-методическая работа',
            
    //         'department_id' => null, 
    //         'academic_degree_id' => 1,
    //         'faculty_id' => null,
    //         'position_id' => 1,
    //     ]);
    // User::create([
    //         'name' => 'Ахметов Бахытжан Султанович',
    //         'email' => 'head.is2@kpi.test',
    //         'password' => Hash::make('password123'),
    //         'role' => 'head_of_dept',
    //         'academic_specialization' => 'Зав.кафедрой',
    //         'faculty_id' => 1,
    //         'department_id' => 2,
    //         'academic_degree_id' => 1, // Убедитесь, что в таблице degrees есть ID 1
    //         'position_id' => 1,        // Убедитесь, что в таблице positions есть ID 1
    //     ]);
            $this->call([
            DepartmentSeeder::class,   
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
    }
}