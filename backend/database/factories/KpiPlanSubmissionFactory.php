<?php

namespace Database\Factories;

use App\Models\KpiPlanSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class KpiPlanSubmissionFactory extends Factory
{
    protected $model = KpiPlanSubmission::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first() ?? User::factory(),
            'academic_year' => '2025/2026',
            'status' => 'submitted', // Устанавливаем статус по умолчанию
            'comment' => fake()->boolean(20) ? fake()->sentence() : null,
            'submitted_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Состояние для черновика (если понадобится)
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'submitted_at' => null,
        ]);
    }
}