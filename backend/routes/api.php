<?php

use App\Http\Controllers\Api\DailyLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('daily-logs', DailyLogController::class);
});
