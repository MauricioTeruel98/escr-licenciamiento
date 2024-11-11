<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/regard', function () {
    return Inertia::render('Auth/Regard');
})->name('regard');

Route::get('/company-register', function () {
    return Inertia::render('Auth/CompanyRegister');
})->name('company.register');

Route::get('/legal-id', function () {
    return Inertia::render('Auth/LegalId');
})->name('legal.id');

Route::get('/company-exists', function () {
    return Inertia::render('Auth/CompanyExists');
})->name('company.exists');

Route::get('/evaluation', function () {
    return Inertia::render('Dashboard/Evaluation');
})->name('evaluation');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
