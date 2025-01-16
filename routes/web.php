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
use App\Http\Middleware\EnsureUserIsEvaluador;
use App\Http\Controllers\ValueController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\AvailableCertificationController;
use App\Http\Controllers\IndicatorController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\CompanyManagementController;
use App\Http\Controllers\CertificationManagementController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SuperAdminCompanyController;
use App\Http\Controllers\IndicadorAnswerController;
use App\Http\Controllers\EvaluationAnswerController;
use App\Http\Controllers\EvaluadorController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\ReportController;

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
    Route::get('/indicadores/{id}', [IndicadoresController::class, 'index'])
        ->name('indicadores');

    Route::get('/evaluacion/{value_id}', [EvaluationController::class, 'index'])
        ->name('evaluacion');
    // Otras rutas protegidas...

    Route::post('/evaluation/send-application', [EvaluationController::class, 'sendApplication'])->name('evaluation.send-application');

    Route::get('/form-empresa', [DashboardController::class, 'showFormEmpresa'])
        ->name('form.empresa');

});

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/super/reportes', [DashboardController::class, 'showReportes'])->name('super.reportes');
    Route::get('/super/dashboard', [SuperAdminController::class, 'dashboard'])->name('super.dashboard');
    Route::get('/super/components', [DashboardController::class, 'showComponents'])->name('super.components');
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

    // Rutas para indicadores
    Route::get('/api/indicators', [IndicatorController::class, 'index']);
    Route::post('/api/indicators', [IndicatorController::class, 'store']);
    Route::put('/api/indicators/{indicator}', [IndicatorController::class, 'update']);
    Route::delete('/api/indicators/{indicator}', [IndicatorController::class, 'destroy']);
    Route::post('/api/indicators/bulk-delete', [IndicatorController::class, 'bulkDelete']);
    Route::get('/api/indicators/related-data', [IndicatorController::class, 'getRelatedData']);

    // Ruta para la vista
    Route::get('/super/indicators', [SuperAdminController::class, 'indicators'])
        ->name('super.indicators');

    // Rutas para gestión de usuarios
    Route::get('/api/users', [UserManagementController::class, 'index']);
    Route::post('/api/users', [UserManagementController::class, 'store']);
    Route::get('/api/users/{user}', [UserManagementController::class, 'show']);
    Route::put('/api/users/{user}', [UserManagementController::class, 'update']);
    Route::delete('/api/users/{user}', [UserManagementController::class, 'destroy']);
    Route::post('/api/users/bulk-delete', [UserManagementController::class, 'bulkDelete']);
    Route::patch('/api/users/{user}/status', [UserManagementController::class, 'updateStatus']);
    Route::patch('/api/users/{user}/role', [UserManagementController::class, 'updateRole']);
    Route::get('/api/companies/active', [UserManagementController::class, 'getActiveCompanies']);

    // Ruta para la vista
    Route::get('/super/users', [SuperAdminController::class, 'users'])->name('super.users');

    // Rutas para gestión de empresas
    Route::get('/api/companies', [CompanyManagementController::class, 'index']);
    Route::post('/api/companies', [CompanyManagementController::class, 'store']);
    Route::put('/api/companies/{company}', [CompanyManagementController::class, 'update']);
    Route::delete('/api/companies/{company}', [CompanyManagementController::class, 'destroy']);
    Route::post('/api/companies/bulk-delete', [CompanyManagementController::class, 'bulkDelete']);

    // Ruta para la vista
    Route::get('/super/companies', [SuperAdminController::class, 'companies'])->name('super.companies');

    // Rutas para gestión de certificaciones
    Route::get('/api/certifications', [CertificationManagementController::class, 'index']);
    Route::post('/api/certifications', [CertificationManagementController::class, 'store']);
    Route::put('/api/certifications/{certification}', [CertificationManagementController::class, 'update']);
    Route::delete('/api/certifications/{certification}', [CertificationManagementController::class, 'destroy']);
    Route::post('/api/certifications/bulk-delete', [CertificationManagementController::class, 'bulkDelete']);

    // Ruta para la vista
    Route::get('/super/certifications', [SuperAdminController::class, 'certifications'])->name('super.certifications');

    Route::get('/api/super/dashboard-stats', [SuperAdminController::class, 'getDashboardStats']);
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

Route::get('/api/values/{value}/subcategories', [IndicatorController::class, 'getSubcategoriesByValue']);

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/companies/list', [SuperAdminCompanyController::class, 'getCompaniesList']);
    Route::post('/api/super/switch-company', [SuperAdminCompanyController::class, 'switchCompany']);
});

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/super/active-company', [SuperAdminCompanyController::class, 'getActiveCompany']);
});

Route::post('/indicadores/store-answers', [IndicadorAnswerController::class, 'store'])
    ->name('indicadores.store-answers')
    ->middleware(['auth']);

Route::get('/api/evaluation/indicators', [EvaluationController::class, 'getIndicators'])
    ->middleware(['auth', 'verified'])
    ->name('evaluation.indicators');

Route::post('/evaluacion/store-answers', [EvaluationAnswerController::class, 'store'])
    ->name('evaluacion.store-answers')
    ->middleware(['auth']);

Route::delete('/evaluacion/delete-file', [EvaluationAnswerController::class, 'deleteFile'])
    ->name('evaluacion.delete-file');

Route::middleware(['auth', EnsureUserIsEvaluador::class])->group(function () {
    Route::get('/evaluador/dashboard', [EvaluadorController::class, 'dashboard'])->name('evaluador.dashboard');
    Route::get('/evaluador/companies', [EvaluadorController::class, 'companies'])->name('evaluador.companies');
    Route::get('/evaluador/evaluations', [EvaluadorController::class, 'evaluations'])->name('evaluador.evaluations');
    Route::get('/evaluador/profile', [ProfileController::class, 'edit'])->name('evaluador.profile.edit');

    Route::get('/api/evaluador/companies', [EvaluadorController::class, 'getCompaniesList']);
    Route::get('/api/evaluador/active-company', [EvaluadorController::class, 'getActiveCompany']);
    Route::post('/api/evaluador/switch-company', [EvaluadorController::class, 'switchCompany']);
});

Route::post('/company/profile', [CompanyProfileController::class, 'store'])->name('company.profile.store');

// Rutas para reportes
Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/empresas-reportes', [ReportController::class, 'getCompanies']);
});

require __DIR__ . '/auth.php';
