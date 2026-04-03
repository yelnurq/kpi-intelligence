<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\Api\KpiEvidenceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KpiActivityController;
use App\Http\Controllers\LdapController;
use Illuminate\Http\Request;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\KPIPlanController;
use App\Http\Controllers\ApiLogController;



Route::middleware("logs")->group(function() {
    Route::post("/login", [AuthController::class, "login"])->middleware('throttle:5,1');
    Route::post("/register", [AuthController::class, "register"]);   
});
    

Route::middleware(["token", "logs"])->group(function(){
    
    // --- ГРУППА ДЛЯ АДМИНОВ (все, кто не teacher) ---
    Route::middleware("admin")->prefix('admin')->group(function () {
        
        // LDAP (уже внутри префикса admin, поэтому просто ldap)
        Route::prefix('ldap')->group(function () {
            Route::get('/users', [LdapController::class, 'getAllLdapUsers']);
            Route::post('/import-single', [LdapController::class, 'importSingleUser']);
            Route::post('/sync-all', [LdapController::class, 'syncAllLdapUsers']);
        });

        Route::get('/dashboard', [DashboardController::class, 'admin']);
        Route::get('/logs', [ApiLogController::class, 'index']);
        Route::get('/logs/{id}', [ApiLogController::class, 'show']);

        // Пользователи и статы
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::get('/users/stats', [UserController::class, 'stats']);
        
        Route::get('/staff/deadline-monitor', [KpiController::class, 'getStaffDeadlineMonitor']);
        Route::get('/kpi-activities', [KpiActivityController::class, 'admin']);

        // Хелперы/Опции
        Route::prefix('helpers/options')->group(function () {
            Route::get('/', [UserController::class, 'getOptions']);
            Route::post('/', [UserController::class, 'postOptions']);
            Route::put('/{id}', [UserController::class, 'updateOption']);
            Route::delete('/{id}', [UserController::class, 'deleteOption']);
        });
    });

    // --- ОБЩИЕ РОУТЫ И РОУТЫ ДЕКАНОВ ---
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::post('/chat/reset', [ChatController::class, 'resetChat']);
    
    Route::get('/dean/user-plan/{userId}', [KPIPlanController::class, 'getUserPlanDetails']);
    Route::post('/dean/update-status', [KPIPlanController::class, 'updatePlanStatus']);
    Route::get('/dean/submissions', [KPIPlanController::class, 'getDeanSubmissions']);

    Route::get('/get-plan-status', [KPIPlanController::class, 'getPlanStatus']);
    Route::post('/submit-plan', [KPIPlanController::class, 'submitPlan']);
    
    Route::get('/assets', [KpiEvidenceController::class, 'index']);
    Route::post('/assets/upload', [KpiEvidenceController::class, 'store']);
    Route::delete('/assets/{id}', [KpiEvidenceController::class, 'destroy']); 

    Route::get('/faculty-ranking', [FacultyController::class, 'index']);
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::post('/export', [KpiController::class, 'export']);
    Route::get('/user', [UserController::class, 'me']);

    // KPI роуты
    Route::post('/kpi-activities/{id}/status', [KpiActivityController::class, 'updateStatus']);
    Route::get('/kpi-indicators', [KpiController::class, 'getIndicators']);
    Route::get('/user/kpi-indicators', [KpiController::class, 'getMyIndicators']);
    Route::get('/get-my-indicators', [KpiController::class, 'getMyIndicatorsDeadline']);
    Route::get('/user/kpi-activities', [KpiActivityController::class, 'latest']);
    Route::post("/save-kpi-plan", [KpiController::class, "savePlan"]);
    Route::post("/kpi-activities", [KpiActivityController::class, "store"]);
    Route::get('/get-user-plan-ids', [KpiController::class, 'getPlan']);
    Route::get('/kpi-activities', [KpiActivityController::class, 'index']);
    Route::post('/kpi/activity', [KpiController::class, 'storeActivity']);
    Route::get('/kpi/my-rating', [KpiController::class, 'myRating']);
    Route::get('/kpi/department/{id}', [KpiController::class, 'departmentRating']);
});