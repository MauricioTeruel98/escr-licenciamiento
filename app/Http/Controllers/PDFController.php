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
use setasign\Fpdi\Fpdi;
use Fpdf\Fpdf;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\Style\Font;
use PhpOffice\PhpWord\Style\Paragraph;
use PhpOffice\PhpWord\Element\Table;

class PDFController extends Controller
{

    public function downloadIndicatorsPDF()
    {
        $values = Value::with(['subcategories.indicators.requisito'])->where('deleted', false)->get();

        $pdf = Pdf::loadView('pdf.indicators', compact('values'));

        return $pdf->download('indicadores_licenciamiento.pdf');
    }

    public function downloadAnexoUnoPDF()
    {
        //Log::info('Iniciando descarga de Anexo 1 PDF');
        
        // Obtener la empresa del usuario autenticado
        $company = Auth::user()->company;
        //Log::info('Empresa obtenida:', ['company_id' => $company->id ?? 'null', 'company_name' => $company->name ?? 'null']);

        // Primero, generar y guardar el PDF limpio solo si no existe
        try {
            $values = Value::with(['subcategories.indicators.requisito'])->where('deleted', false)->get();
            //Log::info('Valores obtenidos:', ['count' => $values->count()]);

            // Para PDF limpio, cargar TODOS los indicadores activos (no solo los respondidos)
            $indicatorsByValue = Indicator::where('is_active', true)
                ->with([
                    'subcategory' => function ($query) {
                        $query->orderBy('order', 'desc');
                    },
                    'subcategory.value',
                    'evaluationQuestions' => function ($query) {
                        $query->where('deleted', false)
                            ->orderBy('id');
                    },
                    'requisito'
                ])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            //Log::info('Indicadores por valor obtenidos:', ['count' => $indicatorsByValue->count()]);

            // Obtener las respuestas de autoevaluación (opcional para mostrar si existen)
            $autoEvaluationAnswers = IndicatorAnswer::where('company_id', $company->id)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            //Log::info('Respuestas de autoevaluación obtenidas:', ['count' => $autoEvaluationAnswers->count()]);

            // Crear estructura de carpetas para la empresa
            $companySlug = Str::slug($company->name);
            $evalPath = "companies/{$company->id}/evaluations/clean";
            Storage::disk('public')->makeDirectory($evalPath);
            //Log::info('Estructura de carpetas creada:', ['path' => $evalPath]);

            // Verificar si ya existe el PDF limpio
            $shouldGeneratePDF = true;
            if ($company->evaluation_clean_document_path && 
                Storage::disk('public')->exists($company->evaluation_clean_document_path)) {
                //Log::info('PDF limpio ya existe, no se regenerará:', ['path' => $company->evaluation_clean_document_path]);
                $shouldGeneratePDF = false;
            }

            // Generar PDF limpio solo si no existe
            if ($shouldGeneratePDF) {
                //Log::info('Generando nuevo PDF limpio');
                // Eliminar el archivo anterior si existe pero está roto
                if ($company->evaluation_clean_document_path && 
                    !Storage::disk('public')->exists($company->evaluation_clean_document_path)) {
                    //Log::info('PDF anterior no encontrado, se regenerará:', ['path' => $company->evaluation_clean_document_path]);
                }

                $pdfLimpio = Pdf::loadView('pdf/evaluation-clean', compact('values', 'indicatorsByValue', 'autoEvaluationAnswers'));

                // Generar nombre de archivo con acento
                $cleanFileName = "Formulario de solicitud de licencia e informe de evaluación.pdf";
                $cleanFilePath = "{$evalPath}/{$cleanFileName}";

                // Guardar PDF limpio usando Storage de Laravel
                $pdfContent = $pdfLimpio->output(); // Obtiene el contenido binario del PDF
                Storage::disk('public')->put($cleanFilePath, $pdfContent);

                // Actualizar la ruta del documento limpio en la empresa
                $company->evaluation_clean_document_path = $cleanFilePath;
                $company->save();

                //Log::info('PDF limpio generado y guardado exitosamente:', ['path' => $cleanFilePath]);
            }

            // Generar archivo Word con la misma información (solo si no existe)
            /**
             * 
             * 
             * Deshabilitada para evitar que se ejecute esta función, solo era para generar el documento Word limpio
             * @author: Mauricio Teruel
             * @date: 30/05/2025
             * 
             */
            //$this->generateCleanWordDocument($company, $values, $indicatorsByValue, $autoEvaluationAnswers, $evalPath, $companySlug);

        } catch (\Exception $e) {
            Log::error('Error al generar PDF limpio:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Error al generar el PDF limpio: ' . $e->getMessage());
        }

        // Crear nueva instancia de FPDI para el anexo 1
        //Log::info('Iniciando generación de Anexo 1');
        $pdf = new Fpdi();
        $pdf->SetTitle(iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Anexo 1 al Reglamento para el uso de la marca país esencial Costa Rica PRO-NOR-044'));

        // Establecer el archivo fuente
        $sourcePath = storage_path('app/public/pdfs/anexo_1.pdf');
        //Log::info('Ruta del archivo fuente:', ['path' => $sourcePath]);

        // Verificar si el archivo existe
        if (!file_exists($sourcePath)) {
            Log::error('Archivo PDF base no encontrado:', ['path' => $sourcePath]);
            return redirect()->back()->with('error', 'El archivo PDF base no existe.');
        }

        try {
            //Log::info('Iniciando procesamiento del PDF');
            $pageCount = $pdf->setSourceFile($sourcePath);
            //Log::info('Número de páginas en el PDF fuente:', ['pages' => $pageCount]);

            // Copiar todas las páginas
            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                //Log::info('Procesando página:', ['page' => $pageNo]);
                // Importar página
                $templateId = $pdf->importPage($pageNo);

                // Añadir página
                $pdf->AddPage();

                // Usar la página importada
                $pdf->useTemplate($templateId);

                // En la página 43, agregar el botón/enlace al PDF limpio
                if ($pageNo === 43 && $company && $company->evaluation_clean_document_path) {
                    //Log::info('Agregando enlace en página 43');
                    // Solo agregar el enlace si existe la ruta del documento limpio y el archivo existe
                    if (Storage::disk('public')->exists($company->evaluation_clean_document_path)) {
                        $pdf->SetFont('Helvetica', 'B', 12);
                        $pdf->SetTextColor(0, 0, 255); // Azul para indicar que es un enlace

                        // Posicionar el enlace (ajusta estas coordenadas según necesites)
                        $x = 60;
                        $y = 175;

                        // Codificar solo el nombre del archivo
                        $relativePath = $company->evaluation_clean_document_path;
                        $pathParts = explode('/', $relativePath);
                        $fileName = array_pop($pathParts);
                        $encodedFileName = rawurlencode($fileName);
                        $encodedPath = implode('/', $pathParts) . '/' . $encodedFileName;

                        $documentUrl = url('storage/' . $encodedPath);

                        $pdf->Link($x, $y, 150, 20, $documentUrl);

                        // Agregar el texto del enlace
                        $pdf->SetXY($x, $y);
                        $pdf->Cell(150, 20, '', 0, 0, 'L');
                        
                        //Log::info('Enlace agregado exitosamente:', ['url' => $documentUrl]);
                    } else {
                        Log::warning('No se pudo agregar el enlace porque el documento limpio no existe');
                    }
                }
            }

            //Log::info('PDF procesado exitosamente, preparando respuesta');

            // Generar el PDF y forzar la descarga
            $downloadFileName = 'Anexo 1 al Reglamento para el uso de la marca país esencial Costa Rica PRO-NOR-044.pdf';
            $fpdfFileName = mb_convert_encoding($downloadFileName, 'ISO-8859-1', 'UTF-8');
            $asciiFileName = iconv('UTF-8', 'ASCII//TRANSLIT', $downloadFileName);
            $utf8FileName = rawurlencode($downloadFileName);

            $response = response($pdf->Output('I', $fpdfFileName))
                ->header('Content-Type', 'application/pdf')
                ->header(
                    'Content-Disposition',
                    "inline; filename=\"{$asciiFileName}\"; filename*=UTF-8''{$utf8FileName}"
                );

            /*Log::info('Respuesta preparada con headers:', [
                'Content-Type' => $response->headers->get('Content-Type'),
                'Content-Disposition' => $response->headers->get('Content-Disposition')
            ]);*/

            return $response;

        } catch (\Exception $e) {
            Log::error('Error al procesar el PDF:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Error al procesar el PDF: ' . $e->getMessage());
        }
    }

