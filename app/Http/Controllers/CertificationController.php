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
use Illuminate\Support\Facades\File;

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

    private function handleChunkedUpload($file, $companyId, $companySlug)
    {
        try {
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                . '.' . $file->getClientOriginalExtension();
            
            $chunkSize = 1024 * 1024; // 1MB por chunk
            $totalSize = $file->getSize();
            $chunks = ceil($totalSize / $chunkSize);
            
            $targetPath = "companies/{$companyId}-{$companySlug}/certifications/{$fileName}";
            $tempPath = storage_path('app/temp/' . uniqid() . '_' . $fileName);
            
            // Asegurarse de que el directorio temporal existe
            File::ensureDirectoryExists(dirname($tempPath));
            
            // Abrir archivo temporal para escritura
            $out = fopen($tempPath, 'wb');
            
            // Leer el archivo por chunks
            $fileHandle = fopen($file->getRealPath(), 'rb');
            
            while (!feof($fileHandle)) {
                $chunk = fread($fileHandle, $chunkSize);
                fwrite($out, $chunk);
            }
            
            fclose($fileHandle);
            fclose($out);
            
            // Mover el archivo temporal al storage público
            $success = Storage::disk('public')->putFileAs(
                dirname($targetPath),
                $tempPath,
                basename($targetPath)
            );
            
            // Limpiar archivo temporal
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }
            
            if (!$success) {
                throw new \Exception('Error al mover el archivo a su ubicación final');
            }
            
            return $targetPath;
        } catch (\Exception $e) {
            // Limpiar archivo temporal si existe
            if (isset($tempPath) && file_exists($tempPath)) {
                unlink($tempPath);
            }
            throw $e;
        }
    }

    public function store(Request $request)
    {
        set_time_limit(300); // Aumentar a 5 minutos para archivos grandes
        
        $validated = $request->validate([
            'nombre' => 'required|string',
            'homologation_id' => 'required|exists:available_certifications,id',
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
            'organismo_certificador' => 'string',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:15360', // 15MB max
        ]);

        try {
            $company = Auth::user()->company;
            
            // Verificar certificación existente
            $existingCertification = $company->certifications()
                ->where('nombre', $validated['nombre'])
                ->first();
            
            if ($existingCertification) {
                return response()->json([
                    'error' => 'Ya existe una certificación con este nombre para su empresa'
                ], 422);
            }

            $filePaths = [];
            $totalSize = 0;
            $maxTotalSize = 45 * 1024 * 1024; // 45MB total (15MB x 3 archivos)

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    // Verificar tamaño total
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        // Limpiar archivos subidos
                        foreach ($filePaths as $path) {
                            Storage::disk('public')->delete($path);
                        }
                        return response()->json([
                            'error' => 'El tamaño total de los archivos excede el límite permitido de 45MB'
                        ], 422);
                    }

                    try {
                        $path = $this->handleChunkedUpload($file, $company->id, Str::slug($company->name));
                        $filePaths[] = $path;
                    } catch (\Exception $e) {
                        // Limpiar archivos subidos en caso de error
                        foreach ($filePaths as $existingPath) {
                            Storage::disk('public')->delete($existingPath);
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
            foreach ($filePaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'error' => 'Error al crear la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Certification $certification)
    {
        $this->authorize('update', $certification);
        set_time_limit(300); // 5 minutos para archivos grandes

        $validated = $request->validate([
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
            'organismo_certificador' => 'string',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:15360', // 15MB max
        ]);

        try {
            if ($request->hasFile('files')) {
                $filePaths = json_decode($certification->file_paths, true) ?? [];
                $totalSize = 0;
                $maxTotalSize = 45 * 1024 * 1024; // 45MB total

                // Calcular tamaño total actual
                foreach ($filePaths as $path) {
                    if (Storage::disk('public')->exists($path)) {
                        $totalSize += Storage::disk('public')->size($path);
                    }
                }

                if (count($filePaths) + count($request->file('files')) > 3) {
                    return response()->json([
                        'error' => 'Solo se permiten hasta 3 archivos por certificación'
                    ], 422);
                }

                $newFiles = [];

                foreach ($request->file('files') as $file) {
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        // Limpiar nuevos archivos
                        foreach ($newFiles as $newPath) {
                            Storage::disk('public')->delete($newPath);
                        }
                        return response()->json([
                            'error' => 'El tamaño total de los archivos excede el límite permitido de 45MB'
                        ], 422);
                    }

                    try {
                        $path = $this->handleChunkedUpload(
                            $file, 
                            $certification->company_id, 
                            Str::slug($certification->company->name)
                        );
                        $newFiles[] = $path;
                    } catch (\Exception $e) {
                        // Limpiar nuevos archivos en caso de error
                        foreach ($newFiles as $newPath) {
                            Storage::disk('public')->delete($newPath);
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
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }

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