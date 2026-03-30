<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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
    
    User::factory(50)->create();
}
}