<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Exports\CompaniesMonthlyReport;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class SendMonthlyCompaniesReport extends Command
{
    protected $signature = 'report:companies-monthly';
    protected $description = 'Genera y envía el reporte mensual de empresas al super admin';

    public function handle()
    {
        try {
            ini_set('memory_limit', '1024M'); // Aumentar el límite de memoria solo para este proceso
            
            $this->info('Generando reporte mensual de empresas...');
            
            Storage::makeDirectory('reports');
            
            $fileName = 'reporte_empresas_' . Carbon::now()->format('Y_m') . '.xlsx';
            $filePath = 'reports/' . $fileName;
            
            $this->info('Generando archivo en: ' . $filePath);
            
            // Usar el método store con opciones de escritura en lotes
            Excel::store(
                new CompaniesMonthlyReport(),
                $filePath,
                'local',
                \Maatwebsite\Excel\Excel::XLSX,
                [
                    'chunk_size' => 100 // Procesar en lotes de 100 registros
                ]
            );
            
            // Verificar si el archivo se creó correctamente
            if (!Storage::exists($filePath)) {
                throw new \Exception("El archivo no se pudo generar en: " . $filePath);
            }
            
            // Obtener la ruta física completa del archivo
            $fullPath = Storage::path($filePath);
            
            // Obtener todos los super_admin
            // $superAdmins = User::where('role', 'super_admin')->get();

            //Solo enviar al usuario admin@admin.com
            $superAdmins = User::where('email', 'mauricioteruel98@gmail.com')->get();
            
            if ($superAdmins->isEmpty()) {
                $this->warn('No se encontraron super administradores para enviar el reporte.');
                return 0;
            }
            
            $this->info('Enviando emails a ' . $superAdmins->count() . ' administradores...');
            
            $meses = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];
            
            $mesActual = $meses[Carbon::now()->month];
            $anioActual = Carbon::now()->year;
            $fechaReporte = "$mesActual $anioActual";
            
            foreach ($superAdmins as $admin) {
                $this->info('Enviando email a: ' . $admin->email);
                
                Mail::send('emails.monthly-report', [
                    'admin' => $admin,
                    'month' => $fechaReporte
                ], function ($message) use ($admin, $fullPath, $fileName, $fechaReporte) {
                    $message->to($admin->email)
                            ->subject('Reporte Mensual de Empresas - ' . $fechaReporte)
                            ->attach($fullPath, [
                                'as' => $fileName,
                                'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            ]);
                });
            }
            
            Storage::delete($filePath);
            $this->info('Archivo temporal eliminado.');
            
            $this->info('Reporte enviado exitosamente.');
            return 0;
        } catch (\Exception $e) {
            $this->error('Error al generar y enviar el reporte: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return 1;
        }
    }
} 