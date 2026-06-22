<?php

namespace Tests\Feature;

use App\Models\DailyLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DailyLogApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_user_can_create_a_daily_log(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/daily-logs', [
            'title' => 'Built the auth flow',
            'content' => "## What I did\n- Implemented Sanctum SPA auth\n- Added login page",
            'mood' => 'great',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'content', 'mood', 'userId', 'createdAt'],
            ])
            ->assertJson([
                'data' => [
                    'title' => 'Built the auth flow',
                    'mood' => 'great',
                    'userId' => $user->id,
                ],
            ]);

        $this->assertDatabaseHas('daily_logs', [
            'user_id' => $user->id,
            'title' => 'Built the auth flow',
        ]);
    }

    /** @test */
    public function daily_log_requires_title_and_content(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/daily-logs', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content']);
    }

    /** @test */
    public function mood_must_be_valid_enum_value(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/daily-logs', [
            'title' => 'Test log',
            'content' => 'Some content',
            'mood' => 'invalid_mood',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['mood']);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_daily_log(): void
    {
        $response = $this->postJson('/api/daily-logs', [
            'title' => 'Test',
            'content' => 'Content',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function authenticated_user_can_list_their_daily_logs(): void
    {
        $user = User::factory()->create();
        DailyLog::factory()->count(3)->for($user)->create();

        $response = $this->actingAs($user)->getJson('/api/daily-logs');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }
}
