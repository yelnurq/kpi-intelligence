<?php
namespace Database\Factories;

use App\Models\KpiActivity;
use App\Models\User;
use App\Models\KpiIndicator;
use Illuminate\Database\Eloquent\Factories\Factory;

class KpiActivityFactory extends Factory
{
    protected $model = KpiActivity::class;

    public function definition(): array
    {
        return [
            // Берем случайного существующего юзера или создаем нового
            'user_id' => User::inRandomOrder()->first() ?? User::factory(),
            'indicator_id' => KpiIndicator::inRandomOrder()->first() ?? KpiIndicator::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'total_points' => fake()->randomFloat(2, 5, 100), // Баллы за активность
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'comment' => fake()->boolean(40) ? fake()->sentence() : null, // Комментарий в 40% случаев
        ];
    }
}