    public function generarPDFLimpio(Request $request)
    {
        try {
            $values = Value::with(['subcategories.indicators.requisito'])->where('deleted', false)->get();

            $company = Auth::user()->company;

            // Para PDF limpio, cargar TODOS los indicadores activos (no solo los respondidos)
            $indicatorsByValue = Indicator::where('is_active', true)
                ->with([
                    'subcategory' => function ($query) {
                        $query->orderBy('order', 'desc');
                    },
                    'subcategory.value',
                    'evaluationQuestions' => function ($query) {
                        $query->where('deleted', false)
                            ->orderBy('id');
                    },
                    'requisito'
                ])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            // Obtener las respuestas de autoevaluación (opcional para mostrar si existen)
            $autoEvaluationAnswers = IndicatorAnswer::where('company_id', $company->id)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Generar PDF con la vista limpia
            $pdf = Pdf::loadView('pdf/evaluation-clean', compact('values', 'indicatorsByValue', 'autoEvaluationAnswers'));

            // Generar nombre de archivo con timestamp
            $fileName = "evaluacion_limpia_" . date('Y-m-d_His') . '.pdf';

            // Retornar el PDF para descarga
            return $pdf->download($fileName);
        } catch (\Exception $e) {
            Log::error('Error al generar PDF limpio: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al generar el PDF: ' . $e->getMessage());
        }
    }

