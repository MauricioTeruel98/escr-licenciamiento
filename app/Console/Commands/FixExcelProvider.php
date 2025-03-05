<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixExcelProvider extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:excel-provider';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica y registra el proveedor de servicios de Laravel Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Verificando el proveedor de servicios de Laravel Excel...');

        // Verificar si el proveedor está cargado
        $isLoaded = array_key_exists('Maatwebsite\Excel\ExcelServiceProvider', app()->getLoadedProviders());

        if ($isLoaded) {
            $this->info('El proveedor de servicios de Laravel Excel ya está cargado.');
            return 0;
        }

        $this->warn('El proveedor de servicios de Laravel Excel NO está cargado. Intentando registrarlo...');

        // Verificar si el paquete está instalado
        if (!class_exists('Maatwebsite\Excel\ExcelServiceProvider')) {
            $this->error('El paquete Laravel Excel no está instalado. Por favor, instálelo con: composer require maatwebsite/excel');
            return 1;
        }

        // Registrar el proveedor manualmente
        app()->register('Maatwebsite\Excel\ExcelServiceProvider');
        
        // Verificar si el proveedor está cargado después de registrarlo
        $isLoadedNow = array_key_exists('Maatwebsite\Excel\ExcelServiceProvider', app()->getLoadedProviders());

        if ($isLoadedNow) {
            $this->info('El proveedor de servicios de Laravel Excel ha sido registrado correctamente.');
            
            // Verificar si el archivo config/app.php existe
            $appConfigPath = config_path('app.php');
            if (File::exists($appConfigPath)) {
                $this->info('Verificando si el proveedor está registrado en config/app.php...');
                
                $appConfig = File::get($appConfigPath);
                
                if (strpos($appConfig, 'Maatwebsite\Excel\ExcelServiceProvider') === false) {
                    $this->warn('El proveedor no está registrado en config/app.php. Se recomienda agregarlo manualmente.');
                    $this->info('Agregue la siguiente línea en la sección "providers" de config/app.php:');
                    $this->line('Maatwebsite\Excel\ExcelServiceProvider::class,');
                    
                    $this->info('Y agregue la siguiente línea en la sección "aliases" de config/app.php:');
                    $this->line("'Excel' => Maatwebsite\Excel\Facades\Excel::class,");
                } else {
                    $this->info('El proveedor ya está registrado en config/app.php.');
                }
            }
            
            return 0;
        } else {
            $this->error('No se pudo registrar el proveedor de servicios de Laravel Excel.');
            return 1;
        }
    }
} 