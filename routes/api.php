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
    
    // Nueva ruta para obtener el estado del usuario
    Route::get('/user-status', function (Request $request) {
        $user = $request->user();
        $company = $user->company;
        
        return [
            'auto_evaluation_status' => $company ? $company->autoEvaluationStatus() : 'en_proceso',
            'company_authorized' => $company ? $company->authorized : false
        ];
    });
});

// Ruta para obtener las provincias
Route::get('/provincias', function () {
    // Cargar las provincias desde el archivo lugares.json
    $lugaresJson = file_get_contents(storage_path('app/public/lugares.json'));
    $lugares = json_decode($lugaresJson, true);
    
    // Extraer solo las provincias
    $provincias = [];
    if (isset($lugares[0]['provincias'])) {
        foreach ($lugares[0]['provincias'] as $provincia) {
            $provincias[] = [
                'id' => $provincia['id'],
                'name' => $provincia['name']
            ];
        }
    }
    
    return $provincias;
});

// Route::patch('companies/{company}/authorize', [CompanyAuthorizationController::class, 'authorizeCompany'])
//     ->middleware(['auth'])
//     ->name('companies.authorize');