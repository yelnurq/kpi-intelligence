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
            'is_admin' => 0,
            'password' => Hash::make('test@kpi.test'),
            'department_id' => 1,
            'academic_degree_id' => 1,
            'faculty_id' => 1,
            'position_id' => 1,
        ]);
        
        User::create([
            'name' => 'Yelnur Админ',
            'email' => 'admin@kpi.test',
            'is_admin' => 1,
            'password' => Hash::make('admin@kpi.test'),
            'department_id' => 1,
            'academic_degree_id' => 1,
            'faculty_id' => 1,
            'position_id' => 1,
        ]);
    
    User::factory(50)->create();
}
}