    public function generarWordLimpio(Request $request)
    {
        try {
            $values = Value::with(['subcategories.indicators.requisito'])->where('deleted', false)->get();

            $company = Auth::user()->company;

            // Para documento Word limpio, cargar TODOS los indicadores activos (no solo los respondidos)
            $indicatorsByValue = Indicator::where('is_active', true)
                ->with([
                    'subcategory' => function ($query) {
                        $query->orderBy('order', 'desc');
                    },
                    'subcategory.value',
                    'evaluationQuestions' => function ($query) {
                        $query->where('deleted', false)
                            ->orderBy('id');
                    },
                    'requisito'
                ])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            // Obtener las respuestas de autoevaluación (opcional para mostrar si existen)
            $autoEvaluationAnswers = IndicatorAnswer::where('company_id', $company->id)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Crear documento Word
            $phpWord = new PhpWord();
            
            // Configurar estilos globales
            $phpWord->setDefaultFontName('Arial');
            $phpWord->setDefaultFontSize(11);
            
            // Definir estilos personalizados
            $phpWord->addTitleStyle(1, ['name' => 'Arial', 'size' => 18, 'bold' => true, 'color' => '157f3d']);
            $phpWord->addTitleStyle(2, ['name' => 'Arial', 'size' => 15, 'bold' => true, 'color' => '157f3d']);
            $phpWord->addTitleStyle(3, ['name' => 'Arial', 'size' => 13, 'bold' => true, 'color' => '157f3d']);
            
            // Crear sección principal
            $section = $phpWord->addSection([
                'marginTop' => Converter::inchToTwip(1),
                'marginBottom' => Converter::inchToTwip(1),
                'marginLeft' => Converter::inchToTwip(1),
                'marginRight' => Converter::inchToTwip(1),
            ]);

            // Agregar contenido al documento
            $this->addContentToWordDocument($section, $company, $values, $indicatorsByValue, $autoEvaluationAnswers);

            // Generar nombre de archivo con timestamp
            $fileName = "evaluacion_limpia_" . date('Y-m-d_His') . '.docx';

            // Crear archivo temporal
            $tempPath = storage_path('app/temp/' . $fileName);

            // Asegurarse de que el directorio temporal exista
            if (!File::exists(storage_path('app/temp'))) {
                File::makeDirectory(storage_path('app/temp'), 0755, true);
            }

            // Guardar el documento Word temporalmente
            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($tempPath);

            // Retornar el archivo para descarga y eliminarlo después
            return response()->download($tempPath, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"'
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Error al generar documento Word limpio: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al generar el documento Word: ' . $e->getMessage());
        }
    }

    public function downloadCompanyDocumentation(Request $request)
    {
        try {
            //Log::info('Iniciando descarga de documentación');

            // Obtener el usuario autenticado y su empresa
            $user = Auth::user();

            $companyId = null;

            if ($request->has('company_id')) {
                $companyId = $request->input('company_id');
            } else {
                $companyId = $user->company_id;
            }

            if (!$user || !$companyId) {
                Log::error('Usuario no autenticado o sin empresa asignada');
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            //Log::info('Usuario autenticado: ' . $user->id . ', Empresa: ' . $companyId);

            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);

            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $companyId);
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            //Log::info('Empresa encontrada: ' . $company->name);

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
            //Log::info('Generando archivo Excel manualmente en: ' . $excelPath);

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

                //Log::info('Excel generado correctamente de forma manual');
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

            //Log::info('Archivo Excel generado correctamente');

            // Crear archivo ZIP
            //Log::info('Creando archivo ZIP en: ' . $zipPath);

            $zip = new ZipArchive();

            $openResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
            if ($openResult === TRUE) {
                //Log::info('Archivo ZIP creado correctamente');

                // Verificar y agregar el PDF de autoevaluación si existe
                $autoEvalPdfFound = false;
                if ($company->autoeval_ended && $company->auto_evaluation_document_path) {
                    try {
                        if (Storage::disk('public')->exists($company->auto_evaluation_document_path)) {
                            $pdfContent = Storage::disk('public')->get($company->auto_evaluation_document_path);
                            $pdfFileName = "autoevaluacion_{$company->id}_{$companySlug}.pdf";
                            $zip->addFromString($pdfFileName, $pdfContent);
                            //Log::info('PDF de autoevaluación agregado al ZIP: ' . $pdfFileName);
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
                    && $company->evaluation_document_path
                ) {
                    try {
                        if (Storage::disk('public')->exists($company->evaluation_document_path)) {
                            $pdfContent = Storage::disk('public')->get($company->evaluation_document_path);
                            $pdfFileName = "evaluacion_{$company->id}_{$companySlug}.pdf";
                            $zip->addFromString($pdfFileName, $pdfContent);
                            //Log::info('PDF de evaluación agregado al ZIP: ' . $pdfFileName);
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
                        //Log::info('Generando PDF de evaluación en modo borrador');

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
                        //$company->evaluation_document_path = "{$evalPath}/{$fileName}";
                        //$company->save();

                        // Agregar el PDF borrador al ZIP
                        $pdfContent = file_get_contents($fullPath);
                        $pdfFileName = "evaluacion_{$company->id}_{$companySlug}_borrador.pdf";
                        $zip->addFromString($pdfFileName, $pdfContent);
                        //Log::info('PDF de evaluación borrador agregado al ZIP: ' . $pdfFileName);
                        $evalPdfFound = true;
                    } catch (\Exception $e) {
                        Log::error('Error al generar y agregar PDF de evaluación borrador al ZIP: ' . $e->getMessage());
                    }
                }

                // Agregar el Excel al ZIP
                try {
                    $excelContent = File::get($excelPath);
                    $zip->addFromString($excelFileName, $excelContent);
                    //Log::info('Excel agregado al ZIP: ' . $excelFileName);
                } catch (\Exception $e) {
                    Log::error('Error al agregar Excel al ZIP: ' . $e->getMessage());
                    return redirect()->back()->with('error', 'Error al agregar Excel al ZIP: ' . $e->getMessage());
                }

                // Agregar la carpeta de archivos de la empresa
                try {
                    $companyId = $company->id;
                    $baseCompanyPath = "companies/";

                    // Obtener todas las carpetas en el directorio companies
                    $allDirectories = Storage::disk('public')->directories($baseCompanyPath);

                    $filesFromIdOnly = [];
                    $filesFromSlugs = [];

                    foreach ($allDirectories as $directory) {
                        // Obtener solo el nombre de la carpeta (sin el path completo)
                        $folderName = basename($directory);

                        // Si la carpeta es exactamente el ID
                        if ($folderName === (string)$companyId) {
                            $filesFromIdOnly = Storage::disk('public')->allFiles($directory);
                            //Log::info('Archivos encontrados en carpeta con ID exacto: ' . count($filesFromIdOnly));
                        }
                        // Si la carpeta comienza con el ID seguido de un guión
                        elseif (preg_match("/^{$companyId}-/", $folderName)) {
                            $filesInThisFolder = Storage::disk('public')->allFiles($directory);
                            $filesFromSlugs = array_merge($filesFromSlugs, $filesInThisFolder);
                            //Log::info('Archivos encontrados en carpeta con slug ' . $folderName . ': ' . count($filesInThisFolder));
                        }
                    }

                    // Agregar archivos de la carpeta con solo ID a 'archivos'
                    if (!empty($filesFromIdOnly)) {
                        foreach ($filesFromIdOnly as $file) {
                            if (Storage::disk('public')->exists($file)) {
                                $fileContent = Storage::disk('public')->get($file);
                                $newPath = str_replace("companies/{$companyId}", 'archivos', $file);
                                $zip->addFromString($newPath, $fileContent);
                                //Log::info('Archivo agregado al ZIP en archivos/: ' . $newPath);
                            }
                        }
                        //Log::info('Total de archivos agregados a archivos/: ' . count($filesFromIdOnly));
                    }

                    // Agregar archivos de las carpetas con slug a 'archivos-old'
                    if (!empty($filesFromSlugs)) {
                        foreach ($filesFromSlugs as $file) {
                            if (Storage::disk('public')->exists($file)) {
                                $fileContent = Storage::disk('public')->get($file);
                                // Mantener la estructura de carpetas dentro de archivos-old
                                $relativePath = str_replace($baseCompanyPath, '', $file);
                                $newPath = 'archivos-old/' . $relativePath;
                                $zip->addFromString($newPath, $fileContent);
                                //Log::info('Archivo agregado al ZIP en archivos-old/: ' . $newPath);
                            }
                        }
                        //Log::info('Total de archivos agregados a archivos-old/: ' . count($filesFromSlugs));
                    }

                    // Si no se encontraron archivos en ninguna carpeta
                    if (empty($filesFromIdOnly) && empty($filesFromSlugs)) {
                        Log::warning('No se encontraron archivos en ninguna carpeta para la empresa ID: ' . $companyId);
                    } else {
                        /*Log::info('Total de archivos encontrados - ID solo: ' . count($filesFromIdOnly) .
                            ', Con slug: ' . count($filesFromSlugs));*/
                    }
                } catch (\Exception $e) {
                    Log::error('Error al agregar carpeta de archivos al ZIP: ' . $e->getMessage());
                    Log::error('Stack trace: ' . $e->getTraceAsString());
                    // Continuar con la ejecución aunque no se pueda agregar la carpeta
                }

                $zip->close();
                //Log::info('Archivo ZIP cerrado correctamente');

                // Verificar que el archivo ZIP exista
                if (!File::exists($zipPath)) {
                    Log::error('El archivo ZIP no existe después de crearlo: ' . $zipPath);
                    return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP.');
                }

                // Registrar qué archivos se incluyeron en el ZIP
                $includedFiles = ['Excel de información de la empresa'];
                if ($autoEvalPdfFound) $includedFiles[] = 'PDF de autoevaluación';
                if ($evalPdfFound) $includedFiles[] = 'PDF de evaluación';
                //Log::info('Archivos incluidos en el ZIP: ' . implode(', ', $includedFiles));

                //Log::info('Descargando archivo ZIP: ' . $zipPath);

                // Forzar la descarga del archivo
                $headers = [
                    'Content-Type' => 'application/zip',
                    'Content-Disposition' => 'attachment; filename="' . $zipFileName . '"',
                    'Content-Length' => filesize($zipPath),
                    'Cache-Control' => 'no-cache, no-store, must-revalidate',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ];

                //Log::info('Enviando respuesta de descarga con headers: ' . json_encode($headers));

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
            //Log::info('Iniciando descarga de PDF de evaluación');

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

            //Log::info('Buscando empresa con ID: ' . $companyId);

            $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);

            if (!$company) {
                Log::error('No se encontró la empresa con ID: ' . $companyId);
                return redirect()->back()->with('error', 'No se encontró información de la empresa.');
            }

            //Log::info('Empresa encontrada: ' . $company->name);

            // Ruta de la carpeta de evaluaciones de la empresa
            $companySlug = Str::slug($company->name);
            $evalPath = "companies/{$company->id}/evaluations";

            // Verificar si existe algún PDF de evaluación
            $pdfExists = Storage::disk('public')->exists($company->evaluation_document_path);

            if (!$pdfExists) {
                //Log::info('No se encontró PDF existente, generando uno nuevo como borrador');

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
                //$company->evaluation_document_path = "{$evalPath}/{$fileName}";
                //$company->save();

                //Log::info('PDF borrador generado exitosamente: ' . $fileName);
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

    private function formatPaths($paths)
    {
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

    private function generateCleanWordDocument($company, $values, $indicatorsByValue, $autoEvaluationAnswers, $evalPath, $companySlug)
    {
        try {
            // Verificar si ya existe un archivo Word limpio para esta empresa
            if ($company->evaluation_clean_word_document_path && 
                Storage::disk('public')->exists($company->evaluation_clean_word_document_path)) {
                //Log::info('Documento Word limpio ya existe, no se regenerará: ' . $company->evaluation_clean_word_document_path);
                return;
            }

            // Eliminar el archivo anterior si existe pero está roto o no se encuentra
            if ($company->evaluation_clean_word_document_path && 
                !Storage::disk('public')->exists($company->evaluation_clean_word_document_path)) {
                //Log::info('Archivo Word anterior no encontrado, se regenerará: ' . $company->evaluation_clean_word_document_path);
            }

            $phpWord = new PhpWord();
            
            // Configurar estilos globales
            $phpWord->setDefaultFontName('Arial');
            $phpWord->setDefaultFontSize(11);
            
            // Definir estilos personalizados
            $phpWord->addTitleStyle(1, ['name' => 'Arial', 'size' => 18, 'bold' => true, 'color' => '157f3d']);
            $phpWord->addTitleStyle(2, ['name' => 'Arial', 'size' => 15, 'bold' => true, 'color' => '157f3d']);
            $phpWord->addTitleStyle(3, ['name' => 'Arial', 'size' => 13, 'bold' => true, 'color' => '157f3d']);
            
            // Crear sección principal
            $section = $phpWord->addSection([
                'marginTop' => Converter::inchToTwip(1),
                'marginBottom' => Converter::inchToTwip(1),
                'marginLeft' => Converter::inchToTwip(1),
                'marginRight' => Converter::inchToTwip(1),
            ]);

            // Agregar contenido al documento
            $this->addContentToWordDocument($section, $company, $values, $indicatorsByValue, $autoEvaluationAnswers);

            // Generar nombre de archivo con timestamp
            $cleanWordFileName = "evaluation_clean_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.docx';
            $cleanWordFilePath = "{$evalPath}/{$cleanWordFileName}";
            $fullCleanWordPath = storage_path("app/public/{$cleanWordFilePath}");

            // Guardar el documento Word
            $objWriter = IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($fullCleanWordPath);

            // Actualizar la ruta del documento Word limpio en la empresa
            $company->evaluation_clean_word_document_path = $cleanWordFilePath;
            $company->save();

            //Log::info('Documento Word limpio generado y guardado exitosamente: ' . $cleanWordFilePath);
        } catch (\Exception $e) {
            Log::error('Error al generar el documento Word limpio: ' . $e->getMessage());
            throw $e;
        }
    }

    private function addContentToWordDocument($section, $company, $values, $indicatorsByValue, $autoEvaluationAnswers)
    {
        // Título principal
        $section->addTitle('Informe de Evaluación del Protocolo Marca País', 1);
        $section->addTextBreak(2);

        // Datos de la organización
        $section->addTitle('Datos de la organización', 2);
        $section->addTextBreak(1);
        
        $infoAdicional = $company->infoAdicional;
        
        // En lugar de tabla, usar texto simple con formato
        $section->addText('Nombre comercial:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Razón social:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Cédula jurídica:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Descripción:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Actividad comercial:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Año de fundación:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Proceso de licenciamiento:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Exporta actualmente:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Países de exportación:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Productos/servicios:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Rango de exportaciones:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Total de empleados:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Distribución de empleados:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Hombres: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Mujeres: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Otros: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addTextBreak(1);
        
        $section->addText('Dirección:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Provincia: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Cantón: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Distrito: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addTextBreak(1);
        
        $section->addText('Redes sociales:', ['bold' => true, 'size' => 12]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Sitio web: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Facebook: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- Instagram: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        $section->addText('- LinkedIn: _______________', ['size' => 12], ['leftIndent' => 300]);
        $section->addText('', [], ['spaceBefore' => 0, 'spaceAfter' => 100]);
        
        $section->addPageBreak();

        // Resumen de evaluación
        $section->addTitle('Resumen de evaluación', 2);
        $section->addTextBreak(1);
        
        $evalTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $evalTable->addRow();
        $evalTable->addCell(3000)->addText('Valor', ['bold' => true], ['bgColor' => '157f3d']);
        $evalTable->addCell(3000)->addText('Calificación mínima', ['bold' => true], ['bgColor' => '157f3d']);
        $evalTable->addCell(3000)->addText('Calificación obtenida', ['bold' => true], ['bgColor' => '157f3d']);
        
        foreach ($values as $value) {
            $evalTable->addRow();
            $evalTable->addCell(3000)->addText($value->name);
            $evalTable->addCell(3000)->addText(''); // Campo vacío para completar
            $evalTable->addCell(3000)->addText(''); // Campo vacío para completar
        }
        
        $section->addTextBreak(2);
        
        // Secciones de texto para completar
        $this->addEmptySection($section, 'Justificación del alcance, artículo 10 del Reglamento para el uso de la marca país esencial COSTA RICA');
        $this->addEmptySection($section, 'Puntos fuertes de la organización');
        $this->addEmptySection($section, 'Oportunidades de mejora de la organización');
        
        // Datos participantes clave
        $section->addTitle('Datos participantes clave', 2);
        $section->addTextBreak(1);
        
        $participantesTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $participantesTable->addRow();
        $participantesTable->addCell(2000)->addText('Nombre', ['bold' => true], ['bgColor' => '157f3d']);
        $participantesTable->addCell(2000)->addText('Apellido', ['bold' => true], ['bgColor' => '157f3d']);
        $participantesTable->addCell(2500)->addText('Correo electrónico', ['bold' => true], ['bgColor' => '157f3d']);
        $participantesTable->addCell(1500)->addText('Teléfono', ['bold' => true], ['bgColor' => '157f3d']);
        $participantesTable->addCell(1500)->addText('Rol', ['bold' => true], ['bgColor' => '157f3d']);
        
        // Agregar filas vacías
        for ($i = 0; $i < 4; $i++) {
            $participantesTable->addRow();
            $participantesTable->addCell(2000)->addText('');
            $participantesTable->addCell(2000)->addText('');
            $participantesTable->addCell(2500)->addText('');
            $participantesTable->addCell(1500)->addText('');
            $participantesTable->addCell(1500)->addText('');
        }
        
        $section->addPageBreak();
        
        // Certificaciones vigentes
        $section->addTitle('Certificaciones vigentes', 2);
        $section->addTextBreak(1);
        
        $certTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $certTable->addRow();
        $certTable->addCell(4000)->addText('Certificación', ['bold' => true], ['bgColor' => '157f3d']);
        $certTable->addCell(2000)->addText('Fecha de obtención', ['bold' => true], ['bgColor' => '157f3d']);
        $certTable->addCell(2000)->addText('Fecha de vencimiento', ['bold' => true], ['bgColor' => '157f3d']);
        $certTable->addCell(2500)->addText('Organismo certificador', ['bold' => true], ['bgColor' => '157f3d']);
        
        // Agregar filas vacías
        for ($i = 0; $i < 4; $i++) {
            $certTable->addRow();
            $certTable->addCell(4000)->addText('');
            $certTable->addCell(2000)->addText('');
            $certTable->addCell(2000)->addText('');
            $certTable->addCell(2500)->addText('');
        }
        
        $section->addTextBreak(2);
        
        // Datos complementarios
        $section->addTitle('Datos complementarios a la función central', 2);
        $section->addTextBreak(1);
        
        $section->addText('¿Tiene la organización multi-sitio?', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Cantidad de multi-sitio evaluados:', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('¿La organización ha aprobado la evaluación de los multi-sitio?', ['bold' => true]);
        $section->addTextBreak(2);
        
        $section->addText('Importante: En el caso de organizaciones multi-sitio, la función central de la organización debe ser siempre evaluada. La evaluación del resto de sitios se debe basar en muestreo e incluir al menos un número igual a la raíz cuadrada del total de sitios adicionales a la función central.', ['italic' => true, 'color' => '666666']);
        
        // Datos de contacto
        $this->addContactSections($section, $company);
        
        $section->addPageBreak();
        
        // Descripción y justificación de cumplimiento del protocolo
        $section->addTitle('Descripción y justificación de cumplimiento del protocolo', 2);
        $section->addText('Indicadores de marca país esencial COSTA RICA', ['bold' => true]);
        $section->addText('Todo cumplimiento o incumplimiento de indicador debe ser justificado de acuerdo a los requisitos generales.');
        $section->addTextBreak(2);
        
        // Indicadores por valor
        foreach ($values as $value) {
            $section->addTitle($value->name, 3);
            $section->addTextBreak(1);
            
            // Tabla de calificación
            $scoreTable = $section->addTable([
                'borderSize' => 6,
                'borderColor' => '999999',
                'cellMargin' => 50,
                'bgColor' => 'f3f4f6'
            ]);
            
            $this->addTableRow($scoreTable, 'Calificación obtenida:', '');
            $this->addTableRow($scoreTable, 'Calificación mínima requerida:', '');
            $this->addTableRow($scoreTable, 'Estado:', '');
            
            $section->addTextBreak(1);
            
            // Indicadores del valor
            if (isset($indicatorsByValue[$value->id])) {
                foreach ($indicatorsByValue[$value->id] as $indicator) {
                    $section->addTitle($indicator->name, 4);
                    
                    $section->addText('Componente: ' . $indicator->subcategory->name, ['color' => '157f3d']);
                    $section->addText('Requisito: ' . $indicator->requisito->name, ['color' => '157f3d']);
                    $section->addTextBreak(1);
                    
                    // Autoevaluación
                    $autoevTitle = 'Autoevaluación';
                    if ($indicator->binding) {
                        $autoevTitle .= ' (Indicador descalificatorio)';
                    }
                    $section->addText($autoevTitle, ['bold' => true, 'color' => '4b5563']);
                    
                    $section->addText('Pregunta: ' . $indicator->self_evaluation_question, ['bold' => true]);
                    
                    // Respuesta de autoevaluación si existe
                    if (isset($autoEvaluationAnswers[$indicator->id]) && $autoEvaluationAnswers[$indicator->id]->count() > 0) {
                        foreach ($autoEvaluationAnswers[$indicator->id] as $autoAnswer) {
                            $section->addText('Respuesta: ', ['bold' => true]);
                            if ($autoAnswer->justification) {
                                $section->addText('Justificación: ' . $autoAnswer->justification, ['italic' => true, 'color' => '4b5563']);
                            }
                        }
                    } else {
                        $section->addText('Respuesta: ');
                    }
                    
                    $section->addTextBreak(1);
                    
                    // Evaluación
                    $evalTitle = 'Evaluación';
                    if ($indicator->binding) {
                        $evalTitle .= ' (Indicador descalificatorio)';
                    }
                    $section->addText($evalTitle, ['bold' => true, 'color' => '157f3d']);
                    
                    // Tabla de preguntas de evaluación
                    $questionTable = $section->addTable([
                        'borderSize' => 6,
                        'borderColor' => '999999',
                        'cellMargin' => 50,
                    ]);
                    
                    $questionTable->addRow();
                    $questionTable->addCell(4000)->addText('Pregunta', ['bold' => true], ['bgColor' => '157f3d']);
                    $questionTable->addCell(1500)->addText('Cumple', ['bold' => true], ['bgColor' => '157f3d']);
                    $questionTable->addCell(4000)->addText('Justificación', ['bold' => true], ['bgColor' => '157f3d']);
                    
                    foreach ($indicator->evaluationQuestions as $question) {
                        $questionTable->addRow();
                        $questionTable->addCell(4000)->addText($question->question);
                        $questionTable->addCell(1500)->addText(''); // Campo vacío para completar
                        $questionTable->addCell(4000)->addText(''); // Campo vacío para completar
                    }
                    
                    $section->addTextBreak(2);
                }
            } else {
                $section->addText('No hay indicadores para este valor.');
            }
            
            $section->addPageBreak();
        }
        
        // Disposiciones finales y firmas
        $this->addFinalSections($section);
    }
    
    private function addTableRow($table, $label, $value)
    {
        $table->addRow();
        $table->addCell(3000)->addText($label, ['bold' => true]);
        $table->addCell(6000)->addText($value);
    }
    
    private function addEmptySection($section, $title)
    {
        $section->addTextBreak(1);
        $section->addText($title, ['bold' => true, 'color' => '157f3d', 'size' => 13]);
        $section->addTextBreak(1);
        
        // Agregar líneas vacías para que puedan completar
        for ($i = 0; $i < 4; $i++) {
            $section->addText('_' . str_repeat('_', 100));
            $section->addTextBreak(1);
        }
        
        $section->addTextBreak(1);
    }
    
    private function addContactSections($section, $company)
    {
        $section->addPageBreak();
        $section->addTitle('Datos de contacto', 2);
        $section->addTextBreak(1);
        
        // Contacto para notificaciones
        $section->addTitle('Contacto para recibir Notificaciones de Marca País', 3);
        $contactTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($contactTable, 'Nombre del contacto:', '');
        $this->addTableRow($contactTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($contactTable, 'Correo electrónico:', '');
        $this->addTableRow($contactTable, 'Teléfono:', '');
        $this->addTableRow($contactTable, 'Celular:', '');
        
        $section->addTextBreak(1);
        
        // Contacto asignado para el proceso
        $section->addTitle('Contacto asignado para el proceso de licenciamiento de la Marca País', 3);
        $procesoTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($procesoTable, 'Nombre del contacto:', '');
        $this->addTableRow($procesoTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($procesoTable, 'Correo electrónico:', '');
        $this->addTableRow($procesoTable, 'Teléfono:', '');
        $this->addTableRow($procesoTable, 'Celular:', '');
        
        $section->addTextBreak(1);
        
        // Otros contactos de manera similar...
        $this->addOtherContacts($section);
    }
    
    private function addOtherContacts($section)
    {
        // Representante Legal
        $section->addTitle('Contacto del Representante Legal o Gerente General', 3);
        $repTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($repTable, 'Nombre del contacto:', '');
        $this->addTableRow($repTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($repTable, 'Cédula:', '');
        $this->addTableRow($repTable, 'Correo electrónico:', '');
        $this->addTableRow($repTable, 'Teléfono:', '');
        $this->addTableRow($repTable, 'Celular:', '');
        
        $section->addTextBreak(1);
        
        // Vocero
        $section->addTitle('Contacto Vocero de la empresa', 3);
        $voceroTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($voceroTable, 'Nombre del contacto:', '');
        $this->addTableRow($voceroTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($voceroTable, 'Correo electrónico:', '');
        $this->addTableRow($voceroTable, 'Teléfono:', '');
        $this->addTableRow($voceroTable, 'Celular:', '');
        
        $section->addTextBreak(1);
        
        // Mercadeo
        $section->addTitle('Contacto de su área de Mercadeo', 3);
        $mercadeoTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($mercadeoTable, 'Nombre del contacto:', '');
        $this->addTableRow($mercadeoTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($mercadeoTable, 'Correo electrónico:', '');
        $this->addTableRow($mercadeoTable, 'Teléfono:', '');
        $this->addTableRow($mercadeoTable, 'Celular:', '');
        
        $section->addTextBreak(1);
        
        // Micrositio
        $section->addTitle('Contacto Micrositio en web esencial', 3);
        $micrositioTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $this->addTableRow($micrositioTable, 'Nombre del contacto:', '');
        $this->addTableRow($micrositioTable, 'Posición dentro de la organización:', '');
        $this->addTableRow($micrositioTable, 'Correo electrónico:', '');
        $this->addTableRow($micrositioTable, 'Teléfono:', '');
        $this->addTableRow($micrositioTable, 'Celular:', '');
    }
    
    private function addFinalSections($section)
    {
        // Datos del equipo evaluador
        $section->addTitle('Datos del equipo evaluador', 2);
        $section->addTextBreak(1);
        
        $teamTable = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 50,
        ]);
        
        $teamTable->addRow();
        $teamTable->addCell(3500)->addText('Nombre del Organismo Evaluador', ['bold' => true], ['bgColor' => '157f3d']);
        $teamTable->addCell(2000)->addText('Nombre del Evaluador', ['bold' => true], ['bgColor' => '157f3d']);
        $teamTable->addCell(3000)->addText('Correo electrónico', ['bold' => true], ['bgColor' => '157f3d']);
        $teamTable->addCell(1500)->addText('Teléfono', ['bold' => true], ['bgColor' => '157f3d']);
        
        // Agregar filas vacías
        for ($i = 0; $i < 4; $i++) {
            $teamTable->addRow();
            $teamTable->addCell(3500)->addText('');
            $teamTable->addCell(2000)->addText('');
            $teamTable->addCell(3000)->addText('');
            $teamTable->addCell(1500)->addText('');
        }
        
        $section->addTextBreak(2);
        
        // Disposiciones finales
        $section->addTitle('Disposiciones finales', 3);
        $section->addListItem('La organización se quedará con copia de este informe.');
        $section->addListItem('Los no cumplimientos han sido aclarados y entendidos.');
        $section->addTextBreak(1);
        
        // Anexos
        $section->addTitle('Anexos', 3);
        $section->addListItem('Copia del informe técnico de cumplimiento del protocolo de evaluación.');
        $section->addListItem('Certificación de personería con no más de tres meses de emitida.');
        $section->addListItem('Copia de la cédula de identidad del representante legal.');
        $section->addTextBreak(2);
        
        // Declaraciones juradas
        $section->addTitle('Declaraciones Juradas', 3);
        $section->addTextBreak(1);
        
        $section->addText('DECLARO BAJO LA FE DEL JURAMENTO LO SIGUIENTE:', ['bold' => true, 'size' => 14]);
        $section->addTextBreak(1);
        
        $section->addTitle('Solicitante de Licencia', 4);
        $section->addText('Primero: Que la información suministrada y las evidencias aportadas durante la evaluación de la Marca País son verídicas y representan la realidad de la organización evaluada.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Segundo: Que mi representada se encuentra al día con el pago de los tributos nacionales, municipales y demás obligaciones tributarias.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Tercero: Quien suscribe, solicita la licencia de uso corporativo de la marca país esencial COSTA RICA. Asimismo, declaro que conozco, acepto y me comprometo a que mi representada acate todos los lineamientos de uso de la marca, debiendo ajustarse en todo momento a los requerimientos, deberes, obligaciones y restricciones estipuladas en el Reglamento para la implementación y uso de la marca país esencial COSTA RICA.', ['bold' => true]);
        $section->addTextBreak(2);
        
        $section->addTitle('Evaluador de la Marca País', 4);
        $section->addText('Primero: Que en la evaluación realizada por mi persona a la empresa, no existió ningún conflicto de interés.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Segundo: Que no he tenido relación con la empresa evaluada, ni con los empleados, propietarios, socios, representantes legales, proveedores o consultores relacionados con la empresa evaluada.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Tercero: Que no he trabajado ni he brindado servicio de asesoría a la empresa a evaluar en los últimos 2 años.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Cuarto: Que no tengo ninguna relación de parentesco, afinidad y consanguinidad hasta el segundo grado con la persona evaluada.', ['bold' => true]);
        $section->addTextBreak(1);
        $section->addText('Quinto: Hago la presente declaración bajo advertencia de las penas por falso testimonio que contempla el Código Penal.', ['bold' => true]);
        $section->addTextBreak(3);
        
        // Firmas
        $section->addTitle('Firmas', 3);
        $section->addTextBreak(3);
        
        $signatureTable = $section->addTable([
            'borderSize' => 0,
            'cellMargin' => 50,
        ]);
        
        $signatureTable->addRow();
        $cell1 = $signatureTable->addCell(4500);
        $cell1->addText('_' . str_repeat('_', 40));
        $cell1->addTextBreak(1);
        $cell1->addText('REPRESENTANTE DE LA ORGANIZACIÓN', ['bold' => true], ['alignment' => 'center']);
        
        $cell2 = $signatureTable->addCell(4500);
        $cell2->addText('_' . str_repeat('_', 40));
        $cell2->addTextBreak(1);
        $cell2->addText('EVALUADOR', ['bold' => true], ['alignment' => 'center']);
        
        $section->addTextBreak(3);
        $section->addText('Este informe ha sido generado automáticamente por el sistema de evaluación del Protocolo Marca País.', [], ['alignment' => 'center']);
        $section->addText('© ' . date('Y') . ' - Todos los derechos reservados', [], ['alignment' => 'center']);
    }

    public function downloadAnexoUnoEstandarPDF()
    {
        try {
            // Crear nueva instancia de FPDI para el anexo 1
            $pdf = new Fpdi();
            $pdf->SetTitle(iconv('UTF-8', 'ISO-8859-1//TRANSLIT', 'Anexo 1 al Reglamento para el uso de la marca país esencial Costa Rica PRO-NOR-044'));

            // Establecer el archivo fuente
            $sourcePath = storage_path('app/public/pdfs/anexo_1.pdf');

            // Verificar si el archivo existe
            if (!file_exists($sourcePath)) {
                Log::error('Archivo PDF base no encontrado:', ['path' => $sourcePath]);
                return redirect()->back()->with('error', 'El archivo PDF base no existe.');
            }

            // Importar todas las páginas del PDF base
            $pageCount = $pdf->setSourceFile($sourcePath);
            
            for ($i = 1; $i <= $pageCount; $i++) {
                $tplId = $pdf->importPage($i);
                $pdf->AddPage();
                $pdf->useTemplate($tplId);

                // En la página 43, agregar el enlace al archivo pre-generado
                if ($i === 43) {
                    $pdf->SetFont('Helvetica', 'B', 12);
                    $pdf->SetTextColor(0, 0, 255); // Azul para indicar que es un enlace

                    // Posicionar el enlace
                    $x = 60;
                    $y = 175;

                    // Codificar el nombre del archivo para la URL
                    $fileName = "Formulario de solicitud de licencia e informe de evaluación.pdf";
                    $encodedFileName = rawurlencode($fileName);
                    $documentUrl = url('storage/pdfs/' . $encodedFileName);

                    $pdf->Link($x, $y, 150, 20, $documentUrl);

                    // Agregar el texto del enlace
                    $pdf->SetXY($x, $y);
                    $pdf->Cell(150, 20, '', 0, 0, 'L');
                }
            }

            // Generar el PDF y forzar la descarga
            $downloadFileName = 'Anexo 1 al Reglamento para el uso de la marca país esencial Costa Rica PRO-NOR-044.pdf';
            $fpdfFileName = mb_convert_encoding($downloadFileName, 'ISO-8859-1', 'UTF-8');
            $asciiFileName = iconv('UTF-8', 'ASCII//TRANSLIT', $downloadFileName);
            $utf8FileName = rawurlencode($downloadFileName);

            $response = response($pdf->Output('I', $fpdfFileName))
                ->header('Content-Type', 'application/pdf')
                ->header(
                    'Content-Disposition',
                    "inline; filename=\"{$asciiFileName}\"; filename*=UTF-8''{$utf8FileName}"
                );

            return $response;

        } catch (\Exception $e) {
            Log::error('Error al procesar el PDF:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Error al procesar el PDF: ' . $e->getMessage());
        }
    }
}
