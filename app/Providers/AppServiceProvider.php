<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Configurar las reglas de validación de contraseñas: mínimo 8 caracteres, al menos una mayúscula y al menos un número
        Password::defaults(function () {
            return Password::min(8)
                ->mixedCase()
                /*->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()*/
                ->numbers();
        });
    }
}
