<?php

use App\Http\Controllers\Api\TodoController;
use Illuminate\Support\Facades\Route;

Route::put('todos/reorder', [TodoController::class, 'reorder']);
Route::apiResource('todos', TodoController::class);
