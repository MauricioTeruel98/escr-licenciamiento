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
            // Validar tipos de archivos permitidos
            $this->validateFileTypes($request);
            
            DB::beginTransaction();

            $companyId = Auth::user()->company_id;
            
            // Log para depuración
            Log::info('Iniciando proceso de guardado', [
                'request_files' => $request->allFiles(),
                'has_productos' => $request->has('productos'),
                'productos_data' => $request->productos
            ]);

            // Crear directorios si no existen
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/logos");
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/fotografias");
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/certificaciones");
            Storage::disk('public')->makeDirectory("empresas/{$companyId}/productos");
            
            // Procesar datos básicos
            $allData = $request->except(['logo', 'fotografias', 'certificaciones', 'productos']);
            
            // Convertir valores booleanos a 1 o 0
            $allData['es_exportadora'] = filter_var($allData['es_exportadora'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $allData['recomienda_marca_pais'] = filter_var($allData['recomienda_marca_pais'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            
            $allData['company_id'] = $companyId;

            // Procesar logo
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $logoPath = $logo->storeAs(
                    "empresas/{$companyId}/logos",
                    time() . '_' . $logo->getClientOriginalName(),
                    'public'
                );
                $allData['logo_path'] = $logoPath;
                Log::info('Logo guardado', ['path' => $logoPath]);
            }

            // Procesar fotografías
            $fotografiasPaths = [];
            if ($request->hasFile('fotografias')) {
                foreach ($request->file('fotografias') as $foto) {
                    $path = $foto->storeAs(
                        "empresas/{$companyId}/fotografias",
                        time() . '_' . $foto->getClientOriginalName(),
                        'public'
                    );
                    $fotografiasPaths[] = $path;
                }
                $allData['fotografias_paths'] = json_encode($fotografiasPaths);
                Log::info('Fotografías guardadas', ['paths' => $fotografiasPaths]);
            }

            // Procesar certificaciones
            $certificacionesPaths = [];
            if ($request->hasFile('certificaciones')) {
                foreach ($request->file('certificaciones') as $cert) {
                    $path = $cert->storeAs(
                        "empresas/{$companyId}/certificaciones",
                        time() . '_' . $cert->getClientOriginalName(),
                        'public'
                    );
                    $certificacionesPaths[] = $path;
                }
                $allData['certificaciones_paths'] = json_encode($certificacionesPaths);
                Log::info('Certificaciones guardadas', ['paths' => $certificacionesPaths]);
            }

            // Guardar información de la empresa
            $infoAdicional = InfoAdicionalEmpresa::updateOrCreate(
                ['company_id' => $companyId],
                $allData
            );

            // Actualizar el campo form_sended en la tabla auto_evaluation_result
            DB::table('auto_evaluation_result')
                ->where('company_id', $companyId)
                ->update(['form_sended' => 1]);

            // Procesar productos
            if ($request->has('productos')) {
                Log::info('Procesando productos', ['productos' => $request->productos]);
                
                foreach ($request->productos as $index => $producto) {
                    $productoData = [
                        'company_id' => $companyId,
                        'info_adicional_empresa_id' => $infoAdicional->id,
                        'nombre' => $producto['nombre'],
                        'descripcion' => $producto['descripcion']
                    ];

                    // Procesar imagen del producto
                    $imagenKey = "productos.{$index}.imagen";
                    if ($request->hasFile($imagenKey)) {
                        $imagen = $request->file($imagenKey);
                        $imagenPath = $imagen->storeAs(
                            "empresas/{$companyId}/productos",
                            time() . '_' . $imagen->getClientOriginalName(),
                            'public'
                        );
                        $productoData['imagen'] = $imagenPath;
                        Log::info('Imagen de producto guardada', [
                            'producto_index' => $index,
                            'path' => $imagenPath
                        ]);
                    } else {
                        // Mantener la imagen existente si no se sube una nueva
                        $existingProduct = CompanyProducts::where('info_adicional_empresa_id', $infoAdicional->id)
                            ->where('nombre', $producto['nombre'])
                            ->first();
                        if ($existingProduct) {
                            $productoData['imagen'] = $existingProduct->imagen;
                        }
                    }

                    // Crear o actualizar el producto
                    CompanyProducts::updateOrCreate(
                        ['info_adicional_empresa_id' => $infoAdicional->id, 'nombre' => $producto['nombre']],
                        $productoData
                    );
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
                $responseData['fotografias_urls'] = array_map(function($path) {
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
                $responseData['certificaciones_urls'] = array_map(function($path) {
                    return [
                        'name' => basename($path),
                        'path' => $path,
                        'url' => asset('storage/' . $path),
                        'size' => Storage::disk('public')->size($path),
                        'type' => $this->getFileType(Storage::disk('public')->path($path))
                    ];
                }, $certificaciones);
            }

            $company = Company::where('id', $companyId)->first();

            // Actualizar la columna estado_eval en la tabla companies
            $company->update(['estado_eval' => 'evaluacion-pendiente']);

            $company->save();

            return response()->json([
                'success' => true,
                'message' => 'Perfil de empresa guardado exitosamente',
                'data' => $responseData
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar el perfil de la empresa:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar: ' . $e->getMessage()
            ], 422);
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
                    if ($infoAdicional->logo_path === $path) {
                        Storage::disk('public')->delete($path);
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

            return response()->json([
                'success' => true,
                'message' => 'Archivo eliminado correctamente'
            ]);

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
     */
    private function validateFileTypes(Request $request)
    {
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        $errorMessages = [];

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
            
            // El logo ya está limitado a 1 por la estructura del formulario
        }

        // Validar fotografías
        if ($request->hasFile('fotografias')) {
            $fotografias = $request->file('fotografias');
            
            // Validar cantidad máxima
            if (count($fotografias) > $maxFiles['fotografias']) {
                $errorMessages[] = "Solo puede subir un máximo de {$maxFiles['fotografias']} fotografías.";
            }
            
            // Validar tipos de archivo
            foreach ($fotografias as $index => $foto) {
                if (!in_array($foto->getMimeType(), $allowedTypes)) {
                    $errorMessages[] = "La fotografía #{$index} debe ser un archivo de tipo: jpg, jpeg o png.";
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
            
            // Validar tipos de archivo
            foreach ($certificaciones as $index => $cert) {
                if (!in_array($cert->getMimeType(), $allowedTypes)) {
                    $errorMessages[] = "La certificación #{$index} debe ser un archivo de tipo: jpg, jpeg o png.";
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
                    
                    // Cada producto solo puede tener 1 imagen, lo cual ya está controlado por la estructura del formulario
                }
            }
        }

        // Si hay errores, lanzar excepción
        if (!empty($errorMessages)) {
            throw new \Exception(implode("\n", $errorMessages));
        }
    }
}
