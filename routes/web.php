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
use App\Http\Controllers\ProgresosController;
use App\Http\Controllers\CompanyAuthorizationController;
use App\Http\Middleware\EnsureCompanyIsAuthorized;
use App\Http\Controllers\RequisitosController;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\Commands\StorageCommandController;
use App\Http\Controllers\UsersManagementSuperAdminController;
use App\Http\Middleware\EnsureUserHasNoCompany;
use App\Http\Controllers\ImportController;
use App\Http\Middleware\EnsureApplicationSended;
use App\Http\Controllers\MailLogController;
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
        Route::get('/company-register', 'showCompanyRegister')
            ->middleware([EnsureUserHasNoCompany::class])
            ->name('company.register');
        Route::post('/company-register', 'storeCompany')
            ->middleware([EnsureUserHasNoCompany::class])
            ->name('company.store');
        Route::get('/legal-id', 'showLegalId')
            ->middleware([EnsureUserHasNoCompany::class])
            ->name('legal.id');
        Route::post('/legal-id/verify', 'verifyLegalId')
            ->middleware([EnsureUserHasNoCompany::class])
            ->name('legal-id.verify');
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
        $user = Auth::user();
        return Inertia::render('Auth/PendingApproval', [
            'status' => $user->status
        ]);
    })->name('approval.pending');
});

Route::middleware(['auth', 'verified', EnsureApplicationSended::class, EnsureUserHasCompany::class])->group(function () {
    Route::get('/form-empresa', [DashboardController::class, 'showFormEmpresa'])
        ->name('form.empresa');
});

Route::middleware(['auth', 'verified', EnsureUserHasCompany::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'showEvaluation'])
        ->name('dashboard');
    Route::get('/indicadores/{id}', [IndicadoresController::class, 'index'])
        ->name('indicadores');
    // Otras rutas protegidas...

    Route::post('/evaluation/send-application', [EvaluationController::class, 'sendApplication'])->name('evaluation.send-application');

    Route::post('/company/profile/update-form-sended', [CompanyProfileController::class, 'updateFormSended'])
        ->name('company.profile.update-form-sended');
        
        
    // Ruta para verificar el estado de la autoevaluación
    Route::get('/api/check-autoevaluation-status', [IndicadorAnswerController::class, 'checkAutoEvaluationStatus'])
        ->name('api.check-autoevaluation-status');
        
    // Ruta para guardar las respuestas de los indicadores
    Route::post('/indicadores/store-answers', [IndicadorAnswerController::class, 'store'])
        ->name('indicadores.store-answers');
        
    // Ruta para guardar parcialmente las respuestas sin finalizar
    Route::post('/indicadores/save-partial-answers', [IndicadorAnswerController::class, 'savePartialAnswers'])
        ->name('indicadores.save-partial-answers');
        
    // Ruta para finalizar la autoevaluación
    Route::post('/indicadores/finalizar-autoevaluacion', [IndicadorAnswerController::class, 'finalizarAutoEvaluacion'])
        ->name('indicadores.finalizar-autoevaluacion');
});

Route::middleware(['auth', 'verified', EnsureUserHasCompany::class, EnsureCompanyIsAuthorized::class])->group(function () {
    Route::get('/evaluacion/{value_id}', [EvaluationController::class, 'index'])
        ->name('evaluacion');
});

