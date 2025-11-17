<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Exports\CompaniesMonthlyReport;
use App\Exports\UsersCompaniesReport;
use App\Models\User;
use App\Models\MonthlyReport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use App\Notifications\MonthlyReportNotification;
use App\Services\MailService;

/**
 * Comando para generar y enviar reportes mensuales de empresas
 * 
 * Este comando permite generar reportes de empresas registradas en diferentes períodos
 * y enviarlos por email a los super administradores del sistema.
 * 
 * VARIANTES DE USO:
 * 
 * 1. REPORTE DEL MES ANTERIOR (COMPORTAMIENTO POR DEFECTO):
 *    php artisan report:companies-monthly
 *    - Genera reporte del mes anterior al actual
 *    - Ideal para cron jobs que se ejecutan el primer día de cada mes
 *    - Ejemplo: Si se ejecuta el 1 de septiembre, genera reporte de agosto
 * 
 * 2. REPORTE DEL MES CORRIENTE:
 *    php artisan report:companies-monthly --current
 *    - Genera reporte del mes actual
 *    - Útil para generar reportes ad-hoc durante el mes
 *    - Ejemplo: Si se ejecuta el 15 de agosto, genera reporte de agosto
 * 
 * 3. REPORTE DE UN MES ESPECÍFICO DEL AÑO ACTUAL:
 *    php artisan report:companies-monthly --month=7
 *    - Genera reporte de julio del año actual
 *    - El parámetro --month acepta valores del 1 al 12
 *    - Ejemplo: --month=7 genera reporte de julio 2025
 * 
 * 4. REPORTE DE UN MES Y AÑO ESPECÍFICOS:
 *    php artisan report:companies-monthly --month=7 --year=2024
 *    - Genera reporte de julio de 2024
 *    - Permite generar reportes históricos de cualquier período
 *    - Útil para análisis retrospectivos o auditorías
 * 
 * 5. REPORTE DEL MES ACTUAL DE UN AÑO ESPECÍFICO:
 *    php artisan report:companies-monthly --year=2024
 *    - Genera reporte del mes actual pero del año 2024
 *    - Ejemplo: Si estamos en agosto, genera reporte de agosto 2024
 * 
 * 6. MODO TEST:
 *    php artisan report:companies-monthly --test
 *    - Genera y envía los reportes solo a cuentas de prueba específicas
 *    - Envía a: mauricio@buzz.cr y amantilla@buzz.cr
 *    - Útil para probar el formato y contenido antes del envío oficial
 * 
 * EJEMPLOS PRÁCTICOS:
 * 
 * # Generar reporte de julio 2025 (mes anterior si estamos en agosto)
 * php artisan report:companies-monthly
 * 
 * # Generar reporte de agosto 2025 (mes corriente)
 * php artisan report:companies-monthly --current
 * 
 * # Generar reporte de diciembre 2024
 * php artisan report:companies-monthly --month=12 --year=2024
 * 
 * # Generar reporte de marzo del año actual
 * php artisan report:companies-monthly --month=3
 * 
 * # Generar reporte del mes actual de 2023
 * php artisan report:companies-monthly --year=2023
 * 
 * # Probar el envío a cuentas específicas
 * php artisan report:companies-monthly --test
 * 
 * # Probar con mes específico
 * php artisan report:companies-monthly --test --month=7 --year=2024
 * 
 * NOTAS IMPORTANTES:
 * - El comando crea automáticamente el directorio 'reports/monthly' si no existe
 * - Los archivos se nombran con el formato: reporte_empresas_YYYY_MM.xlsx y reporte_usuarios_empresas_YYYY_MM.xlsx
 * - Se envía por email a todos los super administradores configurados (o cuentas de prueba en modo test)
 * - Se guarda un registro en la tabla monthly_reports con metadata del reporte
 * - El comando maneja automáticamente la memoria para archivos grandes
 * - El modo test es ideal para verificar el formato y contenido antes del envío oficial
 */
class SendMonthlyCompaniesReport extends Command
{
    protected $signature = 'report:companies-monthly {--month= : Mes específico (1-12) para el reporte} {--year= : Año específico para el reporte} {--current : Generar reporte del mes corriente en lugar del anterior} {--test : Modo de prueba para enviar a cuentas específicas}';
    protected $description = 'Genera y envía el reporte mensual de empresas al super admin';

    protected $mailService;

    public function __construct(MailService $mailService)
    {
        parent::__construct();
        $this->mailService = $mailService;
    }

