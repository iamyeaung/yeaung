<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDailyLogRequest;
use App\Http\Resources\DailyLogResource;
use App\Services\DailyLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DailyLogController extends Controller
{
    public function __construct(
        private readonly DailyLogService $dailyLogService,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $logs = $this->dailyLogService->listForUser($request->user());

        return DailyLogResource::collection($logs);
    }

    public function store(StoreDailyLogRequest $request): JsonResponse
    {
        $log = $this->dailyLogService->create(
            $request->user(),
            $request->validated(),
        );

        return (new DailyLogResource($log))
            ->response()
            ->setStatusCode(201);
    }
}
