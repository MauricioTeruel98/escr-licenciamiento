<?php

use App\Http\Controllers\Auth\CompanyAuthController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\EnsureUserHasCompany;

// Ruta principal
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Rutas de autenticación y registro de empresa
Route::controller(CompanyAuthController::class)
    ->middleware(['auth'])
    ->group(function () {
    Route::get('/regard', 'showRegard')->name('regard');
    Route::get('/company-register', 'showCompanyRegister')->name('company.register');
    Route::post('/company-register', 'storeCompany')->name('company.store');
    Route::get('/legal-id', 'showLegalId')->name('legal.id');
    Route::post('/legal-id/verify', 'verifyLegalId')->name('legal-id.verify');
    Route::get('/company-exists', 'showCompanyExists')->name('company.exists');
    Route::post('/company-request-access', 'requestAccess')->name('company.request-access');
});

// Rutas del dashboard
Route::controller(DashboardController::class)->group(function () {
    Route::get('/dashboard', 'showEvaluation')
        ->middleware(['auth', 'verified', EnsureUserHasCompany::class])
        ->name('dashboard');
    //Route::get('/evaluation', 'showEvaluation')->name('evaluation');
});

// Rutas de certificaciones
Route::get('/certifications/create', [CertificationController::class, 'create'])
    ->name('certifications.create');

// Rutas de perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