Route::middleware(['auth', EnsureUserIsEvaluador::class])->group(function () {
    Route::get('/evaluador/reportes', [EvaluadorController::class, 'reportes'])->name('evaluador.reportes');
    Route::get('/api/evaluador/companies', [EvaluadorController::class, 'getCompaniesList']);
    Route::get('/evaluador/dashboard', [EvaluadorController::class, 'dashboard'])->name('evaluador.dashboard');
    Route::get('/evaluador/companies', [EvaluadorController::class, 'companies'])->name('evaluador.companies');
    Route::get('/evaluador/profile', [ProfileController::class, 'edit'])->name('evaluador.profile.edit');
    Route::get('/evaluador/empresas', [EvaluadorController::class, 'companies'])->name('evaluador.empresas');
    Route::get('/api/evaluador/active-company', [EvaluadorController::class, 'getActiveCompany']);
    Route::post('/api/evaluador/switch-company', [EvaluadorController::class, 'switchCompany']);
    Route::post('/api/evaluacion/calificar-nuevamente', [EvaluationAnswerController::class, 'calificarNuevamente'])
        ->name('evaluacion.calificar-nuevamente');
    Route::post('/api/company/update-evaluation-fields', [EvaluadorController::class, 'updateEvaluationFields'])
        ->name('company.update.evaluation-fields');
    Route::get('/api/company/{company}/evaluation-fields', [EvaluadorController::class, 'getEvaluationFields']);
});

Route::middleware(['auth', EnsureUserIsEvaluador::class, EnsureCompanyIsAuthorized::class])->group(function () {
    Route::get('/evaluador/evaluations', [EvaluadorController::class, 'evaluations'])->name('evaluador.evaluations');
});

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/super/progresos', [DashboardController::class, 'showProgresos'])->name('super.progresos');
    Route::get('/super/reportes', [DashboardController::class, 'showReportes'])->name('super.reportes');
    Route::get('/super/dashboard', [SuperAdminController::class, 'dashboard'])->name('super.dashboard');
    Route::get('/super/components', [DashboardController::class, 'showComponents'])->name('super.components');
    Route::get('/super/companies', [SuperAdminController::class, 'companies'])->name('super.companies');
    Route::get('/super/users', [SuperAdminController::class, 'users'])->name('super.users');
    Route::get('/super/certifications', [SuperAdminController::class, 'certifications'])->name('super.certifications');
    Route::get('/super/settings', [SuperAdminController::class, 'settings'])->name('super.settings');
    Route::get('/super/values', [SuperAdminController::class, 'values'])->name('super.values');
    Route::get('/super/subcategories', [SuperAdminController::class, 'subcategories'])->name('super.subcategories');
    Route::get('/super/requisitos', [SuperAdminController::class, 'requisitos'])->name('super.requisitos');
    Route::get('/super/homologations', [SuperAdminController::class, 'homologations'])->name('super.homologations');
    Route::get('/super/indicators', [SuperAdminController::class, 'indicators'])->name('super.indicators');
    Route::get('/super/importaciones', [ImportController::class, 'index'])->name('super.importaciones');

    Route::get('/api/subcategories', [SubcategoryController::class, 'index']);
    Route::post('/api/subcategories', [SubcategoryController::class, 'store']);
    Route::put('/api/subcategories/{subcategory}', [SubcategoryController::class, 'update']);
    Route::delete('/api/subcategories/{subcategory}', [SubcategoryController::class, 'destroy']);
    Route::post('/api/subcategories/bulk-delete', [SubcategoryController::class, 'bulkDelete']);

    Route::get('/api/requisitos', [RequisitosController::class, 'index']);
    Route::post('/api/requisitos', [RequisitosController::class, 'store']);
    Route::put('/api/requisitos/{requisito}', [RequisitosController::class, 'update']);
    Route::delete('/api/requisitos/{requisito}', [RequisitosController::class, 'destroy']);
    Route::post('/api/requisitos/bulk-delete', [RequisitosController::class, 'bulkDelete']);
    Route::get('/api/requisitos/subcategories', [RequisitosController::class, 'getSubcategories']);
    Route::get('/api/subcategories/{subcategory}/requisitos', [RequisitosController::class, 'getRequisitosBySubcategory']);

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
    Route::delete('/api/indicators/{indicator}/questions/{question}', [IndicatorController::class, 'deleteEvaluationQuestion']);
    Route::post('/api/indicators/bulk-delete', [IndicatorController::class, 'bulkDelete']);
    Route::get('/api/indicators/related-data', [IndicatorController::class, 'getRelatedData']);

    // Ruta para la vista
    Route::get('/super/indicators', [SuperAdminController::class, 'indicators'])
        ->name('super.indicators');

    // Rutas para ordenar subcategorías
    Route::get('/api/values/{value}/subcategories', [ValueController::class, 'getSubcategoriesByValue']);
    Route::post('/api/subcategories/update-order', [ValueController::class, 'updateSubcategoriesOrder']);


    // Rutas para gestión de usuarios
    Route::get('/api/users', [UsersManagementSuperAdminController::class, 'index']);
    Route::post('/api/users', [UsersManagementSuperAdminController::class, 'store']);
    Route::get('/api/users/{user}', [UsersManagementSuperAdminController::class, 'show']);
    Route::put('/api/users/{user}', [UsersManagementSuperAdminController::class, 'update']);
    Route::delete('/api/users/{user}', [UsersManagementSuperAdminController::class, 'destroy']);
    Route::post('/api/users/bulk-delete', [UsersManagementSuperAdminController::class, 'bulkDelete']);
    Route::patch('/api/users/{user}/status', [UsersManagementSuperAdminController::class, 'updateStatus']);
    Route::patch('/api/users/{user}/role', [UsersManagementSuperAdminController::class, 'updateRole']);
    Route::get('/api/companies/active', [UsersManagementSuperAdminController::class, 'getActiveCompanies']);

    // Ruta para la vista
    Route::get('/super/users', [SuperAdminController::class, 'users'])->name('super.users');

    // Rutas para gestión de empresas
    Route::get('/api/companies', [CompanyManagementController::class, 'index']);
    Route::post('/api/companies', [CompanyManagementController::class, 'store']);
    Route::get('/api/companies/{company}/detail', [CompanyManagementController::class, 'show']);
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

    Route::get('/api/empresas-reportes', [ReportController::class, 'getCompanies']);
    Route::patch('/api/empresas-reportes/{company}/authorize-exporter', [ReportController::class, 'authorizeExporter'])
        ->name('companies.authorize-exporter');
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

