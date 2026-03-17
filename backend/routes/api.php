<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\KpiController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);

Route::middleware("token")->group(function(){
    Route::post("/logout", [AuthController::class, "logout"]);

    Route::post('/kpi/activity', [KpiController::class, 'storeActivity']);
    Route::get('/kpi/my-rating', [KpiController::class, 'myRating']);
    Route::get('/kpi/department/{id}', [KpiController::class, 'departmentRating']);
});