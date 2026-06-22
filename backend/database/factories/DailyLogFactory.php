<?php

namespace Database\Factories;

use App\Models\DailyLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DailyLog>
 */
class DailyLogFactory extends Factory
{
    protected $model = DailyLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'mood' => fake()->randomElement(['great', 'good', 'okay', 'bad', 'terrible']),
            'tags' => null,
        ];
    }
}
