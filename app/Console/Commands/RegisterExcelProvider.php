<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RegisterExcelProvider extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'register:excel-provider';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Registra el proveedor de servicios de Excel en config/app.php';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Registrando el proveedor de servicios de Excel en config/app.php...');

        $appConfigPath = config_path('app.php');
        
        if (!File::exists($appConfigPath)) {
            $this->error('El archivo config/app.php no existe.');
            return 1;
        }
        
        $appConfig = File::get($appConfigPath);
        
        // Verificar si el proveedor ya está registrado
        if (strpos($appConfig, 'App\Providers\ExcelServiceProvider::class') !== false) {
            $this->info('El proveedor de servicios ya está registrado en config/app.php.');
            return 0;
        }
        
        // Buscar la sección de providers
        $providersPattern = "/('providers' => \[\s*)(.*?)(\s*\])/s";
        if (preg_match($providersPattern, $appConfig, $matches)) {
            $providers = $matches[1] . $matches[2] . "\n        App\Providers\ExcelServiceProvider::class," . $matches[3];
            $appConfig = str_replace($matches[0], $providers, $appConfig);
            
            // Guardar el archivo
            File::put($appConfigPath, $appConfig);
            
            $this->info('El proveedor de servicios ha sido registrado correctamente en config/app.php.');
            return 0;
        } else {
            $this->error('No se pudo encontrar la sección de providers en config/app.php.');
            return 1;
        }
    }
} 