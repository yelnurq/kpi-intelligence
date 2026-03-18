<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KpiActivityController;
use Illuminate\Http\Request;
use App\Http\Controllers\KpiController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);
    Route::get('/export', [KpiController::class, 'exportExcel']);

Route::middleware("token")->group(function(){
    Route::post("/logout", [AuthController::class, "logout"]);


    Route::get('/kpi-indicators', [KpiController::class, 'getIndicators']);
    Route::post("/save-kpi-plan", [KpiController::class, "savePlan"]);
    Route::post("/kpi-activities", [KpiActivityController::class, "store"]);
    Route::get('/get-user-plan-ids', [KpiController::class, 'getPlan']);
    Route::get('/kpi-activities', [KpiActivityController::class, 'index']);
    Route::post('/kpi/activity', [KpiController::class, 'storeActivity']);
    Route::get('/kpi/my-rating', [KpiController::class, 'myRating']);
    Route::get('/kpi/department/{id}', [KpiController::class, 'departmentRating']);
});