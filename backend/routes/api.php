<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KpiActivityController;
use Illuminate\Http\Request;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacultyController;

Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);

Route::middleware("token")->group(function(){

    Route::get('/faculty-ranking', [FacultyController::class, 'index']);

    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    Route::get('/admin/users/stats', [UserController::class, 'stats']);   
    Route::get('/admin/helpers/user-options', [UserController::class, 'getOptions']);

    Route::post("/logout", [AuthController::class, "logout"]);
    
    Route::post('/export', [KpiController::class, 'export']);
    
    Route::get('/user', [UserController::class, 'me']);
    Route::post('/kpi-activities/{id}/status', [KpiActivityController::class, 'updateStatus']);
    Route::get('/kpi-indicators', [KpiController::class, 'getIndicators']);
    Route::get('/user/kpi-indicators', [KpiController::class, 'getMyIndicators']);
    Route::post("/save-kpi-plan", [KpiController::class, "savePlan"]);
    Route::post("/kpi-activities", [KpiActivityController::class, "store"]);
    Route::get('/get-user-plan-ids', [KpiController::class, 'getPlan']);
    Route::get('/user/kpi-activities', [KpiActivityController::class, 'latest']);
    Route::get('/kpi-activities', [KpiActivityController::class, 'index']);
    Route::get('/admin/kpi-activities', [KpiActivityController::class, 'admin']);
    Route::post('/kpi/activity', [KpiController::class, 'storeActivity']);
    Route::get('/kpi/my-rating', [KpiController::class, 'myRating']);
    Route::get('/kpi/department/{id}', [KpiController::class, 'departmentRating']);
});