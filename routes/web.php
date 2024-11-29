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
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\IndicadoresController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Middleware\EnsureUserIsSuperAdmin;
use App\Http\Controllers\ValueController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\AvailableCertificationController;

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
Route::middleware(['auth', 'verified', EnsureUserHasCompany::class])->group(function () {
    Route::get('/certifications/create', [CertificationController::class, 'create'])
        ->name('certifications.create');
    Route::post('/certifications', [CertificationController::class, 'store'])
        ->name('certifications.store');
    Route::put('/certifications/{certification}', [CertificationController::class, 'update'])
        ->name('certifications.update');
    Route::delete('/certifications/{certification}', [CertificationController::class, 'destroy'])
        ->name('certifications.destroy');
});

// Rutas de perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/approval-pending', function () {
        $user = auth()->user();
        return Inertia::render('Auth/PendingApproval', [
            'status' => $user->status
        ]);
    })->name('approval.pending');
});

Route::middleware(['auth', 'verified', EnsureUserHasCompany::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'showEvaluation'])
        ->name('dashboard');
    Route::get('/indicadores', [IndicadoresController::class, 'index'])
        ->name('indicadores');
    // Otras rutas protegidas...
});

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/super/dashboard', [SuperAdminController::class, 'dashboard'])->name('super.dashboard');
    Route::get('/super/companies', [SuperAdminController::class, 'companies'])->name('super.companies');
    Route::get('/super/users', [SuperAdminController::class, 'users'])->name('super.users');
    Route::get('/super/certifications', [SuperAdminController::class, 'certifications'])->name('super.certifications');
    Route::get('/super/settings', [SuperAdminController::class, 'settings'])->name('super.settings');
    Route::get('/super/values', [SuperAdminController::class, 'values'])->name('super.values');
    Route::get('/super/homologations', [SuperAdminController::class, 'homologations'])->name('super.homologations');
    Route::get('/super/indicators', [SuperAdminController::class, 'indicators'])->name('super.indicators');
    
    Route::get('/api/subcategories', [SubcategoryController::class, 'index']);
    Route::post('/api/subcategories', [SubcategoryController::class, 'store']);
    Route::put('/api/subcategories/{subcategory}', [SubcategoryController::class, 'update']);
    Route::delete('/api/subcategories/{subcategory}', [SubcategoryController::class, 'destroy']);
    Route::post('/api/subcategories/bulk-delete', [SubcategoryController::class, 'bulkDelete']);
    Route::get('/super/subcategories', [SuperAdminController::class, 'subcategories'])
        ->name('super.subcategories');

    // Rutas para homologaciones (AvailableCertification)
    Route::get('/api/homologations', [AvailableCertificationController::class, 'index']);
    Route::post('/api/homologations', [AvailableCertificationController::class, 'store']);
    Route::put('/api/homologations/{certification}', [AvailableCertificationController::class, 'update']);
    Route::delete('/api/homologations/{certification}', [AvailableCertificationController::class, 'destroy']);
    Route::post('/api/homologations/bulk-delete', [AvailableCertificationController::class, 'bulkDelete']);

    // Ruta para la vista
    Route::get('/super/homologations', [SuperAdminController::class, 'homologations'])
        ->name('super.homologations');
});

Route::middleware(['auth', EnsureUserIsAdmin::class])->group(function () {
    Route::post('/approve-user/{user}', [CompanyAuthController::class, 'approveAccess'])
        ->name('user.approve');
    Route::post('/reject-user/{user}', [CompanyAuthController::class, 'rejectAccess'])
        ->name('user.reject');
});

Route::middleware(['auth', 'verified', EnsureUserHasCompany::class])->group(function () {
    Route::get('/company/edit', [CompanyController::class, 'edit'])->name('company.edit');
    Route::patch('/company/update', [CompanyController::class, 'update'])->name('company.update');
});

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/values', [ValueController::class, 'index']);
    Route::post('/api/values', [ValueController::class, 'store']);
    Route::put('/api/values/{value}', [ValueController::class, 'update']);
    Route::delete('/api/values/{value}', [ValueController::class, 'destroy']);
    Route::post('/api/values/bulk-delete', [ValueController::class, 'bulkDelete']);
    Route::get('/api/values/active', [ValueController::class, 'getActiveValues']);
});

require __DIR__ . '/auth.php';
