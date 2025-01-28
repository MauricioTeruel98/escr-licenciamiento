<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CreateStorageFolders extends Command
{
    protected $signature = 'storage:create-folders';
    protected $description = 'Create all necessary storage folders';

    public function handle()
    {
        $folders = [
            'empresas',
            'empresas/logos',
            'empresas/fotografias',
            'empresas/certificaciones',
            'empresas/productos',
        ];

        foreach ($folders as $folder) {
            if (!Storage::disk('public')->exists($folder)) {
                Storage::disk('public')->makeDirectory($folder);
                $this->info("Created folder: {$folder}");
            } else {
                $this->info("Folder already exists: {$folder}");
            }
        }

        // Asegurar que el enlace simbólico existe
        $this->call('storage:link');
        
        // Establecer permisos
        $this->info('Setting permissions...');
        system('chmod -R 775 ' . storage_path('app/public'));

        $this->info('All folders created and configured successfully!');
    }
} 