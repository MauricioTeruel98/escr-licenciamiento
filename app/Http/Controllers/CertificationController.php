<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\AvailableCertification;
use App\Models\IndicatorHomologation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Controlador para la gestión de Certificaciones
 * 
 * Este controlador maneja todas las operaciones relacionadas con certificaciones.
 * 
 * Rutas y métodos:
 * 1. GET /certifications/create -> create()
 *    - Muestra el formulario de creación
 *    - Carga certificaciones disponibles para homologación
 * 
 * 2. POST /certifications -> store()
 *    - Valida y almacena nueva certificación
 *    - Procesa y almacena archivos adjuntos
 *    - Calcula indicadores homologados
 * 
 * 3. PUT /certifications/{id} -> update()
 *    - Actualiza datos de certificación existente
 *    - Gestiona archivos adjuntos
 * 
 * 4. DELETE /certifications/{id} -> destroy()
 *    - Elimina certificación y archivos asociados
 * 
 * 5. DELETE /certifications/{id}/files -> deleteFile()
 *    - Elimina archivo específico de una certificación
 * 
 * Validaciones y restricciones:
 * - Archivos: máximo 3 por certificación, 5MB por archivo
 * - Tipos permitidos: jpg, jpeg, png, pdf, doc, docx, xls, xlsx
 * - Tamaño total máximo: 15MB
 * - Fechas: expiración debe ser posterior a obtención
 * 
 * Se deja comentado el deleteFile para que no se borren los archivos de las certificaciones, ya que si se eliminan generan 
 * un error en la vista de la evaluación, ya que no encuentra el archivo en cada respuesta de la empresa.
 * 
 * @author: Mauricio Teruel
 * @version: 1.0
 * @since: 2025-04-03
 */
class CertificationController extends Controller
{
    use AuthorizesRequests;

    public function create()
    {
        $certifications = Auth::user()->company->certifications()
            ->orderBy('nombre', 'asc')
            ->get();
            
        $availableCertifications = AvailableCertification::select('id', 'nombre')
            ->get()
            ->map(function($cert) {
                return [
                    'id' => $cert->id,
                    'nombre' => $cert->nombre
                ];
            });

        return Inertia::render('Dashboard/Certifications/Create', [
            'certifications' => $certifications,
            'availableCertifications' => $availableCertifications
        ]);
    }

