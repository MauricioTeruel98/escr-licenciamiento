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
use App\Models\CompanyProducts;
use App\Models\EvaluationValueResult;
use App\Models\EvaluatorAssessment;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\IndicatorAnswer;
use App\Models\Indicator;

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
                    'Dirección de Empresa',
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
                    'Producto o servicio',
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
                    'Contacto Representante - Cedula',
                    'Contacto Representante - Puesto',
                    'Contacto Representante - Teléfono',
                    'Contacto Representante - Celular',
                    'Contacto Notificación - Nombre',
                    'Contacto Notificación - Email',
                    'Contacto Notificación - Puesto',
                    'Contacto Notificación - Teléfono',
                    'Contacto Notificación - Celular',
                    'Asignado Proceso - Nombre',
                    'Asignado Proceso - Email',
                    'Asignado Proceso - Puesto',
                    'Asignado Proceso - Teléfono',
                    'Asignado Proceso - Celular',
                    'Estado de Evaluación',
                    'Fecha de Registro',
                    'Última Actualización',
                    'Logo Path',
                    'Fotografías',
                    'Certificaciones',
                    'Puntos Fuertes',
                    'Justificación',
                    'Oportunidades',
                    'Fecha Inicio Auto-evaluación',
                    'Fecha Calificación Evaluador',
                ];
                
                // Aplicar encabezados
                foreach ($headers as $index => $header) {
                    $columnLetter = $this->getColumnLetter($index);
                    $sheet->setCellValue($columnLetter . '1', $header);
                }
                
                // Reemplazar el ajuste automático de columnas con un ajuste más preciso
                // Para la hoja principal
                foreach ($headers as $index => $header) {
                    $columnLetter = $this->getColumnLetter($index);
                    $sheet->getColumnDimension($columnLetter)->setWidth(
                        max(
                            strlen($header) * 1.5, // Ancho basado en la longitud del encabezado
                            20 // Ancho mínimo
                        )
                    );
                }
                
                // Datos de la empresa actualizados
                $infoAdicional = $company->infoAdicional;
                
                // Obtener el estado formateado
                $estadoEval = '';
                switch ($company->estado_eval) {
                    case 'auto-evaluacion':
                        $estadoEval = 'Autoevaluación';
                        break;
                    case 'auto-evaluacion-completed':
                        $estadoEval = 'Autoevaluación Completada';
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
                    $infoAdicional ? $infoAdicional->direccion_empresa : '',
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
                    $infoAdicional ? $infoAdicional->producto_servicio : '',
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
                    $infoAdicional ? $infoAdicional->representante_cedula : '',
                    $infoAdicional ? $infoAdicional->representante_puesto : '',
                    $infoAdicional ? $infoAdicional->representante_telefono : '',
                    $infoAdicional ? $infoAdicional->representante_celular : '',
                    $infoAdicional ? $infoAdicional->contacto_notificacion_nombre : '',
                    $infoAdicional ? $infoAdicional->contacto_notificacion_email : '',
                    $infoAdicional ? $infoAdicional->contacto_notificacion_puesto : '',
                    $infoAdicional ? $infoAdicional->contacto_notificacion_telefono : '',
                    $infoAdicional ? $infoAdicional->contacto_notificacion_celular : '',
                    $infoAdicional ? $infoAdicional->asignado_proceso_nombre : '',
                    $infoAdicional ? $infoAdicional->asignado_proceso_email : '',
                    $infoAdicional ? $infoAdicional->asignado_proceso_puesto : '',
                    $infoAdicional ? $infoAdicional->asignado_proceso_telefono : '',
                    $infoAdicional ? $infoAdicional->asignado_proceso_celular : '',
                    $estadoEval,
                    $company->created_at->format('d/m/Y'),
                    $company->updated_at->format('d/m/Y'),
                    $infoAdicional ? $infoAdicional->logo_path : '',
                    $infoAdicional ? $this->formatPaths($infoAdicional->fotografias_paths) : '',
                    $infoAdicional ? $this->formatPaths($infoAdicional->certificaciones_paths) : '',
                    $infoAdicional ? $infoAdicional->puntos_fuertes : '',
                    $infoAdicional ? $infoAdicional->justificacion : '',
                    $infoAdicional ? $infoAdicional->oportunidades : '',
                    $company->fecha_inicio_auto_evaluacion ? $company->fecha_inicio_auto_evaluacion->format('d/m/Y') : '',
                    $company->fecha_calificacion_evaluador ? $company->fecha_calificacion_evaluador->format('d/m/Y') : '',
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
                
                // Crear una nueva hoja para los productos
                $productsSheet = $spreadsheet->createSheet();
                $productsSheet->setTitle('Productos');
                
                // Encabezados para la hoja de productos
                $productHeaders = [
                    'ID',
                    'Nombre',
                    'Descripción',
                    'Imagen Principal',
                    'Imagen Adicional',
                    'Imagen Adicional',
                ];
                
                // Aplicar encabezados de productos
                foreach ($productHeaders as $index => $header) {
                    $columnLetter = $this->getColumnLetter($index);
                    $productsSheet->setCellValue($columnLetter . '1', $header);
                }
                
                // Reemplazar el ajuste automático de columnas con un ajuste más preciso
                // Para la hoja de productos
                foreach ($productHeaders as $index => $header) {
                    $columnLetter = $this->getColumnLetter($index);
                    $productsSheet->getColumnDimension($columnLetter)->setWidth(
                        max(
                            strlen($header) * 1.5, // Ancho basado en la longitud del encabezado
                            20 // Ancho mínimo
                        )
                    );
                }
                
                // Obtener los productos de la empresa
                $products = CompanyProducts::where('company_id', $company->id)->get();
                
                // Agregar datos de productos
                $row = 2;
                foreach ($products as $product) {
                    $productData = [
                        $product->id,
                        $product->nombre,
                        $product->descripcion,
                        $product->imagen,
                        $product->imagen_2,
                        $product->imagen_3,
                    ];
                    
                    foreach ($productData as $index => $value) {
                        $columnLetter = $this->getColumnLetter($index);
                        $productsSheet->setCellValue($columnLetter . $row, $value);
                    }
                    $row++;
                }
                
                // Aplicar estilos a la hoja de productos
                $lastProductColumn = $this->getColumnLetter(count($productHeaders) - 1);
                $lastProductRow = $products->count() + 1;
                
                // Estilo para encabezados de productos
                $productsSheet->getStyle('A1:' . $lastProductColumn . '1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '2C3E50'],
                    ],
                    'alignment' => [
                        'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                        'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    ],
                ]);
                
                // Altura de la fila de encabezado de productos
                $productsSheet->getRowDimension(1)->setRowHeight(30);
                
                // Aplicar bordes a todas las celdas con datos de productos
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
                
                $productsSheet->getStyle('A1:' . $lastProductColumn . $lastProductRow)->applyFromArray($borderStyle);
                
                // Ajustar el ancho de las columnas automáticamente
                foreach (range('A', $lastProductColumn) as $column) {
                    $productsSheet->getColumnDimension($column)->setAutoSize(true);
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
                if ($company->autoeval_ended && $company->auto_evaluation_document_path) {
                    try {
                        if (Storage::disk('public')->exists($company->auto_evaluation_document_path)) {
                            $pdfContent = Storage::disk('public')->get($company->auto_evaluation_document_path);
                            $pdfFileName = "autoevaluacion_{$company->id}_{$companySlug}.pdf";
                            $zip->addFromString($pdfFileName, $pdfContent);
                            Log::info('PDF de autoevaluación agregado al ZIP: ' . $pdfFileName);
                            $autoEvalPdfFound = true;
                        } else {
                            Log::warning('No se encontró el archivo de autoevaluación: ' . $company->auto_evaluation_document_path);
                        }
                    } catch (\Exception $e) {
                        Log::error('Error al agregar PDF de autoevaluación al ZIP: ' . $e->getMessage());
                        // Continuar con la ejecución aunque no se pueda agregar este archivo
                    }
                }
                
                // Verificar y agregar el PDF de evaluación si existe
                $evalPdfFound = false;
                if (($company->eval_ended || $company->estado_eval === 'evaluacion-completada' || $company->estado_eval === 'evaluado') 
                    && $company->evaluation_document_path) {
                    try {
                        if (Storage::disk('public')->exists($company->evaluation_document_path)) {
                            $pdfContent = Storage::disk('public')->get($company->evaluation_document_path);
                            $pdfFileName = "evaluacion_{$company->id}_{$companySlug}.pdf";
                            $zip->addFromString($pdfFileName, $pdfContent);
                            Log::info('PDF de evaluación agregado al ZIP: ' . $pdfFileName);
                            $evalPdfFound = true;
                        } else {
                            Log::warning('No se encontró el archivo de evaluación: ' . $company->evaluation_document_path);
                        }
                    } catch (\Exception $e) {
                        Log::error('Error al agregar PDF de evaluación al ZIP: ' . $e->getMessage());
                    }
                }
                
                // Si no se encontró un PDF de evaluación, generar uno en modo borrador
                if (!$evalPdfFound) {
                    try {
                        Log::info('Generando PDF de evaluación en modo borrador');
                        
                        // Obtener datos necesarios para generar el PDF
                        $allValues = Value::where('is_active', true)
                            ->where('deleted', false)
                            ->where(function ($query) use ($company) {
                                $query->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            })
                            ->get();

                        $finalScores = EvaluationValueResult::where('company_id', $company->id)
                            ->get()
                            ->keyBy('value_id');

                        $evaluatorAssessments = EvaluatorAssessment::where('company_id', $company->id)
                            ->with(['evaluationQuestion', 'indicator'])
                            ->get()
                            ->groupBy('indicator_id');

                        $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $company->id)
                            ->with(['evaluationQuestion', 'indicator'])
                            ->get()
                            ->groupBy('indicator_id');

                        $autoEvaluationAnswers = IndicatorAnswer::where('company_id', $company->id)
                            ->with(['indicator'])
                            ->get()
                            ->groupBy('indicator_id');

                        $indicatorsByValue = Indicator::where('is_active', true)
                            ->with(['subcategory.value', 'evaluationQuestions'])
                            ->where('deleted', false)
                            ->where(function ($query) use ($company) {
                                $query->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            })
                            ->get()
                            ->groupBy('subcategory.value.id');

                        // Generar PDF
                        $pdf = Pdf::loadView('pdf/evaluation', [
                            'values' => $allValues,
                            'company' => $company,
                            'evaluador' => $user,
                            'date' => now()->format('d/m/Y'),
                            'finalScores' => $finalScores,
                            'evaluatorAssessments' => $evaluatorAssessments,
                            'companyAnswers' => $companyAnswers,
                            'autoEvaluationAnswers' => $autoEvaluationAnswers,
                            'indicatorsByValue' => $indicatorsByValue
                        ]);

                        // Crear carpetas si no existen
                        $evalPath = "companies/{$company->id}/evaluations";
                        Storage::disk('public')->makeDirectory($evalPath);

                        // Generar nombre de archivo con timestamp y marca de borrador
                        $fileName = "evaluation_{$company->id}_{$companySlug}_draft_" . date('Y-m-d_His') . '.pdf';
                        $fullPath = storage_path("app/public/{$evalPath}/{$fileName}");

                        // Guardar PDF
                        $pdf->save($fullPath);

                        // Actualizar la ruta del documento en la empresa
                        $company->evaluation_document_path = "{$evalPath}/{$fileName}";
                        $company->save();

                        // Agregar el PDF borrador al ZIP
                        $pdfContent = file_get_contents($fullPath);
                        $pdfFileName = "evaluacion_{$company->id}_{$companySlug}_borrador.pdf";
                        $zip->addFromString($pdfFileName, $pdfContent);
                        Log::info('PDF de evaluación borrador agregado al ZIP: ' . $pdfFileName);
                        $evalPdfFound = true;

                    } catch (\Exception $e) {
                        Log::error('Error al generar y agregar PDF de evaluación borrador al ZIP: ' . $e->getMessage());
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

                // Agregar la carpeta de archivos de la empresa
                try {
                    $companyFolderPath = "companies/{$company->id}";
                    if (Storage::disk('public')->exists($companyFolderPath)) {
                        // Obtener todos los archivos y subcarpetas
                        $files = Storage::disk('public')->allFiles($companyFolderPath);
                        
                        foreach ($files as $file) {
                            if (Storage::disk('public')->exists($file)) {
                                $fileContent = Storage::disk('public')->get($file);
                                // Reorganizar la estructura de carpetas dentro del ZIP
                                $newPath = str_replace($companyFolderPath, 'archivos', $file);
                                $zip->addFromString($newPath, $fileContent);
                                Log::info('Archivo agregado al ZIP: ' . $newPath);
                            }
                        }
                        Log::info('Carpeta de archivos agregada al ZIP');
                    } else {
                        Log::warning('No se encontró la carpeta de la empresa: ' . $companyFolderPath);
                    }
                } catch (\Exception $e) {
                    Log::error('Error al agregar carpeta de archivos al ZIP: ' . $e->getMessage());
                    // Continuar con la ejecución aunque no se pueda agregar la carpeta
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
            
            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);
            
            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $companyId);
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }
            
            Log::info('Empresa encontrada: ' . $company->name);
            
            // Ruta de la carpeta de evaluaciones de la empresa
            $companySlug = Str::slug($company->name);
            $evalPath = "companies/{$company->id}/evaluations";
            
            // Verificar si existe algún PDF de evaluación
            $pdfExists = Storage::disk('public')->exists($company->evaluation_document_path);
            
            if (!$pdfExists) {
                Log::info('No se encontró PDF existente, generando uno nuevo como borrador');
                
                // Obtener datos necesarios para generar el PDF
                $allValues = Value::where('is_active', true)
                    ->where('deleted', false)
                    ->where(function ($query) use ($company) {
                        $query->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->get();

                $finalScores = EvaluationValueResult::where('company_id', $companyId)
                    ->get()
                    ->keyBy('value_id');

                $evaluatorAssessments = EvaluatorAssessment::where('company_id', $companyId)
                    ->with(['evaluationQuestion', 'indicator'])
                    ->get()
                    ->groupBy('indicator_id');

                $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $companyId)
                    ->with(['evaluationQuestion', 'indicator'])
                    ->get()
                    ->groupBy('indicator_id');

                $autoEvaluationAnswers = IndicatorAnswer::where('company_id', $companyId)
                    ->with(['indicator'])
                    ->get()
                    ->groupBy('indicator_id');

                $indicatorsByValue = Indicator::where('is_active', true)
                    ->with(['subcategory.value', 'evaluationQuestions'])
                    ->where('deleted', false)
                    ->where(function ($query) use ($company) {
                        $query->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->get()
                    ->groupBy('subcategory.value.id');

                // Generar PDF
                $pdf = Pdf::loadView('pdf/evaluation', [
                    'values' => $allValues,
                    'company' => $company,
                    'evaluador' => $user,
                    'date' => now()->format('d/m/Y'),
                    'finalScores' => $finalScores,
                    'evaluatorAssessments' => $evaluatorAssessments,
                    'companyAnswers' => $companyAnswers,
                    'autoEvaluationAnswers' => $autoEvaluationAnswers,
                    'indicatorsByValue' => $indicatorsByValue
                ]);

                // Crear carpetas si no existen
                Storage::disk('public')->makeDirectory($evalPath);

                // Generar nombre de archivo con timestamp y marca de borrador
                $fileName = "evaluation_{$company->id}_{$companySlug}_draft_" . date('Y-m-d_His') . '.pdf';
                $fullPath = storage_path("app/public/{$evalPath}/{$fileName}");

                // Guardar PDF
                $pdf->save($fullPath);

                // Actualizar la ruta del documento en la empresa
                $company->evaluation_document_path = "{$evalPath}/{$fileName}";
                $company->save();

                Log::info('PDF borrador generado exitosamente: ' . $fileName);
            }

            // Nombre del archivo para la descarga
            $downloadFileName = "evaluacion_{$company->id}_{$companySlug}.pdf";
            
            // Obtener la ruta completa del archivo
            $fullPath = storage_path('app/public/' . $company->evaluation_document_path);
            
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

    public function regenerateEvaluationPDF($companyId)
    {
        try {
            $user = Auth::user();
            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);

            if (!$company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empresa no encontrada'
                ], 404);
            }

            // Obtener todos los valores
            $allValues = Value::where('is_active', true)
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get();

            // Obtener las puntuaciones finales
            $finalScores = EvaluationValueResult::where('company_id', $companyId)
                ->get()
                ->keyBy('value_id');

            // Obtener todas las evaluaciones del evaluador para esta empresa
            $evaluatorAssessments = EvaluatorAssessment::where('company_id', $companyId)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de la empresa
            $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $companyId)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de autoevaluación
            $autoEvaluationAnswers = \App\Models\IndicatorAnswer::where('company_id', $companyId)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener los IDs de los indicadores donde la empresa respondió "sí"
            $indicatorIds = IndicatorAnswer::where('company_id', $companyId)
                ->where(function ($query) {
                    $query->whereIn('answer', ['1', 'si', 'sí', 'yes', 1, true]);
                })
                ->pluck('indicator_id');

            // Agrupar indicadores por valor
            $indicatorsByValue = Indicator::where('is_active', true)
                ->whereIn('id', $indicatorIds)
                ->with(['subcategory.value', 'evaluationQuestions'])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            // Generar PDF con los resultados
            $pdf = Pdf::loadView('pdf/evaluation', [
                'values' => $allValues,
                'company' => $company,
                'evaluador' => $user,
                'date' => now()->format('d/m/Y'),
                'finalScores' => $finalScores,
                'evaluatorAssessments' => $evaluatorAssessments,
                'companyAnswers' => $companyAnswers,
                'autoEvaluationAnswers' => $autoEvaluationAnswers,
                'indicatorsByValue' => $indicatorsByValue
            ]);

            // Crear estructura de carpetas para la empresa
            $companySlug = Str::slug($company->name);
            $basePath = storage_path('app/public/companies');
            $companyPath = "{$basePath}/{$company->id}/evaluations";

            // Crear carpetas si no existen
            if (!file_exists($basePath)) {
                mkdir($basePath, 0755, true);
            }
            if (!file_exists($companyPath)) {
                mkdir($companyPath, 0755, true);
            }

            // Generar nombre de archivo con timestamp
            $fileName = "evaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
            $fullPath = "{$companyPath}/{$fileName}";

            // Guardar PDF
            $pdf->save($fullPath);

            // Actualizar el path del documento en la empresa
            $evaluationPath = "companies/{$company->id}/evaluations/{$fileName}";
            $company->evaluation_document_path = $evaluationPath;
            $company->save();

            return response()->json([
                'success' => true,
                'message' => 'PDF regenerado exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al regenerar PDF de evaluación:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al regenerar el PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    private function formatPaths($paths) {
        if (empty($paths)) {
            return '';
        }

        // Si es un string JSON, convertirlo a array
        if (is_string($paths)) {
            $paths = json_decode($paths, true);
        }

        // Si después de la decodificación sigue siendo string o es null, retornar el valor original
        if (!is_array($paths)) {
            return $paths ?? '';
        }

        // Filtrar valores vacíos y unir con comas
        return implode(', ', array_filter($paths));
    }
} 