<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\InfoAdicionalEmpresa;
use App\Models\CompanyProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

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
            $allData = $request->except(['productos_data', 'logo_path', 'fotografias_paths', 'certificaciones_paths', 'provincia', 'canton', 'distrito']);

            // Convertir valores booleanos a 1 o 0
            $allData['es_exportadora'] = filter_var($allData['es_exportadora'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $allData['recomienda_marca_pais'] = filter_var($allData['recomienda_marca_pais'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

            $allData['company_id'] = $companyId;

            // Obtener información adicional existente
            $infoExistente = InfoAdicionalEmpresa::where('company_id', $companyId)->first();

            // Procesar datos de ubicación (provincia, cantón y distrito)
            $companyData = [];

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
                Log::info('Datos de ubicación actualizados en la tabla companies', $companyData);
            }

            // Procesar logo
            if ($request->has('logo_path')) {
                $allData['logo_path'] = $request->logo_path;
            } else if ($infoExistente && $infoExistente->logo_path) {
                // Si no se envió ningún logo pero existe uno en la base de datos, mantenerlo
                $allData['logo_path'] = $infoExistente->logo_path;
            }

            // Procesar fotografías
            if ($request->has('fotografias_paths')) {
                $allData['fotografias_paths'] = $request->fotografias_paths;
            } else if ($infoExistente && $infoExistente->fotografias_paths) {
                // Si no se enviaron fotografías pero existen en la base de datos, mantenerlas
                $allData['fotografias_paths'] = $infoExistente->fotografias_paths;
            }

            // Procesar certificaciones
            if ($request->has('certificaciones_paths')) {
                $allData['certificaciones_paths'] = $request->certificaciones_paths;
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
                'cantidad_otros',
                'es_exportadora',
                'provincia',
                'actividad_comercial',
                'razon_licenciamiento_es',
                'razon_licenciamiento_en',
                'proceso_licenciamiento',
                'recomienda_marca_pais',
                'observaciones',
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
            if ($formularioCompleto) {
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
            }

            // Procesar productos
            if ($request->has('productos_data')) {
                $productos = json_decode($request->productos_data, true);

                if (is_array($productos)) {
                    foreach ($productos as $producto) {
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
                    }
                }
            }

            DB::commit();

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
        $maxSizeInBytes = 2 * 1024 * 1024; // 2 MB en bytes

        // Límites de archivos por tipo
        $maxFiles = [
            'logo' => 1,
            'fotografias' => 3,
            'certificaciones' => 5,
            'productos' => 1 // Por producto
        ];

        // Validar logo
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');
            if (!in_array($logo->getMimeType(), $allowedTypes)) {
                $errorMessages[] = 'El logo debe ser un archivo de tipo: jpg, jpeg o png.';
            }

            // Validar tamaño del logo
            if ($logo->getSize() > $maxSizeInBytes) {
                $errorMessages[] = 'El logo no debe exceder los 2 MB de tamaño.';
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
                if ($foto->getSize() > $maxSizeInBytes) {
                    $errorMessages[] = "La fotografía #{$index} no debe exceder los 2 MB de tamaño.";
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
                if ($cert->getSize() > $maxSizeInBytes) {
                    $errorMessages[] = "La certificación #{$index} no debe exceder los 2 MB de tamaño.";
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
                    if ($imagen->getSize() > $maxSizeInBytes) {
                        $errorMessages[] = "La imagen del producto '{$producto['nombre']}' no debe exceder los 2 MB de tamaño.";
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
            $maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');

                // Validar tipo
                if (!in_array($logo->getMimeType(), $allowedTypes)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El logo debe ser un archivo de tipo: jpg, jpeg o png.',
                        'errors' => ['logo' => ['El logo debe ser un archivo de tipo: jpg, jpeg o png.']]
                    ], 422);
                }

                // Validar tamaño
                if ($logo->getSize() > $maxSizeInBytes) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El logo no debe exceder los 2 MB de tamaño.',
                        'errors' => ['logo' => ['El logo no debe exceder los 2 MB de tamaño.']]
                    ], 422);
                }

                $companyId = Auth::user()->company_id;

                // Crear directorio si no existe
                Storage::disk('public')->makeDirectory("empresas/{$companyId}/logos");

                // Guardar el logo
                $logoPath = $logo->storeAs(
                    "empresas/{$companyId}/logos",
                    time() . '_' . $logo->getClientOriginalName(),
                    'public'
                );

                return response()->json([
                    'success' => true,
                    'path' => $logoPath,
                    'url' => asset('storage/' . $logoPath)
                ]);
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
            $maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
            $companyId = Auth::user()->company_id;

            // Crear directorio si no existe
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/fotografias");

            $fotografiasPaths = [];

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
                    // Validar tipo
                    if (!in_array($foto->getMimeType(), $allowedTypes)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'La fotografía debe ser un archivo de tipo: jpg, jpeg o png.',
                            'errors' => ['fotografias.' . $index => ['La fotografía debe ser un archivo de tipo: jpg, jpeg o png.']]
                        ], 422);
                    }

                    // Validar tamaño
                    if ($foto->getSize() > $maxSizeInBytes) {
                        return response()->json([
                            'success' => false,
                            'message' => 'La fotografía no debe exceder los 2 MB de tamaño.',
                            'errors' => ['fotografias.' . $index => ['La fotografía no debe exceder los 2 MB de tamaño.']]
                        ], 422);
                    }

                    $path = $foto->storeAs(
                        "empresas/{$companyId}/fotografias",
                        time() . '_' . $foto->getClientOriginalName(),
                        'public'
                    );
                    $fotografiasPaths[] = $path;
                }
            }

            return response()->json([
                'success' => true,
                'paths' => $fotografiasPaths,
                'urls' => array_map(function ($path) {
                    return asset('storage/' . $path);
                }, $fotografiasPaths)
            ]);
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
            $maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
            $companyId = Auth::user()->company_id;

            // Crear directorio si no existe
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/certificaciones");

            $certificacionesPaths = [];

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
                    // Validar tipo
                    if (!in_array($cert->getMimeType(), $allowedTypes)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'La certificación debe ser un archivo de tipo: jpg, jpeg, png o pdf.',
                            'errors' => ['certificaciones.' . $index => ['La certificación debe ser un archivo de tipo: jpg, jpeg, png o pdf.']]
                        ], 422);
                    }

                    // Validar tamaño
                    if ($cert->getSize() > $maxSizeInBytes) {
                        return response()->json([
                            'success' => false,
                            'message' => 'La certificación no debe exceder los 2 MB de tamaño.',
                            'errors' => ['certificaciones.' . $index => ['La certificación no debe exceder los 2 MB de tamaño.']]
                        ], 422);
                    }

                    $path = $cert->storeAs(
                        "empresas/{$companyId}/certificaciones",
                        time() . '_' . $cert->getClientOriginalName(),
                        'public'
                    );
                    $certificacionesPaths[] = $path;
                }
            }

            return response()->json([
                'success' => true,
                'paths' => $certificacionesPaths,
                'urls' => array_map(function ($path) {
                    return asset('storage/' . $path);
                }, $certificacionesPaths)
            ]);
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
            // Validar tipos de archivos permitidos para imágenes de productos
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            $maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
            $companyId = Auth::user()->company_id;

            // Crear directorio si no existe
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/productos");

            $productos = [];

            if ($request->has('productos')) {
                foreach ($request->productos as $index => $producto) {
                    $productoData = [
                        'id' => $producto['id'] ?? null,
                        'nombre' => $producto['nombre'] ?? '',
                        'descripcion' => $producto['descripcion'] ?? ''
                    ];

                    // Procesar imagen del producto
                    $imagenKey = "productos.{$index}.imagen";
                    if ($request->hasFile($imagenKey)) {
                        $imagen = $request->file($imagenKey);

                        // Validar tipo
                        if (!in_array($imagen->getMimeType(), $allowedTypes)) {
                            return response()->json([
                                'success' => false,
                                'message' => "La imagen del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png.",
                                'errors' => [$imagenKey => ["La imagen del producto '{$producto['nombre']}' debe ser un archivo de tipo: jpg, jpeg o png."]]
                            ], 422);
                        }

                        // Validar tamaño
                        if ($imagen->getSize() > $maxSizeInBytes) {
                            return response()->json([
                                'success' => false,
                                'message' => "La imagen del producto '{$producto['nombre']}' no debe exceder los 2 MB de tamaño.",
                                'errors' => [$imagenKey => ["La imagen del producto '{$producto['nombre']}' no debe exceder los 2 MB de tamaño."]]
                            ], 422);
                        }

                        $imagenPath = $imagen->storeAs(
                            "empresas/{$companyId}/productos",
                            time() . '_' . $imagen->getClientOriginalName(),
                            'public'
                        );
                        $productoData['imagen'] = $imagenPath;
                    } else if (isset($producto['imagen_existente'])) {
                        // Mantener la imagen existente si se envió
                        $productoData['imagen'] = $producto['imagen_existente'];
                    }

                    $productos[] = $productoData;
                }
            }

            return response()->json([
                'success' => true,
                'productos' => $productos
            ]);
        } catch (\Exception $e) {
            Log::error('Error al subir productos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar productos: ' . $e->getMessage()
            ], 500);
        }
    }
}
