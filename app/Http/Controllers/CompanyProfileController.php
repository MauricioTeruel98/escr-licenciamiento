<?php

namespace App\Http\Controllers;

use App\Models\AutoEvaluationResult;
use App\Models\Company;
use App\Models\InfoAdicionalEmpresa;
use App\Models\CompanyProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Value;
use App\Models\EvaluatorAssessment;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\Indicator;
use App\Models\EvaluationValueResult;
use Barryvdh\DomPDF\Facade\Pdf;

class CompanyProfileController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $companyId = Auth::user()->company_id;

            // Log para depuración
            Log::info('Iniciando proceso de guardado', [
                'request_data' => $request->all()
            ]);

            // Procesar datos básicos
            $allData = $request->except(['productos_data', 'logo_path', 'fotografias_paths', 'certificaciones_paths', 'provincia', 'canton', 'distrito', 'is_exporter']);

            // Convertir valores booleanos a 1 o 0
            $allData['recomienda_marca_pais'] = filter_var($allData['recomienda_marca_pais'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $allData['tiene_multi_sitio'] = filter_var($allData['tiene_multi_sitio'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $allData['aprobo_evaluacion_multi_sitio'] = filter_var($allData['aprobo_evaluacion_multi_sitio'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

            // Calcular cantidad_total
            $allData['cantidad_total'] = ($allData['cantidad_hombres'] ?? 0) + 
                                       ($allData['cantidad_mujeres'] ?? 0) + 
                                       ($allData['cantidad_otros'] ?? 0);

            // Asegurarse de que cantidad_multi_sitio sea un entero o null
            $allData['cantidad_multi_sitio'] = $allData['tiene_multi_sitio'] ? (int)$allData['cantidad_multi_sitio'] : null;

            $allData['company_id'] = $companyId;

            // Obtener información adicional existente
            $infoExistente = InfoAdicionalEmpresa::where('company_id', $companyId)->first();

            // Procesar datos de ubicación (provincia, cantón y distrito) y el campo is_exporter
            $companyData = [];

            // Actualizar el campo is_exporter en la tabla companies
            if ($request->has('is_exporter')) {
                $companyData['is_exporter'] = filter_var($request->is_exporter, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            }

            $infoAdicional = InfoAdicionalEmpresa::where('company_id', $companyId)->first();

            // Obtener los nombres de provincia, cantón y distrito a partir de los IDs
            if ($request->has('provincia') && !empty($request->provincia)) {
                // Cargar el archivo de lugares
                $lugaresJson = Storage::disk('public')->get('lugares.json');
                $lugares = json_decode($lugaresJson, true);

                // Buscar la provincia seleccionada
                $provinciaId = $request->provincia;
                $provinciaName = null;
                $cantonName = null;
                $distritoName = null;

                foreach ($lugares[0]['provincias'] as $provincia) {
                    if ($provincia['id'] === $provinciaId) {
                        $provinciaName = $provincia['name'];

                        // Buscar el cantón seleccionado
                        if ($request->has('canton') && !empty($request->canton)) {
                            $cantonId = $request->canton;

                            foreach ($provincia['cantones'] as $canton) {
                                if ($canton['id'] === $cantonId) {
                                    $cantonName = $canton['name'];

                                    // Buscar el distrito seleccionado
                                    if ($request->has('distrito') && !empty($request->distrito)) {
                                        $distritoId = $request->distrito;

                                        foreach ($canton['distritos'] as $distrito) {
                                            if ($distrito['id'] === $distritoId) {
                                                $distritoName = $distrito['name'];
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }

                // Guardar los nombres en lugar de los IDs
                $companyData['provincia'] = $provinciaName;
                $companyData['canton'] = $cantonName;
                $companyData['distrito'] = $distritoName;

                Log::info('Datos de ubicación procesados', [
                    'provincia' => $provinciaName,
                    'canton' => $cantonName,
                    'distrito' => $distritoName
                ]);
            }

            // Actualizar la información de la empresa
            if (!empty($companyData)) {
                Company::where('id', $companyId)->update($companyData);
                Log::info('Datos actualizados en la tabla companies', $companyData);
            }

            // Procesar logo
            if ($request->has('logo_path')) {
                try {
                    $allData['logo_path'] = $request->logo_path;
                } catch (\Exception $e) {
                    Log::error('Error al procesar el logo:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // No detenemos el proceso, continuamos con el resto de datos
                }
            } else if ($infoExistente && $infoExistente->logo_path) {
                // Si no se envió ningún logo pero existe uno en la base de datos, mantenerlo
                $allData['logo_path'] = $infoExistente->logo_path;
            }

            // Procesar fotografías
            if ($request->has('fotografias_paths')) {
                try {
                    $allData['fotografias_paths'] = $request->fotografias_paths;
                } catch (\Exception $e) {
                    Log::error('Error al procesar fotografías:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // No detenemos el proceso, continuamos con el resto de datos
                }
            } else if ($infoExistente && $infoExistente->fotografias_paths) {
                // Si no se enviaron fotografías pero existen en la base de datos, mantenerlas
                $allData['fotografias_paths'] = $infoExistente->fotografias_paths;
            }

            // Procesar certificaciones
            if ($request->has('certificaciones_paths')) {
                try {
                    $allData['certificaciones_paths'] = $request->certificaciones_paths;
                } catch (\Exception $e) {
                    Log::error('Error al procesar certificaciones:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // No detenemos el proceso, continuamos con el resto de datos
                }
            } else if ($infoExistente && $infoExistente->certificaciones_paths) {
                // Si no se enviaron certificaciones pero existen en la base de datos, mantenerlas
                $allData['certificaciones_paths'] = $infoExistente->certificaciones_paths;
            }

            // Guardar información de la empresa
            $infoAdicional = InfoAdicionalEmpresa::updateOrCreate(
                ['company_id' => $companyId],
                $allData
            );

            // Verificar si los campos obligatorios están completos antes de marcar el formulario como enviado
            $camposObligatorios = [
                'nombre_comercial',
                'nombre_legal',
                'descripcion_es',
                'descripcion_en',
                'anio_fundacion',
                'sitio_web',
                'tamano_empresa',
                'cantidad_hombres',
                'cantidad_mujeres',
                //'cantidad_otros',
                //'es_exportadora',
                'actividad_comercial',
                'razon_licenciamiento_es',
                'razon_licenciamiento_en',
                'proceso_licenciamiento',
                //'recomienda_marca_pais',
                //'observaciones',
                'contacto_notificacion_nombre',
                'contacto_notificacion_email',
                'contacto_notificacion_puesto',
                'contacto_notificacion_telefono',
                'contacto_notificacion_celular',
                'asignado_proceso_nombre',
                'asignado_proceso_email',
                'asignado_proceso_puesto',
                'asignado_proceso_telefono',
                'asignado_proceso_celular',
                'representante_nombre',
                'representante_email',
                'representante_puesto',
                'representante_cedula',
                'representante_telefono',
                'representante_celular',
                'logo_path',
                'fotografias_paths',
                'certificaciones_paths'
            ];

            $formularioCompleto = true;
            foreach ($camposObligatorios as $campo) {
                if (empty($allData[$campo])) {
                    $formularioCompleto = false;
                    break;
                }
            }

            // Solo actualizar el campo form_sended si todos los campos obligatorios están completos
            /*if ($formularioCompleto) {
                DB::table('auto_evaluation_result')
                    ->where('company_id', $companyId)
                    ->update(['form_sended' => 1]);

                Log::info('Formulario marcado como completamente enviado', [
                    'company_id' => $companyId
                ]);
            } else {
                Log::info('Formulario guardado pero no marcado como completamente enviado', [
                    'company_id' => $companyId,
                    'campos_faltantes' => array_filter($camposObligatorios, function ($campo) use ($allData) {
                        return empty($allData[$campo]);
                    })
                ]);
            }*/

            // Procesar productos
            if ($request->has('productos_data')) {
                try {
                    $productos = json_decode($request->productos_data, true);

                    if (is_array($productos)) {
                        foreach ($productos as $producto) {
                            try {
                                $productoData = [
                                    'company_id' => $companyId,
                                    'info_adicional_empresa_id' => $infoAdicional->id,
                                    'nombre' => $producto['nombre'],
                                    'descripcion' => $producto['descripcion']
                                ];

                                if (isset($producto['imagen'])) {
                                    $productoData['imagen'] = $producto['imagen'];
                                }

                                // Crear o actualizar el producto
                                CompanyProducts::updateOrCreate(
                                    ['info_adicional_empresa_id' => $infoAdicional->id, 'nombre' => $producto['nombre']],
                                    $productoData
                                );
                            } catch (\Exception $e) {
                                Log::error('Error al procesar un producto individual:', [
                                    'producto' => $producto['nombre'] ?? 'desconocido',
                                    'error' => $e->getMessage(),
                                    'trace' => $e->getTraceAsString()
                                ]);
                                // Continuamos con el siguiente producto
                                continue;
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::error('Error al procesar productos:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    // No detenemos el proceso, continuamos con el resto de datos
                }
            }

            DB::commit();

            $company = Company::find($companyId);

            if ($company) {
                $company->name = $allData['nombre_comercial'];
                $company->website = $allData['sitio_web'];
                $company->sector = $allData['sector'];
                //$company->provincia = $allData['provincia'];
                $company->commercial_activity = $allData['actividad_comercial'];
                $company->phone = $allData['telefono_1'];
                $company->mobile = $allData['telefono_2'];
                $company->puntos_fuertes = $allData['puntos_fuertes'];
                $company->justificacion = $allData['justificacion'];
                $company->oportunidades = $allData['oportunidades'];
                $company->tiene_multi_sitio = $allData['tiene_multi_sitio'];
                $company->cantidad_multi_sitio = $allData['cantidad_multi_sitio'];
                $company->aprobo_evaluacion_multi_sitio = $allData['aprobo_evaluacion_multi_sitio'];
                $company->save();
            }

            // Modificar cómo retornamos los datos para incluir las URLs
            $responseData = $allData;
            if (isset($responseData['logo_path'])) {
                $responseData['logo_url'] = asset('storage/' . $responseData['logo_path']);
            }
            if (isset($responseData['fotografias_paths'])) {
                $fotografias = json_decode($responseData['fotografias_paths'], true);
                $responseData['fotografias_urls'] = array_map(function ($path) {
                    return [
                        'name' => basename($path),
                        'path' => $path,
                        'url' => asset('storage/' . $path),
                        'size' => Storage::disk('public')->size($path),
                        'type' => $this->getFileType(Storage::disk('public')->path($path))
                    ];
                }, $fotografias);
            }
            if (isset($responseData['certificaciones_paths'])) {
                $certificaciones = json_decode($responseData['certificaciones_paths'], true);
                $responseData['certificaciones_urls'] = array_map(function ($path) {
                    return [
                        'name' => basename($path),
                        'path' => $path,
                        'url' => asset('storage/' . $path),
                        'size' => Storage::disk('public')->size($path),
                        'type' => $this->getFileType(Storage::disk('public')->path($path))
                    ];
                }, $certificaciones);
            }

            // Agregar información de ubicación a la respuesta
            $responseData['provincia_nombre'] = $companyData['provincia'] ?? null;
            $responseData['canton_nombre'] = $companyData['canton'] ?? null;
            $responseData['distrito_nombre'] = $companyData['distrito'] ?? null;

            // Verificar si el usuario es super_admin o evaluador
            $user = Auth::user();
            if ($user->role === 'super_admin' || $user->role === 'evaluador') {
                // Solo regenerar el documento si la empresa ya ha sido evaluada
                if (in_array($company->estado_eval, ['evaluado', 'evaluacion-calificada'])) {
                    $documentRegenerated = $this->regenerateEvaluationDocument($company, $user);
                    if ($documentRegenerated) {
                        Log::info('Documento de evaluación regenerado exitosamente', [
                            'company_id' => $company->id,
                            'user_id' => $user->id,
                            'role' => $user->role
                        ]);
                    } else {
                        Log::warning('No se pudo regenerar el documento de evaluación', [
                            'company_id' => $company->id,
                            'user_id' => $user->id,
                            'role' => $user->role
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Información guardada correctamente',
                'data' => $responseData,
                'formulario_completo' => $formularioCompleto,
                'campos_faltantes' => !$formularioCompleto ? array_filter($camposObligatorios, function ($campo) use ($allData) {
                    return empty($allData[$campo]);
                }) : []
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar información adicional de empresa', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar información: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getFileType($mimeType)
    {
        // Determinar el tipo de archivo basado en el mime type
        if (strpos($mimeType, 'image/') === 0) {
            return 'fotografias'; // Por defecto, las imágenes van a fotografías
        }
        return 'otros';
    }

    public function deleteFile(Request $request)
    {
        try {
            $user = Auth::user();
            $path = $request->path;
            $type = $request->type; // 'logo', 'fotografias', 'certificaciones'

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            $infoAdicional = InfoAdicionalEmpresa::where('company_id', $user->company_id)->first();
            if (!$infoAdicional) {
                return response()->json(['message' => 'Información no encontrada'], 404);
            }

            switch ($type) {
                case 'logo':
                    // Eliminar el logo sin importar la ruta exacta
                    if ($infoAdicional->logo_path) {
                        Storage::disk('public')->delete($infoAdicional->logo_path);
                        $infoAdicional->update(['logo_path' => null]);
                    }
                    break;

                case 'fotografias':
                    $fotografias = json_decode($infoAdicional->fotografias_paths, true) ?? [];
                    if (($key = array_search($path, $fotografias)) !== false) {
                        Storage::disk('public')->delete($path);
                        unset($fotografias[$key]);
                        $infoAdicional->update(['fotografias_paths' => json_encode(array_values($fotografias))]);
                    }
                    break;

                case 'certificaciones':
                    $certificaciones = json_decode($infoAdicional->certificaciones_paths, true) ?? [];
                    if (($key = array_search($path, $certificaciones)) !== false) {
                        Storage::disk('public')->delete($path);
                        unset($certificaciones[$key]);
                        $infoAdicional->update(['certificaciones_paths' => json_encode(array_values($certificaciones))]);
                    }
                    break;
            }

            return response()->json(['success' => true, 'message' => 'Archivo eliminado correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar archivo:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function downloadFile(Request $request)
    {
        try {
            $path = $request->path;

            if (!Storage::disk('public')->exists($path)) {
                return response()->json(['message' => 'Archivo no encontrado'], 404);
            }

            return response()->download(storage_path('app/public/' . $path));
        } catch (\Exception $e) {
            Log::error('Error al descargar archivo:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al descargar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyProduct(Request $request, $productId)
    {
        try {
            $user = Auth::user();
            $product = CompanyProducts::where('id', $productId)
                ->where('company_id', $user->company_id)
                ->first();

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
            }

            // Eliminar la imagen del producto si existe
            if ($product->imagen && Storage::disk('public')->exists($product->imagen)) {
                Storage::disk('public')->delete($product->imagen);
            }

            // Eliminar el producto
            $product->delete();

            return response()->json(['success' => true, 'message' => 'Producto eliminado correctamente']);
        } catch (\Exception $e) {
            Log::error('Error al eliminar producto:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['success' => false, 'message' => 'Error al eliminar el producto: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Valida que los archivos subidos sean de los tipos permitidos (jpg, jpeg, png)
     * y que no excedan la cantidad máxima permitida por tipo
     * y que no excedan el tamaño máximo de 2 MB
     */
    private function validateFileTypes(Request $request)
    {
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        $errorMessages = [];
        
        // Límites de tamaño en bytes
        $maxSizeLogo = 1 * 1024 * 1024; // 1 MB para logo
        $maxSizeFotografias = 3 * 1024 * 1024; // 3 MB para fotografías
        $maxSizeCertificaciones = 1 * 1024 * 1024; // 1 MB para certificaciones

        // Límites de archivos por tipo
        $maxFiles = [
            'logo' => 1,
            'fotografias' => 3,
            'certificaciones' => 10,
            'productos' => 1 // Por producto
        ];

        // Validar logo
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            if (!in_array($logo->getMimeType(), $allowedTypes)) {
                $errorMessages[] = 'El logo debe ser un archivo de tipo: jpg, jpeg o png.';
            }

            // Validar tamaño del logo
            if ($logo->getSize() > $maxSizeLogo) {
                $errorMessages[] = 'El logo no debe exceder 1 MB de tamaño.';
            }

            // El logo ya está limitado a 1 por la estructura del formulario
        }

        // Validar fotografías
        if ($request->hasFile('fotografias')) {
            $fotografias = $request->file('fotografias');

            // Validar cantidad máxima
            if (count($fotografias) > $maxFiles['fotografias']) {
                $errorMessages[] = "Solo puede subir un máximo de {$maxFiles['fotografias']} fotografías.";
            }

            // Validar tipos de archivo y tamaño
            foreach ($fotografias as $index => $foto) {
                if (!in_array($foto->getMimeType(), $allowedTypes)) {
                    $errorMessages[] = "La fotografía #{$index} debe ser un archivo de tipo: jpg, jpeg o png.";
                }

                // Validar tamaño
                if ($foto->getSize() > $maxSizeFotografias) {
                    $errorMessages[] = "La fotografía #{$index} no debe exceder los 3 MB de tamaño.";
                }
            }
        }

        // Validar certificaciones
        if ($request->hasFile('certificaciones')) {
            $certificaciones = $request->file('certificaciones');

            // Validar cantidad máxima
            if (count($certificaciones) > $maxFiles['certificaciones']) {
                $errorMessages[] = "Solo puede subir un máximo de {$maxFiles['certificaciones']} certificaciones.";
            }

            // Validar tipos de archivo y tamaño
            foreach ($certificaciones as $index => $cert) {
                if (!in_array($cert->getMimeType(), $allowedTypes)) {
                    $errorMessages[] = "La certificación #{$index} debe ser un archivo de tipo: jpg, jpeg o png.";
                }

                // Validar tamaño
                if ($cert->getSize() > $maxSizeCertificaciones) {
                    $errorMessages[] = "La certificación #{$index} no debe exceder 1 MB de tamaño.";
                }
            }
        }

        // Validar imágenes de productos
        if ($request->has('productos')) {
            foreach ($request->productos as $index => $producto) {
                $imagenKey = "productos.{$index}.imagen";
                if ($request->hasFile($imagenKey)) {
                    $imagen = $request->file($imagenKey);
                    if (!in_array($imagen->getMimeType(), $allowedTypes)) {
                        $errorMessages[] = "La imagen del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png.";
                    }

                    // Validar tamaño
                    if ($imagen->getSize() > $maxSizeFotografias) {
                        $errorMessages[] = "La imagen del producto '{$producto['nombre']}' no debe exceder los 3 MB de tamaño.";
                    }

                    // Cada producto solo puede tener 1 imagen, lo cual ya está controlado por la estructura del formulario
                }
            }
        }

        // Si hay errores, lanzar excepción
        if (!empty($errorMessages)) {
            throw new \Exception(implode("\n", $errorMessages));
        }
    }

    public function uploadLogo(Request $request)
    {
        try {
            // Validar tipos de archivos permitidos para el logo
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            $maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
            $errores = [];

            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');

                // Validar tipo
                if (!in_array($logo->getMimeType(), $allowedTypes)) {
                    $errores[] = 'El logo debe ser un archivo de tipo: jpg, jpeg o png.';
                    
                    // Si hay un logo existente, lo devolvemos
                    if ($request->has('logo_existente')) {
                        return response()->json([
                            'success' => true,
                            'path' => $request->logo_existente,
                            'url' => asset('storage/' . $request->logo_existente),
                            'warnings' => $errores
                        ]);
                    }
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'El logo debe ser un archivo de tipo: jpg, jpeg o png.',
                        'errors' => ['logo' => ['El logo debe ser un archivo de tipo: jpg, jpeg o png.']]
                    ], 422);
                }

                // Validar tamaño
                if ($logo->getSize() > $maxSizeInBytes) {
                    $errores[] = 'El logo no debe exceder 1 MB de tamaño.';
                    
                    // Si hay un logo existente, lo devolvemos
                    if ($request->has('logo_existente')) {
                        return response()->json([
                            'success' => true,
                            'path' => $request->logo_existente,
                            'url' => asset('storage/' . $request->logo_existente),
                            'warnings' => $errores
                        ]);
                    }
                    
                    return response()->json([
                        'success' => false,
                        'message' => 'El logo no debe exceder 1 MB de tamaño.',
                        'errors' => ['logo' => ['El logo no debe exceder 1 MB de tamaño.']]
                    ], 422);
                }

                $companyId = Auth::user()->company_id;
                $company = Company::find($companyId);
                // Crear directorio si no existe
                $companySlug = Str::slug($company->name);
                Storage::disk('public')->makeDirectory("companies/{$companyId}/logos");

                try {
                    // Guardar el logo
                    $logoPath = $logo->storeAs(
                        "companies/{$companyId}/logos",
                        time() . '_' . $logo->getClientOriginalName(),
                        'public'
                    );

                    return response()->json([
                        'success' => true,
                        'path' => $logoPath,
                        'url' => asset('storage/' . $logoPath)
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error al guardar el logo: ' . $e->getMessage());
                    $errores[] = 'Error al guardar el logo: ' . $e->getMessage();
                    
                    // Si hay un logo existente, lo devolvemos
                    if ($request->has('logo_existente')) {
                        return response()->json([
                            'success' => true,
                            'path' => $request->logo_existente,
                            'url' => asset('storage/' . $request->logo_existente),
                            'warnings' => $errores
                        ]);
                    }
                    
                    throw $e; // Relanzar la excepción para que sea capturada por el catch exterior
                }
            } else if ($request->has('logo_existente')) {
                // Mantener el logo existente
                return response()->json([
                    'success' => true,
                    'path' => $request->logo_existente,
                    'url' => asset('storage/' . $request->logo_existente)
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se ha proporcionado ningún logo.'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al subir el logo: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el logo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadFotografias(Request $request)
    {
        try {
            // Validar tipos de archivos permitidos para fotografías
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            $maxSizeInBytes = 3 * 1024 * 1024; // 3 MB
            $companyId = Auth::user()->company_id;
            $company = Company::find($companyId);
            // Crear directorio si no existe
            $companySlug = Str::slug($company->name);
            Storage::disk('public')->makeDirectory("companies/{$companyId}/photos");

            $fotografiasPaths = [];
            $errores = [];

            // Primero, agregar las fotografías existentes si se enviaron
            if ($request->has('fotografias_existentes')) {
                $existingPhotos = json_decode($request->fotografias_existentes, true);
                if (is_array($existingPhotos)) {
                    $fotografiasPaths = array_merge($fotografiasPaths, $existingPhotos);
                }
            }

            // Luego, agregar las nuevas fotografías
            if ($request->hasFile('fotografias')) {
                foreach ($request->file('fotografias') as $index => $foto) {
                    try {
                        // Validar tipo
                        if (!in_array($foto->getMimeType(), $allowedTypes)) {
                            $errores[] = "La fotografía #{$index} debe ser un archivo de tipo: jpg, jpeg o png.";
                            continue;
                        }

                        // Validar tamaño
                        if ($foto->getSize() > $maxSizeInBytes) {
                            $errores[] = "La fotografía #{$index} no debe exceder los 3 MB de tamaño.";
                            continue;
                        }

                        $path = $foto->storeAs(
                            "companies/{$companyId}/photos",
                            time() . '_' . $foto->getClientOriginalName(),
                            'public'
                        );
                        $fotografiasPaths[] = $path;
                    } catch (\Exception $e) {
                        Log::error("Error al procesar la fotografía #{$index}:", [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        $errores[] = "Error al procesar la fotografía #{$index}: " . $e->getMessage();
                        continue;
                    }
                }
            }

            $response = [
                'success' => true,
                'paths' => $fotografiasPaths,
                'urls' => array_map(function ($path) {
                    return asset('storage/' . $path);
                }, $fotografiasPaths)
            ];

            // Si hubo errores, incluirlos en la respuesta pero no fallar
            if (!empty($errores)) {
                $response['warnings'] = $errores;
            }

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error al subir fotografías: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar fotografías: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadCertificaciones(Request $request)
    {
        try {
            // Validar tipos de archivos permitidos para certificaciones
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            $maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
            $companyId = Auth::user()->company_id;
            $company = Company::find($companyId);
            // Crear directorio si no existe
            $companySlug = Str::slug($company->name);
            Storage::disk('public')->makeDirectory("companies/{$companyId}/certifications-fotos");

            $certificacionesPaths = [];
            $errores = [];

            // Primero, agregar las certificaciones existentes si se enviaron
            if ($request->has('certificaciones_existentes')) {
                $existingCerts = json_decode($request->certificaciones_existentes, true);
                if (is_array($existingCerts)) {
                    $certificacionesPaths = array_merge($certificacionesPaths, $existingCerts);
                }
            }

            // Luego, agregar las nuevas certificaciones
            if ($request->hasFile('certificaciones')) {
                foreach ($request->file('certificaciones') as $index => $cert) {
                    try {
                        // Validar tipo
                        if (!in_array($cert->getMimeType(), $allowedTypes)) {
                            $errores[] = "La certificación #{$index} debe ser un archivo de tipo: jpg, jpeg, png o pdf.";
                            continue;
                        }

                        // Validar tamaño
                        if ($cert->getSize() > $maxSizeInBytes) {
                            $errores[] = "La certificación #{$index} no debe exceder 1 MB de tamaño.";
                            continue;
                        }

                        $path = $cert->storeAs(
                            "companies/{$companyId}/certifications-fotos",
                            time() . '_' . $cert->getClientOriginalName(),
                            'public'
                        );
                        $certificacionesPaths[] = $path;
                    } catch (\Exception $e) {
                        Log::error("Error al procesar la certificación #{$index}:", [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        $errores[] = "Error al procesar la certificación #{$index}: " . $e->getMessage();
                        continue;
                    }
                }
            }

            $response = [
                'success' => true,
                'paths' => $certificacionesPaths,
                'urls' => array_map(function ($path) {
                    return asset('storage/' . $path);
                }, $certificacionesPaths)
            ];

            // Si hubo errores, incluirlos en la respuesta pero no fallar
            if (!empty($errores)) {
                $response['warnings'] = $errores;
            }

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error al subir certificaciones: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar certificaciones: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadProductos(Request $request)
    {
        try {
            DB::beginTransaction();
            
            // Validar tipos de archivos permitidos para imágenes de productos
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            $maxSizeInBytes = 5 * 1024 * 1024; // 5 MB (mismo que fotografías)
            $companyId = Auth::user()->company_id;
            $company = Company::find($companyId);
            // Obtener la info adicional de la empresa
            $infoAdicional = InfoAdicionalEmpresa::where('company_id', $companyId)->first();
            if (!$infoAdicional) {
                throw new \Exception('No se encontró la información adicional de la empresa');
            }

            // Crear directorio si no existe
            $companySlug = Str::slug($company->name);
            Storage::disk('public')->makeDirectory("companies/{$companyId}/products");

            $productos = [];
            $errores = [];
            $productosGuardados = [];

            if ($request->has('productos')) {
                foreach ($request->productos as $index => $producto) {
                    try {
                        $productoData = [
                            'company_id' => $companyId,
                            'info_adicional_empresa_id' => $infoAdicional->id,
                            'nombre' => $producto['nombre'] ?? '',
                            'descripcion' => $producto['descripcion'] ?? ''
                        ];

                        // Procesar imagen principal del producto
                        $imagenKey = "productos.{$index}.imagen";
                        if ($request->hasFile($imagenKey)) {
                            $imagen = $request->file($imagenKey);

                            // Validar tipo y tamaño
                            if (!in_array($imagen->getMimeType(), $allowedTypes)) {
                                $errores[] = "La imagen del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png.";
                                continue;
                            }

                            if ($imagen->getSize() > $maxSizeInBytes) {
                                $errores[] = "La imagen del producto '{$producto['nombre']}' no debe exceder los 3 MB de tamaño.";
                                continue;
                            }

                            // Guardar la nueva imagen
                            $imagenPath = $imagen->storeAs(
                                "companies/{$companyId}/products",
                                time() . '_' . $imagen->getClientOriginalName(),
                                'public'
                            );
                            $productoData['imagen'] = $imagenPath;
                        } elseif (isset($producto['imagen_existente'])) {
                            $productoData['imagen'] = $producto['imagen_existente'];
                        }
                        
                        // Procesar imagen adicional 1 (opcional)
                        $imagen2Key = "productos.{$index}.imagen_2";
                        if ($request->hasFile($imagen2Key)) {
                            $imagen2 = $request->file($imagen2Key);

                            // Validar tipo y tamaño
                            if (!in_array($imagen2->getMimeType(), $allowedTypes)) {
                                $errores[] = "La imagen adicional 1 del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png.";
                                continue;
                            }

                            if ($imagen2->getSize() > $maxSizeInBytes) {
                                $errores[] = "La imagen adicional 1 del producto '{$producto['nombre']}' no debe exceder los 3 MB de tamaño.";
                                continue;
                            }

                            // Guardar la nueva imagen adicional 1
                            $imagen2Path = $imagen2->storeAs(
                                "companies/{$companyId}/products",
                                time() . '_adicional1_' . $imagen2->getClientOriginalName(),
                                'public'
                            );
                            $productoData['imagen_2'] = $imagen2Path;
                        } elseif (isset($producto['imagen_2_existente'])) {
                            $productoData['imagen_2'] = $producto['imagen_2_existente'];
                        }
                        
                        // Procesar imagen adicional 2 (opcional)
                        $imagen3Key = "productos.{$index}.imagen_3";
                        if ($request->hasFile($imagen3Key)) {
                            $imagen3 = $request->file($imagen3Key);

                            // Validar tipo y tamaño
                            if (!in_array($imagen3->getMimeType(), $allowedTypes)) {
                                $errores[] = "La imagen adicional 2 del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png.";
                                continue;
                            }

                            if ($imagen3->getSize() > $maxSizeInBytes) {
                                $errores[] = "La imagen adicional 2 del producto '{$producto['nombre']}' no debe exceder los 3 MB de tamaño.";
                                continue;
                            }

                            // Guardar la nueva imagen adicional 2
                            $imagen3Path = $imagen3->storeAs(
                                "companies/{$companyId}/products",
                                time() . '_adicional2_' . $imagen3->getClientOriginalName(),
                                'public'
                            );
                            $productoData['imagen_3'] = $imagen3Path;
                        } elseif (isset($producto['imagen_3_existente'])) {
                            $productoData['imagen_3'] = $producto['imagen_3_existente'];
                        }

                        // Guardar o actualizar el producto en la base de datos
                        if (isset($producto['id'])) {
                            $productoModel = CompanyProducts::find($producto['id']);
                            if ($productoModel) {
                                // Si hay una nueva imagen principal y existe una imagen anterior, eliminar la anterior
                                if (isset($productoData['imagen']) && $productoModel->imagen && $productoModel->imagen !== $productoData['imagen']) {
                                    Storage::disk('public')->delete($productoModel->imagen);
                                }
                                
                                // Si hay una nueva imagen adicional 1 y existe una imagen anterior, eliminar la anterior
                                if (isset($productoData['imagen_2']) && $productoModel->imagen_2 && $productoModel->imagen_2 !== $productoData['imagen_2']) {
                                    Storage::disk('public')->delete($productoModel->imagen_2);
                                }
                                
                                // Si hay una nueva imagen adicional 2 y existe una imagen anterior, eliminar la anterior
                                if (isset($productoData['imagen_3']) && $productoModel->imagen_3 && $productoModel->imagen_3 !== $productoData['imagen_3']) {
                                    Storage::disk('public')->delete($productoModel->imagen_3);
                                }
                                
                                $productoModel->update($productoData);
                                $productosGuardados[] = $productoModel;
                            }
                        } else {
                            $productoModel = CompanyProducts::create($productoData);
                            $productosGuardados[] = $productoModel;
                        }

                        $productos[] = array_merge(
                            $productoData,
                            ['id' => $productoModel->id]
                        );

                    } catch (\Exception $e) {
                        Log::error("Error al procesar el producto #{$index}:", [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        $errores[] = "Error al procesar el producto #{$index}: " . $e->getMessage();
                        continue;
                    }
                }
            }

            // Si hay productos guardados exitosamente, hacer commit
            if (count($productosGuardados) > 0) {
                DB::commit();
                
                // Cargar las URLs de las imágenes para cada producto
                $productosConUrls = collect($productosGuardados)->map(function ($producto) {
                    $data = $producto->toArray();
                    
                    // Añadir URLs para las imágenes
                    if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                        $data['imagen_url'] = asset('storage/' . $producto->imagen);
                    }
                    
                    if ($producto->imagen_2 && Storage::disk('public')->exists($producto->imagen_2)) {
                        $data['imagen_2_url'] = asset('storage/' . $producto->imagen_2);
                    }
                    
                    if ($producto->imagen_3 && Storage::disk('public')->exists($producto->imagen_3)) {
                        $data['imagen_3_url'] = asset('storage/' . $producto->imagen_3);
                    }
                    
                    return $data;
                })->toArray();
                
                $response = [
                    'success' => true,
                    'message' => 'Productos guardados correctamente',
                    'productos' => $productosConUrls,
                    'warnings' => empty($errores) ? null : $errores
                ];
                
                return response()->json($response);
            } else {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo guardar ningún producto',
                    'errors' => $errores
                ], 422);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al subir productos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar productos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateFormSended(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $companyId)->first();
        $autoEvaluationResult->form_sended = 1;
        $autoEvaluationResult->save();
    }

    public function deleteProductImage(Request $request)
    {
        try {
            $user = Auth::user();
            $productId = $request->product_id;
            $imageType = $request->image_type; // 'imagen', 'imagen_2', 'imagen_3'

            $product = CompanyProducts::where('id', $productId)
                ->where('company_id', $user->company_id)
                ->first();

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
            }

            // Verificar que la imagen existe
            if (!$product->$imageType || !Storage::disk('public')->exists($product->$imageType)) {
                return response()->json(['success' => false, 'message' => 'Imagen no encontrada'], 404);
            }

            // Eliminar el archivo
            Storage::disk('public')->delete($product->$imageType);

            // Actualizar el registro en la base de datos
            $product->update([$imageType => null]);

            return response()->json([
                'success' => true, 
                'message' => 'Imagen eliminada correctamente',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar imagen del producto:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la imagen: ' . $e->getMessage()
            ], 500);
        }
    }

    private function regenerateEvaluationDocument($company, $user)
    {
        try {
            // Crear estructura de carpetas para la empresa
            $companySlug = Str::slug($company->name);
            $basePath = storage_path('app/public/companies');
            $companyPath = "{$basePath}/{$company->id}/evaluations";

            // Eliminar todos los PDFs anteriores de evaluación
            if (file_exists($companyPath)) {
                $files = glob($companyPath . "/evaluation_{$company->id}_{$companySlug}_*.pdf");
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                    }
                }
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
            $finalScores = EvaluationValueResult::where('company_id', $company->id)
                ->get()
                ->keyBy('value_id');

            // Obtener todas las evaluaciones del evaluador para esta empresa
            $evaluatorAssessments = EvaluatorAssessment::where('company_id', $company->id)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de la empresa
            $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $company->id)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de autoevaluación
            $autoEvaluationAnswers = \App\Models\IndicatorAnswer::where('company_id', $company->id)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Agrupar indicadores por valor
            $indicatorsByValue = Indicator::where('is_active', true)
                ->with(['subcategory.value', 'evaluationQuestions'])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            // Generar nuevo PDF
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

            $finalEvaluationPath = "companies/{$company->id}/evaluations/{$fileName}";

            // Actualizar la ruta del documento en la empresa
            $company->evaluation_document_path = $finalEvaluationPath;
            $company->save();

            Log::info('PDFs anteriores eliminados y nuevo PDF generado', [
                'company_id' => $company->id,
                'new_path' => $finalEvaluationPath
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error al regenerar el documento de evaluación:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }
}

