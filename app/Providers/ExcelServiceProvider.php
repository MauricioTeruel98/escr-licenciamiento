<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class ExcelServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        try {
            // Registrar el proveedor de servicios de Laravel Excel
            $this->app->register(\Maatwebsite\Excel\ExcelServiceProvider::class);
            
            // Registrar el alias
            if (!class_exists('Excel')) {
                $this->app->alias(\Maatwebsite\Excel\Facades\Excel::class, 'Excel');
            }
            
            Log::info('Proveedor de servicios de Laravel Excel registrado correctamente en tiempo de ejecución.');
        } catch (\Exception $e) {
            Log::error('Error al registrar el proveedor de servicios de Laravel Excel: ' . $e->getMessage());
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
} 