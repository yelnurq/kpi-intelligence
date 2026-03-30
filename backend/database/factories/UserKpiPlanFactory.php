<?php

namespace Database\Factories;

use App\Models\UserKpiPlan;
use App\Models\User;
use App\Models\KpiIndicator;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserKpiPlanFactory extends Factory
{
    protected $model = UserKpiPlan::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first() ?? User::factory(),
            'kpi_indicator_id' => KpiIndicator::inRandomOrder()->first() ?? KpiIndicator::factory(),
            'deadline' => fake()->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'academic_year' => '2025/2026',
        ];
    }
}