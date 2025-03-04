<?php

use App\Http\Controllers\CompanyAuthorizationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ValueController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'web'])->group(function () {
    Route::get('/users/company', [UserController::class, 'indexCompany']);
    Route::get('/pending-users/company', [UserController::class, 'getPendingUsers']);
    Route::post('/users/company', [UserController::class, 'store']);
    Route::put('/users/company/{user}', [UserController::class, 'update']);
    Route::delete('/users/company/{user}', [UserController::class, 'destroy']);
    Route::get('/active-values', [ValueController::class, 'getActiveValues']);
    Route::post('/check-email-exists', [UserController::class, 'checkEmailExists']);
});

// Route::patch('companies/{company}/authorize', [CompanyAuthorizationController::class, 'authorizeCompany'])
//     ->middleware(['auth'])
//     ->name('companies.authorize');