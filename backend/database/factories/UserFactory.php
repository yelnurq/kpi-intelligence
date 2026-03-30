<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'is_admin' => 0,
            'password' => Hash::make('password'), 
            
            'department_id' => fake()->numberBetween(1, 8), 
            'academic_degree_id' => fake()->numberBetween(1, 8),
            'faculty_id' => fake()->numberBetween(1, 3),
            'position_id' => fake()->numberBetween(1, 8),
        ];
    }
}