<?php

namespace App\Http\Controllers;

use App\Models\Value;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use ZipArchive;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CompanyExport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PDFController extends Controller
{
    public function downloadIndicatorsPDF()
    {
        $values = Value::with(['subcategories.indicators.requisito'])->get();

        $pdf = Pdf::loadView('pdf.indicators', compact('values'));

        return $pdf->download('indicadores_licenciamiento.pdf');
    }

    public function downloadCompanyDocumentation(Request $request)
    {
        try {
            Log::info('Iniciando descarga de documentación');
            
            // Obtener el usuario autenticado y su empresa
            $user = Auth::user();
            
            $companyId = null;

            if($request->has('company_id')) {
                $companyId = $request->input('company_id');
            } else {
                $companyId = $user->company_id;
            }
            
            if (!$user || !$companyId) {
                Log::error('Usuario no autenticado o sin empresa asignada');
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            Log::info('Usuario autenticado: ' . $user->id . ', Empresa: ' . $companyId);

            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);
            
            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $companyId);
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            Log::info('Empresa encontrada: ' . $company->name);

            // Crear un archivo Excel con la información de la empresa
            $companySlug = Str::slug($company->name);
            $excelFileName = "informacion_empresa_{$company->id}_{$companySlug}.xlsx";
            $zipFileName = "documentacion_empresa_{$company->id}_{$companySlug}.zip";
            
            // Crear directorios temporales
            $tempDir = storage_path('app/temp');
            $excelPath = "{$tempDir}/{$excelFileName}";
            $zipPath = "{$tempDir}/{$zipFileName}";
            
            // Asegurarse de que el directorio temporal exista
            if (!File::exists($tempDir)) {
                File::makeDirectory($tempDir, 0755, true);
            }
            
            // Limpiar archivos temporales anteriores
            if (File::exists($excelPath)) {
                File::delete($excelPath);
            }
            if (File::exists($zipPath)) {
                File::delete($zipPath);
            }
            
            // Generar el archivo Excel manualmente
            Log::info('Generando archivo Excel manualmente en: ' . $excelPath);
            
            try {
                // Crear un archivo Excel simple con la información de la empresa
                $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
                $sheet = $spreadsheet->getActiveSheet();
                $sheet->setTitle('Información de la Empresa');
                
                // Encabezados actualizados
                $headers = [
                    'ID',
                    'Nombre',
                    'Cédula Jurídica',
                    'Nombre Comercial',
                    'Nombre Legal',
                    'Teléfono',
                    'Teléfono Móvil',
                    'Sitio Web',
                    'Sector',
                    'Provincia',
                    'Cantón',
                    'Distrito',
                    'Actividad Comercial',
                    'Es Exportadora',
                    'Descripción (ES)',
                    'Descripción (EN)',
                    'Año de Fundación',
                    'Facebook',
                    'LinkedIn',
                    'Instagram',
                    'Otra Red Social',
                    'Tamaño de Empresa',
                    'Cantidad Hombres',
                    'Cantidad Mujeres',
                    'Cantidad Otros',
                    'Teléfono 1',
                    'Teléfono 2',
                    'Países Exportación',
                    'Rango Exportaciones',
                    'Planes Expansión',
                    'Razón Licenciamiento (ES)',
                    'Razón Licenciamiento (EN)',
                    'Proceso Licenciamiento',
                    'Recomienda Marca País',
                    'Observaciones',
                    'Contacto Mercadeo - Nombre',
                    'Contacto Mercadeo - Email',
                    'Contacto Mercadeo - Puesto',
                    'Contacto Mercadeo - Teléfono',
                    'Contacto Mercadeo - Celular',
                    'Contacto Micrositio - Nombre',
                    'Contacto Micrositio - Email',
                    'Contacto Micrositio - Puesto',
                    'Contacto Micrositio - Teléfono',
                    'Contacto Micrositio - Celular',
                    'Contacto Vocero - Nombre',
                    'Contacto Vocero - Email',
                    'Contacto Vocero - Puesto',
                    'Contacto Vocero - Teléfono',
                    'Contacto Vocero - Celular',
                    'Contacto Representante - Nombre',
                    'Contacto Representante - Email',
                    'Contacto Representante - Puesto',
                    'Contacto Representante - Teléfono',
                    'Contacto Representante - Celular',
                    'Estado de Evaluación',
                    'Fecha de Registro',
                    'Última Actualización',
                ];
                
                // Aplicar encabezados
                foreach ($headers as $index => $header) {
                    // Convertir el índice numérico a letra de columna (A, B, C, etc.)
                    $columnLetter = $this->getColumnLetter($index);
                    $sheet->setCellValue($columnLetter . '1', $header);
                }
                
                // Datos de la empresa actualizados
                $infoAdicional = $company->infoAdicional;
                
                // Obtener el estado formateado
                $estadoEval = '';
                switch ($company->estado_eval) {
                    case 'auto-evaluacion':
                        $estadoEval = 'Auto-evaluación';
                        break;
                    case 'auto-evaluacion-completed':
                        $estadoEval = 'Auto-evaluación Completada';
                        break;
                    case 'evaluacion-pendiente':
                        $estadoEval = 'Evaluación Pendiente';
                        break;
                    case 'evaluacion':
                        $estadoEval = 'Evaluación';
                        break;
                    case 'evaluacion-completada':
                        $estadoEval = 'Evaluación Completada';
                        break;
                    case 'evaluado':
                        $estadoEval = 'Evaluado';
                        break;
                    default:
                        $estadoEval = 'No aplica';
                }
                
                // Preparar los datos
                $data = [
                    $company->id,
                    $company->name,
                    $company->legal_id,
                    $infoAdicional ? $infoAdicional->nombre_comercial : '',
                    $infoAdicional ? $infoAdicional->nombre_legal : '',
                    $company->phone,
                    $company->mobile,
                    $company->website ?? ($infoAdicional ? $infoAdicional->sitio_web : ''),
                    $company->sector,
                    $company->provincia,
                    $company->canton,
                    $company->distrito,
                    $company->commercial_activity,
                    $company->is_exporter ? 'Sí' : 'No',
                    $infoAdicional ? $infoAdicional->descripcion_es : '',
                    $infoAdicional ? $infoAdicional->descripcion_en : '',
                    $infoAdicional ? $infoAdicional->anio_fundacion : '',
                    $infoAdicional ? $infoAdicional->facebook : '',
                    $infoAdicional ? $infoAdicional->linkedin : '',
                    $infoAdicional ? $infoAdicional->instagram : '',
                    $infoAdicional ? $infoAdicional->otra_red_social : '',
                    $infoAdicional ? $infoAdicional->tamano_empresa : '',
                    $infoAdicional ? $infoAdicional->cantidad_hombres : '',
                    $infoAdicional ? $infoAdicional->cantidad_mujeres : '',
                    $infoAdicional ? $infoAdicional->cantidad_otros : '',
                    $infoAdicional ? $infoAdicional->telefono_1 : '',
                    $infoAdicional ? $infoAdicional->telefono_2 : '',
                    $infoAdicional ? $infoAdicional->paises_exportacion : '',
                    $infoAdicional ? $infoAdicional->rango_exportaciones : '',
                    $infoAdicional ? $infoAdicional->planes_expansion : '',
                    $infoAdicional ? $infoAdicional->razon_licenciamiento_es : '',
                    $infoAdicional ? $infoAdicional->razon_licenciamiento_en : '',
                    $infoAdicional ? $infoAdicional->proceso_licenciamiento : '',
                    $infoAdicional ? ($infoAdicional->recomienda_marca_pais ? 'Sí' : 'No') : '',
                    $infoAdicional ? $infoAdicional->observaciones : '',
                    $infoAdicional ? $infoAdicional->mercadeo_nombre : '',
                    $infoAdicional ? $infoAdicional->mercadeo_email : '',
                    $infoAdicional ? $infoAdicional->mercadeo_puesto : '',
                    $infoAdicional ? $infoAdicional->mercadeo_telefono : '',
                    $infoAdicional ? $infoAdicional->mercadeo_celular : '',
                    $infoAdicional ? $infoAdicional->micrositio_nombre : '',
                    $infoAdicional ? $infoAdicional->micrositio_email : '',
                    $infoAdicional ? $infoAdicional->micrositio_puesto : '',
                    $infoAdicional ? $infoAdicional->micrositio_telefono : '',
                    $infoAdicional ? $infoAdicional->micrositio_celular : '',
                    $infoAdicional ? $infoAdicional->vocero_nombre : '',
                    $infoAdicional ? $infoAdicional->vocero_email : '',
                    $infoAdicional ? $infoAdicional->vocero_puesto : '',
                    $infoAdicional ? $infoAdicional->vocero_telefono : '',
                    $infoAdicional ? $infoAdicional->vocero_celular : '',
                    $infoAdicional ? $infoAdicional->representante_nombre : '',
                    $infoAdicional ? $infoAdicional->representante_email : '',
                    $infoAdicional ? $infoAdicional->representante_puesto : '',
                    $infoAdicional ? $infoAdicional->representante_telefono : '',
                    $infoAdicional ? $infoAdicional->representante_celular : '',
                    $estadoEval,
                    $company->created_at->format('d/m/Y'),
                    $company->updated_at->format('d/m/Y'),
                ];
                
                // Aplicar datos
                foreach ($data as $index => $value) {
                    $columnLetter = $this->getColumnLetter($index);
                    $sheet->setCellValue($columnLetter . '2', $value);
                }
                
                // Aplicar formato a las columnas
                // Obtener la última columna
                $lastColumn = $this->getColumnLetter(count($headers) - 1);
                
                // Aplicar estilos a la cabecera
                $sheet->getStyle('A1:' . $lastColumn . '1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '2C3E50'], // Color azul oscuro
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    ],
                ]);
                
                // Altura de la fila de cabecera
                $sheet->getRowDimension(1)->setRowHeight(30);
                
                // Aplicar bordes a todas las celdas
                $borderStyle = [
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => ['rgb' => '000000'],
                        ],
                        'outline' => [
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                            'color' => ['rgb' => '000000'],
                        ],
                    ],
                ];
                
                // Aplicar bordes a todas las celdas con datos
                $sheet->getStyle('A1:' . $lastColumn . '2')->applyFromArray($borderStyle);
                
                // Aplicar alineación a todas las celdas de datos
                $sheet->getStyle('A2:' . $lastColumn . '2')->applyFromArray([
                    'alignment' => [
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);
                
                // Aplicar color de fondo a las filas de datos (fila 2)
                $sheet->getStyle('A2:' . $lastColumn . '2')->applyFromArray([
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F5F5F5'], // Gris claro
                    ],
                ]);
                
                // Ajustar el ancho de las columnas automáticamente
                foreach (range('A', $lastColumn) as $column) {
                    $sheet->getColumnDimension($column)->setAutoSize(true);
                }
                
                // Guardar el archivo Excel
                $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
                $writer->save($excelPath);
                
                Log::info('Excel generado correctamente de forma manual');
            } catch (\Exception $e) {
                Log::error('Error al generar Excel manualmente: ' . $e->getMessage());
                Log::error('Stack trace: ' . $e->getTraceAsString());
                return redirect()->back()->with('error', 'Error al generar Excel: ' . $e->getMessage());
            }
            
            // Verificar que el archivo Excel se haya creado correctamente
            if (!File::exists($excelPath)) {
                Log::error('No se pudo generar el archivo Excel: ' . $excelPath);
                return redirect()->back()->with('error', 'No se pudo generar el archivo Excel.');
            }
            
            Log::info('Archivo Excel generado correctamente');
            
            // Crear archivo ZIP
            Log::info('Creando archivo ZIP en: ' . $zipPath);
            
            $zip = new ZipArchive();
            
            $openResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
            if ($openResult === TRUE) {
                Log::info('Archivo ZIP creado correctamente');
                
                // Verificar y agregar el PDF de autoevaluación si existe
                $autoEvalPdfFound = false;
                if ($company->autoeval_ended) {
                    $autoEvalPath = "autoevaluations/{$company->id}-{$companySlug}";
                    
                    if (Storage::disk('public')->exists($autoEvalPath)) {
                        $autoEvalFiles = Storage::disk('public')->files($autoEvalPath);
                        
                        if (!empty($autoEvalFiles)) {
                            // Ordenar archivos por fecha de modificación (más reciente primero)
                            usort($autoEvalFiles, function($a, $b) {
                                return Storage::disk('public')->lastModified($b) - Storage::disk('public')->lastModified($a);
                            });
                            
                            $latestAutoEvalPdf = $autoEvalFiles[0];
                            
                            try {
                                $pdfContent = Storage::disk('public')->get($latestAutoEvalPdf);
                                $pdfFileName = "autoevaluacion_{$company->id}_{$companySlug}.pdf";
                                $zip->addFromString($pdfFileName, $pdfContent);
                                Log::info('PDF de autoevaluación agregado al ZIP: ' . $pdfFileName);
                                $autoEvalPdfFound = true;
                            } catch (\Exception $e) {
                                Log::error('Error al agregar PDF de autoevaluación al ZIP: ' . $e->getMessage());
                                // Continuar con la ejecución aunque no se pueda agregar este archivo
                            }
                        } else {
                            Log::warning('No se encontraron archivos PDF de autoevaluación en la carpeta: ' . $autoEvalPath);
                        }
                    } else {
                        Log::warning('No existe la carpeta de autoevaluaciones: ' . $autoEvalPath);
                    }
                }
                
                // Verificar y agregar el PDF de evaluación si existe
                $evalPdfFound = false;
                if ($company->eval_ended || $company->estado_eval === 'evaluacion-completada' || $company->estado_eval === 'evaluado') {
                    $evalPath = "evaluations/{$company->id}-{$companySlug}";
                    
                    if (Storage::disk('public')->exists($evalPath)) {
                        $evalFiles = Storage::disk('public')->files($evalPath);
                        
                        if (!empty($evalFiles)) {
                            // Ordenar archivos por fecha de modificación (más reciente primero)
                            usort($evalFiles, function($a, $b) {
                                return Storage::disk('public')->lastModified($b) - Storage::disk('public')->lastModified($a);
                            });
                            
                            $latestEvalPdf = $evalFiles[0];
                            
                            try {
                                $pdfContent = Storage::disk('public')->get($latestEvalPdf);
                                $pdfFileName = "evaluacion_{$company->id}_{$companySlug}.pdf";
                                $zip->addFromString($pdfFileName, $pdfContent);
                                Log::info('PDF de evaluación agregado al ZIP: ' . $pdfFileName);
                                $evalPdfFound = true;
                            } catch (\Exception $e) {
                                Log::error('Error al agregar PDF de evaluación al ZIP: ' . $e->getMessage());
                                // Continuar con la ejecución aunque no se pueda agregar este archivo
                            }
                        } else {
                            Log::warning('No se encontraron archivos PDF de evaluación en la carpeta: ' . $evalPath);
                        }
                    } else {
                        Log::warning('No existe la carpeta de evaluaciones: ' . $evalPath);
                    }
                }
                
                // Agregar el Excel al ZIP
                try {
                    $excelContent = File::get($excelPath);
                    $zip->addFromString($excelFileName, $excelContent);
                    Log::info('Excel agregado al ZIP: ' . $excelFileName);
                } catch (\Exception $e) {
                    Log::error('Error al agregar Excel al ZIP: ' . $e->getMessage());
                    return redirect()->back()->with('error', 'Error al agregar Excel al ZIP: ' . $e->getMessage());
                }
                
                $zip->close();
                Log::info('Archivo ZIP cerrado correctamente');
                
                // Verificar que el archivo ZIP exista
                if (!File::exists($zipPath)) {
                    Log::error('El archivo ZIP no existe después de crearlo: ' . $zipPath);
                    return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP.');
                }
                
                // Registrar qué archivos se incluyeron en el ZIP
                $includedFiles = ['Excel de información de la empresa'];
                if ($autoEvalPdfFound) $includedFiles[] = 'PDF de autoevaluación';
                if ($evalPdfFound) $includedFiles[] = 'PDF de evaluación';
                Log::info('Archivos incluidos en el ZIP: ' . implode(', ', $includedFiles));
                
                Log::info('Descargando archivo ZIP: ' . $zipPath);
                
                // Forzar la descarga del archivo
                $headers = [
                    'Content-Type' => 'application/zip',
                    'Content-Disposition' => 'attachment; filename="' . $zipFileName . '"',
                    'Content-Length' => filesize($zipPath),
                    'Cache-Control' => 'no-cache, no-store, must-revalidate',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ];
                
                Log::info('Enviando respuesta de descarga con headers: ' . json_encode($headers));
                
                // Usar BinaryFileResponse para asegurarnos de que el archivo se descargue correctamente
                return new BinaryFileResponse($zipPath, 200, $headers, true, null, true, true);
            } else {
                Log::error('No se pudo crear el archivo ZIP. Código de error: ' . $openResult);
                return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP. Código de error: ' . $openResult);
            }
        } catch (\Exception $e) {
            Log::error('Error en downloadCompanyDocumentation: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Error al descargar la documentación: ' . $e->getMessage());
        }
    }

    /**
     * Descarga el PDF de evaluación más reciente de una empresa
     * 
     * @param int|null $companyId ID de la empresa (opcional, si no se proporciona se usa la empresa del usuario autenticado)
     * @return \Illuminate\Http\Response
     */
    public function downloadEvaluationPDF($companyId = null)
    {
        try {
            Log::info('Iniciando descarga de PDF de evaluación');
            
            // Obtener el usuario autenticado
            $user = Auth::user();
            
            // Si no se proporciona un ID de empresa, usar la del usuario autenticado
            if (!$companyId) {
                if (!$user || !$user->company_id) {
                    Log::error('Usuario no autenticado o sin empresa asignada');
                    return redirect()->back()->with('error', 'No se encontró información de la empresa.');
                }
                $companyId = $user->company_id;
            }
            
            // Verificar si el usuario tiene permisos para acceder a esta empresa
            if ($user->role !== 'super_admin' && $user->role !== 'evaluador' && $user->company_id != $companyId) {
                Log::error('Usuario sin permisos para acceder a la empresa: ' . $companyId);
                return redirect()->back()->with('error', 'No tiene permisos para acceder a esta información.');
            }
            
            Log::info('Buscando empresa con ID: ' . $companyId);
            
            $company = Company::find($companyId);
            
            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $companyId);
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }
            
            Log::info('Empresa encontrada: ' . $company->name);
            
            // Verificar si la empresa ha completado la evaluación
            if (!$company->eval_ended && $company->estado_eval !== 'evaluacion-completada' && $company->estado_eval !== 'evaluado') {
                Log::warning('La empresa no ha completado la evaluación');
                return redirect()->back()->with('error', 'La empresa aún no ha completado la evaluación.');
            }
            
            // Ruta de la carpeta de evaluaciones de la empresa
            $companySlug = Str::slug($company->name);
            $evalPath = "evaluations/{$company->id}-{$companySlug}";
            
            Log::info('Ruta de la carpeta de evaluaciones: ' . $evalPath);
            
            // Verificar si existe la carpeta
            if (!Storage::disk('public')->exists($evalPath)) {
                Log::error('No existe la carpeta de evaluaciones: ' . $evalPath);
                return redirect()->back()->with('error', 'No se encontraron documentos de evaluación.');
            }
            
            // Obtener el archivo PDF más reciente
            $pdfFiles = Storage::disk('public')->files($evalPath);
            
            if (empty($pdfFiles)) {
                Log::error('No se encontraron archivos PDF en la carpeta: ' . $evalPath);
                return redirect()->back()->with('error', 'No se encontraron documentos de evaluación.');
            }
            
            Log::info('Archivos PDF encontrados: ' . implode(', ', $pdfFiles));
            
            // Ordenar archivos por fecha de modificación (más reciente primero)
            usort($pdfFiles, function($a, $b) {
                return Storage::disk('public')->lastModified($b) - Storage::disk('public')->lastModified($a);
            });
            
            $latestPdf = $pdfFiles[0];
            Log::info('PDF más reciente: ' . $latestPdf);
            
            // Nombre del archivo para la descarga
            $downloadFileName = "evaluacion_{$company->id}_{$companySlug}.pdf";
            
            // Obtener la ruta completa del archivo
            $fullPath = Storage::disk('public')->path($latestPdf);
            
            // Descargar el archivo
            return response()->download($fullPath, $downloadFileName, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $downloadFileName . '"'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en downloadEvaluationPDF: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Error al descargar el PDF de evaluación: ' . $e->getMessage());
        }
    }

    /**
     * Convierte un índice numérico a letra de columna de Excel
     * 
     * @param int $index Índice numérico (0 para A, 1 para B, etc.)
     * @return string Letra de columna
     */
    private function getColumnLetter($index)
    {
        // Para índices menores a 26, simplemente convertimos a A-Z
        if ($index < 26) {
            return chr(65 + $index);
        }
        
        // Para índices mayores o iguales a 26, necesitamos usar múltiples letras (AA, AB, etc.)
        $dividend = $index + 1;
        $columnName = '';
        
        while ($dividend > 0) {
            $modulo = ($dividend - 1) % 26;
            $columnName = chr(65 + $modulo) . $columnName;
            $dividend = (int)(($dividend - $modulo) / 26);
        }
        
        return $columnName;
    }
} 