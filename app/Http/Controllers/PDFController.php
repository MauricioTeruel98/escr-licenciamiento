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

    public function downloadCompanyDocumentation()
    {
        try {
            Log::info('Iniciando descarga de documentación');
            
            // Obtener el usuario autenticado y su empresa
            $user = Auth::user();
            
            if (!$user || !$user->company_id) {
                Log::error('Usuario no autenticado o sin empresa asignada');
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            Log::info('Usuario autenticado: ' . $user->id . ', Empresa: ' . $user->company_id);

            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);
            
            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $user->company_id);
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
                
                // Encabezados
                $headers = [
                    'ID', 'Nombre', 'Nombre Comercial', 'Nombre Legal', 'Email', 'Teléfono',
                    'Dirección', 'Ciudad', 'Estado', 'País', 'Código Postal', 'Sitio Web',
                    'Descripción (ES)', 'Descripción (EN)', 'Año de Fundación', 'Facebook',
                    'LinkedIn', 'Instagram', 'Fecha de Registro', 'Última Actualización'
                ];
                
                foreach ($headers as $index => $header) {
                    $sheet->setCellValue(chr(65 + $index) . '1', $header);
                }
                
                // Datos de la empresa
                $infoAdicional = $company->infoAdicional;
                $data = [
                    $company->id,
                    $company->name,
                    $infoAdicional ? $infoAdicional->nombre_comercial : '',
                    $infoAdicional ? $infoAdicional->nombre_legal : '',
                    $company->email,
                    $company->phone,
                    $company->address,
                    $company->city,
                    $company->state,
                    $company->country,
                    $company->postal_code,
                    $infoAdicional ? $infoAdicional->sitio_web : '',
                    $infoAdicional ? $infoAdicional->descripcion_es : '',
                    $infoAdicional ? $infoAdicional->descripcion_en : '',
                    $infoAdicional ? $infoAdicional->anio_fundacion : '',
                    $infoAdicional ? $infoAdicional->facebook : '',
                    $infoAdicional ? $infoAdicional->linkedin : '',
                    $infoAdicional ? $infoAdicional->instagram : '',
                    $company->created_at->format('d/m/Y'),
                    $company->updated_at->format('d/m/Y')
                ];
                
                foreach ($data as $index => $value) {
                    $sheet->setCellValue(chr(65 + $index) . '2', $value);
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
} 