Route::post('/evaluacion/store-answers-by-indicator', [EvaluationAnswerController::class, 'storeByIndicator'])
    ->name('evaluacion.store-answers-by-indicator')
    ->middleware(['auth']);

Route::delete('/evaluacion/delete-file', [EvaluationAnswerController::class, 'deleteFile'])
    ->name('evaluacion.delete-file');

Route::post('/company/profile', [CompanyProfileController::class, 'store'])->name('company.profile.store');
Route::post('/company/profile/delete-file', [CompanyProfileController::class, 'deleteFile'])->name('company.profile.delete-file');
Route::get('/company/profile/download-file', [CompanyProfileController::class, 'downloadFile'])->name('company.profile.download-file');

// Nuevas rutas para carga de imágenes por separado
Route::post('/company/profile/upload-logo', [CompanyProfileController::class, 'uploadLogo'])->name('company.profile.upload-logo');
Route::post('/company/profile/upload-fotografias', [CompanyProfileController::class, 'uploadFotografias'])->name('company.profile.upload-fotografias');
Route::post('/company/profile/upload-certificaciones', [CompanyProfileController::class, 'uploadCertificaciones'])->name('company.profile.upload-certificaciones');
Route::post('/company/profile/upload-productos', [CompanyProfileController::class, 'uploadProductos'])->name('company.profile.upload-productos');

Route::delete('/company/product/{productId}', [CompanyProfileController::class, 'destroyProduct'])
    ->name('company.product.destroy')
    ->middleware(['auth', 'verified', EnsureUserHasCompany::class]);

// Rutas para reportes
Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/empresas-reportes', [ReportController::class, 'getCompanies']);
});

