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


Route::post('/chat/send', [ChatController::class, 'sendMessage']);

Route::middleware("logs")->group(function() {
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/register", [AuthController::class, "register"]);   
    });

Route::prefix('admin/ldap')->group(function () {
        Route::get('/users', [LdapController::class, 'getAllLdapUsers']);
        
        Route::post('/import-single', [LdapController::class, 'importSingleUser']);
        
        Route::post('/sync-all', [LdapController::class, 'syncAllLdapUsers']);
    });
    
    Route::middleware(["token", "logs"])->group(function(){
        
        Route::get('/admin/dashboard', [DashboardController::class, 'admin']);
    Route::get('/admin/logs', [ApiLogController::class, 'index']);
    Route::get('/admin/logs/{id}', [ApiLogController::class, 'show']);

    Route::get('/dean/user-plan/{userId}', [KPIPlanController::class, 'getUserPlanDetails']);
    Route::post('/dean/update-status', [KPIPlanController::class, 'updatePlanStatus']);
    Route::get('/get-plan-status', [KPIPlanController::class, 'getPlanStatus']);
    Route::post('/submit-plan', [KPIPlanController::class, 'submitPlan']);
    Route::get('/dean/submissions', [KPIPlanController::class, 'getDeanSubmissions']);
    Route::get('/assets', [KpiEvidenceController::class, 'index']);
    Route::post('/assets/upload', [KpiEvidenceController::class, 'store']);
    Route::delete('/assets/{id}', [KpiEvidenceController::class, 'destroy']); 

    Route::get('/faculty-ranking', [FacultyController::class, 'index']);

    Route::get('/admin/users', [UserController::class, 'index']);
    Route::get('/admin/staff/deadline-monitor', [KpiController::class, 'getStaffDeadlineMonitor']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::get('/admin/users/stats', [UserController::class, 'stats']);   
    Route::get('/admin/helpers/options', [UserController::class, 'getOptions']);
    Route::post('/admin/helpers/options', [UserController::class, 'postOptions']);
    Route::put('/admin/helpers/options/{id}', [UserController::class, 'updateOption']);
    Route::delete('/admin/helpers/options/{id}', [UserController::class, 'deleteOption']);
    Route::get('/admin/kpi-activities', [KpiActivityController::class, 'admin']);

    Route::post("/logout", [AuthController::class, "logout"]);
    
    Route::post('/export', [KpiController::class, 'export']);
    
    Route::get('/user', [UserController::class, 'me']);
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