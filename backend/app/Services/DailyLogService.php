<?php

namespace App\Services;

use App\Models\DailyLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class DailyLogService
{
    public function listForUser(User $user): Collection
    {
        return DailyLog::query()
            ->where('user_id', $user->id)
            ->latest()
            ->get();
    }

    public function create(User $user, array $data): DailyLog
    {
        return $user->dailyLogs()->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'mood' => $data['mood'] ?? null,
            'tags' => $data['tags'] ?? null,
        ]);
    }
}
