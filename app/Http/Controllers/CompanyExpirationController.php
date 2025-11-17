<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CompanyExpirationController extends Controller
{
    /**
     * Muestra la vista para cargar el archivo Excel de fechas de vencimiento
     */
    public function index()
    {
        return Inertia::render('SuperAdmin/CompanyExpiration', [
            'title' => 'Cargar fechas de vencimiento',
            'description' => 'Sube un archivo Excel con fechas de vencimiento para las empresas'
        ]);
    }

    /**
     * Procesa el archivo Excel con fechas de vencimiento
     */
    public function uploadExcel(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls,csv'
        ], [
            'excel_file.required' => 'Debe seleccionar un archivo Excel',
            'excel_file.mimes' => 'El archivo debe ser de tipo Excel (.xlsx, .xls) o CSV'
        ]);

        try {
            $file = $request->file('excel_file');
            $spreadsheet = IOFactory::load($file->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $data = $worksheet->toArray();

            // Remover la primera fila si contiene encabezados
            if (count($data) > 0) {
                array_shift($data);
            }

            $processed = 0;
            $updated = 0;
            $notFound = [];

            DB::beginTransaction();

            foreach ($data as $row) {
                // Validar que la fila tenga al menos 3 columnas
                if (count($row) < 3) {
                    continue;
                }

                $fechaVencimiento = $this->parseDate($row[0]);
                $cedulaJuridica = trim($row[1]);
                $nombreEmpresa = trim($row[2]);

                if (!$fechaVencimiento || !$cedulaJuridica) {
                    continue;
                }

                $processed++;

                // Buscar empresa por cédula jurídica
                $company = Company::where('legal_id', $cedulaJuridica)->first();

                // Si no se encuentra por cédula, buscar por nombre
                if (!$company && $nombreEmpresa) {
                    $company = Company::where('name', 'LIKE', '%' . $nombreEmpresa . '%')->first();
                }

                if ($company) {
                    $company->update(['fecha_vencimiento' => $fechaVencimiento]);
                    $updated++;
                    
                    Log::info("Fecha de vencimiento actualizada para empresa: {$company->name} ({$company->legal_id})");
                } else {
                    $notFound[] = [
                        'cedula' => $cedulaJuridica,
                        'nombre' => $nombreEmpresa,
                        'fecha' => $fechaVencimiento
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Proceso completado. {$updated} empresas actualizadas de {$processed} registros procesados.",
                'data' => [
                    'processed' => $processed,
                    'updated' => $updated,
                    'not_found' => count($notFound),
                    'not_found_details' => $notFound
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error al procesar archivo Excel de fechas de vencimiento: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Convierte diferentes formatos de fecha a formato Y-m-d
     */
    private function parseDate($dateValue)
    {
        if (empty($dateValue)) {
            return null;
        }

        // Si es un número de serie de Excel
        if (is_numeric($dateValue)) {
            try {
                $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($dateValue);
                return $date->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        // Si es una cadena de texto, intentar parsearla
        try {
            $date = new \DateTime($dateValue);
            return $date->format('Y-m-d');
        } catch (\Exception $e) {
            // Intentar diferentes formatos comunes
            $formats = ['d/m/Y', 'm/d/Y', 'd-m-Y', 'm-d-Y', 'Y-m-d', 'Y/m/d'];
            
            foreach ($formats as $format) {
                $date = \DateTime::createFromFormat($format, $dateValue);
                if ($date !== false) {
                    return $date->format('Y-m-d');
                }
            }
        }

        return null;
    }

    /**
     * Obtiene estadísticas de empresas por status
     */
    public function getCompaniesStats()
    {
        $stats = [
            'total' => Company::count(),
            'nueva' => 0,
            'en_evaluacion' => 0,
            'en_renovacion' => 0,
            'con_fecha_vencimiento' => Company::whereNotNull('fecha_vencimiento')->count(),
            'sin_fecha_vencimiento' => Company::whereNull('fecha_vencimiento')->count()
        ];

        // Obtener empresas con sus relaciones necesarias para calcular el status de manera eficiente
        $companies = Company::with('indicatorAnswers')
            ->select('id', 'estado_eval', 'fecha_vencimiento')
            ->get();
        
        foreach ($companies as $company) {
            $status = $company->status;
            
            switch ($status) {
                case 'Nueva':
                    $stats['nueva']++;
                    break;
                case 'En evaluación':
                    $stats['en_evaluacion']++;
                    break;
                case 'En renovación':
                    $stats['en_renovacion']++;
                    break;
            }
        }

        return response()->json($stats);
    }
}