    public function handle()
    {
        try {
            ini_set('memory_limit', '1024M'); // Aumentar el límite de memoria solo para este proceso

            // Determinar qué mes reportar
            $targetMonth = $this->determineTargetMonth();
            
            $this->info("Generando reportes para: " . $targetMonth->format('F Y'));

            // Crear directorio si no existe
            Storage::makeDirectory('reports/monthly');

            $inicioMes = $targetMonth->copy()->startOfMonth()->startOfDay();
            $finMes = $targetMonth->copy()->endOfMonth()->endOfDay();

            // Generar reporte de empresas
            $fileNameEmpresas = 'reporte_empresas_' . $targetMonth->format('Y_m') . '.xlsx';
            $filePathEmpresas = 'reports/monthly/' . $fileNameEmpresas;

            $this->info('Generando reporte de empresas en: ' . $filePathEmpresas);

            $reportEmpresas = new CompaniesMonthlyReport($inicioMes, $finMes);
            $metadataEmpresas = $reportEmpresas->getMetadata();

            Excel::store(
                $reportEmpresas,
                $filePathEmpresas,
                'local',
                \Maatwebsite\Excel\Excel::XLSX,
                [
                    'chunk_size' => 100
                ]
            );

            // Generar reporte de usuarios/empresas
            $fileNameUsuarios = 'reporte_usuarios_empresas_' . $targetMonth->format('Y_m') . '.xlsx';
            $filePathUsuarios = 'reports/monthly/' . $fileNameUsuarios;

            $this->info('Generando reporte de usuarios/empresas en: ' . $filePathUsuarios);

            $reportUsuarios = new UsersCompaniesReport($inicioMes, $finMes);

            Excel::store(
                $reportUsuarios,
                $filePathUsuarios,
                'local',
                \Maatwebsite\Excel\Excel::XLSX,
                [
                    'chunk_size' => 100
                ]
            );

            // Verificar si los archivos se crearon correctamente
            if (!Storage::exists($filePathEmpresas)) {
                throw new \Exception("El archivo de empresas no se pudo generar en: " . $filePathEmpresas);
            }

            if (!Storage::exists($filePathUsuarios)) {
                throw new \Exception("El archivo de usuarios no se pudo generar en: " . $filePathUsuarios);
            }

            // Guardar registro en la base de datos
            $monthlyReport = MonthlyReport::create([
                'file_name' => $fileNameEmpresas,
                'file_path' => $filePathEmpresas,
                'month' => $targetMonth->month,
                'year' => $targetMonth->year,
                'total_companies' => $metadataEmpresas['total_companies'] ?? 0,
                'report_metadata' => $metadataEmpresas
            ]);

            // Obtener las rutas físicas completas de los archivos
            $fullPathEmpresas = Storage::path($filePathEmpresas);
            $fullPathUsuarios = Storage::path($filePathUsuarios);

            // Obtener todos los super_admin
            $superAdmins = User::where('role', 'super_admin')->get();

            // Modo test - enviar solo a cuentas específicas
            if ($this->option('test')) {
                $this->info('MODO TEST ACTIVADO - Enviando solo a cuentas de prueba');
                $superAdmins = collect();
                
                // Crear usuarios temporales para las cuentas de prueba
                $testEmails = [
                    'mauricio@buzz.cr',
                    'amantilla@buzz.cr'
                ];
                
                foreach ($testEmails as $email) {
                    $tempUser = new User();
                    $tempUser->email = $email;
                    $tempUser->name = 'Usuario Test';
                    $superAdmins->push($tempUser);
                }
            } else {
                //Solo enviar al usuario mauricioteruel98@gmail.com para testing
                //$superAdmins = User::where('email', 'mauricioteruel98@gmail.com')->get();
                
                // Añadir cuentas de correo adicionales
                $additionalEmails = [
                    'dbadilla@procomer.com'
                ];
                
                foreach ($additionalEmails as $email) {
                    if (!empty($email)) {
                        $tempUser = new User();
                        $tempUser->email = $email;
                        $tempUser->name = 'Destinatario Adicional';
                        $superAdmins->push($tempUser);
                    }
                }
            }

            if ($superAdmins->isEmpty()) {
                $this->warn('No se encontraron super administradores para enviar el reporte.');
                return 0;
            }

            $this->info('Enviando emails a ' . $superAdmins->count() . ' administradores...');

            $meses = [
                1 => 'Enero',
                2 => 'Febrero',
                3 => 'Marzo',
                4 => 'Abril',
                5 => 'Mayo',
                6 => 'Junio',
                7 => 'Julio',
                8 => 'Agosto',
                9 => 'Septiembre',
                10 => 'Octubre',
                11 => 'Noviembre',
                12 => 'Diciembre'
            ];

            $mesReporte = $meses[$targetMonth->month];
            $anioReporte = $targetMonth->year;
            $fechaReporte = "$mesReporte $anioReporte";

            foreach ($superAdmins as $admin) {
                $this->info('Enviando email a: ' . $admin->email);

                $notification = new MonthlyReportNotification(
                    $admin,
                    $fechaReporte,
                    $fullPathEmpresas,
                    $fileNameEmpresas,
                    $fullPathUsuarios,
                    $fileNameUsuarios
                );

                $this->mailService->send($admin->email, $notification);
            }

            $this->info('Reportes enviados exitosamente.');
            return 0;
        } catch (\Exception $e) {
            $this->error('Error al generar y enviar los reportes: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return 1;
        }
    }

    /**
     * Determina qué mes debe ser reportado basado en las opciones del comando
     */
    private function determineTargetMonth(): Carbon
    {
        // Si se especifica mes y año específicos
        if ($this->option('month') && $this->option('year')) {
            $month = (int) $this->option('month');
            $year = (int) $this->option('year');
            
            if ($month < 1 || $month > 12) {
                throw new \InvalidArgumentException('El mes debe estar entre 1 y 12');
            }
            
            return Carbon::create($year, $month, 1);
        }
        
        // Si se especifica solo el año
        if ($this->option('year')) {
            $year = (int) $this->option('year');
            $currentMonth = Carbon::now()->month;
            return Carbon::create($year, $currentMonth, 1);
        }
        
        // Si se especifica solo el mes del año actual
        if ($this->option('month')) {
            $month = (int) $this->option('month');
            $currentYear = Carbon::now()->year;
            
            if ($month < 1 || $month > 12) {
                throw new \InvalidArgumentException('El mes debe estar entre 1 y 12');
            }
            
            return Carbon::create($currentYear, $month, 1);
        }
        
        // Si se especifica --current, usar el mes actual
        if ($this->option('current')) {
            return Carbon::now()->startOfMonth();
        }
        
        // Por defecto, usar el mes anterior
        return Carbon::now()->subMonth()->startOfMonth();
    }
}