    public function store(Request $request)
    {
        set_time_limit(120); // Establecer límite de tiempo a 120 segundos

        $validated = $request->validate([
            'nombre' => 'required|string',
            'homologation_id' => 'required|exists:available_certifications,id',
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
            'organismo_certificador' => 'string',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120', // 5MB max
        ]);

        try {
            $company = Auth::user()->company;
            
            // Verificar si ya existe una certificación con el mismo nombre
            $existingCertification = $company->certifications()
                ->where('nombre', $validated['nombre'])
                ->first();
            
            if ($existingCertification) {
                return response()->json([
                    'error' => 'Ya existe una certificación con este nombre para su empresa'
                ], 422);
            }

            // Procesar los archivos
            $filePaths = [];
            $totalSize = 0;
            $maxTotalSize = 15 * 1024 * 1024; // 15MB total

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    // Verificar tamaño total
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        return response()->json([
                            'error' => 'El tamaño total de los archivos excede el límite permitido de 15MB'
                        ], 422);
                    }

                    $companySlug = Str::slug($company->name);
                    $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                        . '.' . $file->getClientOriginalExtension();

                    try {
                        $path = $file->storeAs(
                            "companies/{$company->id}/certifications",
                            $fileName,
                            'public'
                        );
                        
                        if (!$path) {
                            throw new \Exception('Error al guardar el archivo: ' . $fileName);
                        }

                        $filePaths[] = $path;
                    } catch (\Exception $e) {
                        // Limpiar archivos ya subidos en caso de error
                        foreach ($filePaths as $existingPath) {
                            //Storage::disk('public')->delete($existingPath);
                        }
                        throw $e;
                    }
                }
            }

            // Obtener el número de indicadores homologados
            $indicadoresCount = IndicatorHomologation::where('homologation_id', $validated['homologation_id'])
                ->whereHas('indicator', function ($query) use ($company) {
                    $query->where('is_active', true)
                        ->where('deleted', false)
                        ->where(function($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->count();

            $certification = $company->certifications()->create([
                'nombre' => $validated['nombre'],
                'homologation_id' => $validated['homologation_id'],
                'fecha_obtencion' => $validated['fecha_obtencion'],
                'fecha_expiracion' => $validated['fecha_expiracion'],
                'indicadores' => $indicadoresCount,
                'organismo_certificador' => $validated['organismo_certificador'],
                'file_paths' => json_encode($filePaths)
            ]);

            $certification->refresh();

            // Preparar los archivos para la respuesta
            $files = array_map(function ($path) {
                return [
                    'name' => basename($path),
                    'path' => $path,
                    'size' => file_exists(storage_path('app/public/' . $path)) ?
                        filesize(storage_path('app/public/' . $path)) : 0,
                    'type' => mime_content_type(storage_path('app/public/' . $path)) ?? 'application/octet-stream'
                ];
            }, $filePaths);

            return response()->json([
                'certification' => array_merge(
                    $certification->toArray(),
                    ['files' => $files]
                ),
                'message' => 'Certificación creada exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al crear certificación:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Limpiar archivos en caso de error
            if (!empty($filePaths)) {
                foreach ($filePaths as $path) {
                    //Storage::disk('public')->delete($path);
                }
            }

            return response()->json([
                'error' => 'Error al crear la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Certification $certification)
    {
        $this->authorize('update', $certification);

        set_time_limit(120); // Establecer límite de tiempo a 120 segundos

        $validated = $request->validate([
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
            'organismo_certificador' => 'string',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120', // 5MB max
        ]);

        try {
            // Procesar nuevos archivos si existen
            if ($request->hasFile('files')) {
                $filePaths = json_decode($certification->file_paths, true) ?? [];
                $totalSize = 0;
                $maxTotalSize = 15 * 1024 * 1024; // 15MB total

                // Calcular tamaño total actual
                foreach ($filePaths as $path) {
                    if (Storage::disk('public')->exists($path)) {
                        $totalSize += Storage::disk('public')->size($path);
                    }
                }
                
                // Verificar el límite de archivos
                if (count($filePaths) + count($request->file('files')) > 3) {
                    return response()->json([
                        'error' => 'Solo se permiten hasta 3 archivos por certificación'
                    ], 422);
                }

                $companySlug = Str::slug($certification->company->name);
                $newFiles = [];

                foreach ($request->file('files') as $file) {
                    // Verificar tamaño total
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        // Limpiar archivos nuevos en caso de error
                        foreach ($newFiles as $newPath) {
                            //Storage::disk('public')->delete($newPath);
                        }
                        return response()->json([
                            'error' => 'El tamaño total de los archivos excede el límite permitido de 15MB'
                        ], 422);
                    }

                    try {
                        $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                            . '.' . $file->getClientOriginalExtension();

                        $path = $file->storeAs(
                            "companies/{$certification->company_id}/certifications",
                            $fileName,
                            'public'
                        );
                        
                        if (!$path) {
                            throw new \Exception('Error al guardar el archivo: ' . $fileName);
                        }

                        $newFiles[] = $path;
                    } catch (\Exception $e) {
                        // Limpiar archivos nuevos en caso de error
                        foreach ($newFiles as $newPath) {
                            //Storage::disk('public')->delete($newPath);
                        }
                        throw $e;
                    }
                }
                
                // Agregar nuevos archivos a la lista existente
                $filePaths = array_merge($filePaths, $newFiles);
                $certification->file_paths = json_encode($filePaths);
            }

            $certification->update($validated);

            return response()->json([
                'certification' => $certification,
                'message' => 'Certificación actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar certificación:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al actualizar la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Certification $certification)
    {
        $this->authorize('delete', $certification);
        
        try {
            $certification->delete();
            return response()->json(['message' => 'Certificación eliminada exitosamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la certificación'], 500);
        }
    }

    public function deleteFile(Request $request, Certification $certification)
    {
        try {
            $user = Auth::user();
            $filePath = $request->file_path;

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Obtener array de archivos actual
            $files = json_decode($certification->file_paths, true) ?? [];

            // Encontrar y eliminar el archivo específico
            if (($key = array_search($filePath, $files)) !== false) {
                // Eliminar el archivo del storage
                /*if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }*/

                // Eliminar la ruta del archivo del array
                unset($files[$key]);

                // Reindexar el array y actualizar en la base de datos
                $files = array_values($files);
                $certification->file_paths = json_encode($files);
                $certification->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Archivo eliminado correctamente',
                    'files' => $files
                ]);
            }

            return response()->json(['message' => 'Archivo no encontrado'], 404);
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
} 