Route::middleware(['auth', EnsureUserIsEvaluador::class])->group(function () {
    Route::get('/api/empresas-reportes-evaluador', [ReportController::class, 'getCompaniesEmpresa']);
    Route::post('/api/evaluacion/calificar-nuevamente', [EvaluationAnswerController::class, 'calificarNuevamente'])
        ->name('evaluacion.calificar-nuevamente');
});

// Rutas para progresos
Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/api/empresas-progresos', [ProgresosController::class, 'getCompanies']);
});

// Rutas para gestionar enlaces de almacenamiento
Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/storage/link', [StorageCommandController::class, 'link'])->name('storage.link');
    Route::get('/storage/unlink', [StorageCommandController::class, 'unlink'])->name('storage.unlink');
});

Route::middleware(['auth'])->group(function () {
    Route::patch('/api/companies/{company}/authorize', [CompanyAuthorizationController::class, 'authorizeCompany'])
        ->middleware('can:authorize,company')
        ->name('companies.authorize');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/api/enviar-evaluacion-completada', [EvaluationAnswerController::class, 'enviarEvaluacionCompletada'])
        ->name('indicadores.enviar-evaluacion-completada');

    Route::post('/api/enviar-evaluacion-calificada', [EvaluationAnswerController::class, 'enviarEvaluacionCalificada'])
        ->name('indicadores.enviar-evaluacion-calificada');
});

Route::get('/api/lugares', function () {
    return response()->file(storage_path('app/public/lugares.json'));
})->name('api.lugares');

Route::get('/download-indicators-pdf', [PDFController::class, 'downloadIndicatorsPDF'])
    ->name('download.indicators.pdf')
    ->middleware(['auth']);

Route::get('/download-company-documentation', [PDFController::class, 'downloadCompanyDocumentation'])
    ->name('download.company.documentation')
    ->middleware(['auth']);

Route::get('/download-evaluation-pdf/{companyId?}', [PDFController::class, 'downloadEvaluationPDF'])
    ->name('download.evaluation.pdf')
    ->middleware(['auth']);

// Rutas para gestión de usuarios por compañía
Route::middleware(['auth'])->group(function () {
    Route::get('/api/users/company', [UserManagementController::class, 'index']);
    Route::post('/api/users/company', [UserManagementController::class, 'store']);
    Route::get('/api/users/company/{user}', [UserManagementController::class, 'show']);
    Route::put('/api/users/company/{user}', [UserManagementController::class, 'update']);
    Route::delete('/api/users/company/{user}', [UserManagementController::class, 'destroy']);
    Route::get('/api/pending-users/company', [UserManagementController::class, 'getPendingUsers']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas para importación de datos
    Route::get('/importaciones', [App\Http\Controllers\ImportController::class, 'index'])->name('import.index');
    Route::post('/import/companies', [App\Http\Controllers\ImportController::class, 'importCompanies'])->name('import.companies');
    Route::post('/import/users', [App\Http\Controllers\ImportController::class, 'importUsers'])->name('import.users');
    Route::post('/import/companies-additional-info', [App\Http\Controllers\ImportController::class, 'importCompaniesAdditionalInfo'])->name('import.companies-additional-info');
});

Route::post('/company/product/delete-image', [CompanyProfileController::class, 'deleteProductImage'])
    ->name('company.product.delete-image');

Route::middleware(['auth', EnsureUserIsSuperAdmin::class])->group(function () {
    Route::get('/mail-logs', [MailLogController::class, 'index'])->name('mail-logs.index');
    Route::post('/mail-logs/{id}/retry', [MailLogController::class, 'retry'])->name('mail-logs.retry');
    Route::post('/mail-logs/send-test', [MailLogController::class, 'sendTest'])->name('mail-logs.send-test');
});

Route::delete('certifications/{certification}/files', [CertificationController::class, 'deleteFile'])
    ->name('certifications.deleteFile');

require __DIR__ . '/auth.php';
