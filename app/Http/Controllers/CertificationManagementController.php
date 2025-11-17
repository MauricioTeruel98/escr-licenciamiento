<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Company;
use App\Models\AvailableCertification;
use App\Models\IndicatorHomologation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificationManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Certification::with('company')
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('organismo_certificador', 'like', "%{$search}%")
                      ->orWhereHas('company', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy($request->sort_by ?? 'created_at', $request->sort_order ?? 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($query);
    }

    public function store(Request $request)
    {
        // Debug: log de datos recibidos
        Log::info('Datos recibidos en store:', [
            'all' => $request->all(),
            'has_files' => $request->hasFile('files'),
            'content_type' => $request->header('Content-Type'),
            'method' => $request->method()
        ]);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_obtencion' => 'required|date',
            'fecha_expiracion' => 'required|date|after:fecha_obtencion',
            'indicadores' => 'required|integer|min:0',
            'company_id' => 'required|exists:companies,id',
            'homologation_id' => 'required|exists:available_certifications,id',
            'organismo_certificador' => 'nullable|string|max:255',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:5120', // 5MB max
        ]);

        try {
            $company = Company::find($validated['company_id']);
            
            // Verificar si ya existe una certificación con el mismo nombre para esta empresa
            $existingCertification = $company->certifications()
                ->where('nombre', $validated['nombre'])
                ->first();
            
            if ($existingCertification) {
                return response()->json([
                    'error' => 'Ya existe una certificación con este nombre para esta empresa'
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

            $certification = Certification::create([
                'nombre' => $validated['nombre'],
                'fecha_obtencion' => $validated['fecha_obtencion'],
                'fecha_expiracion' => $validated['fecha_expiracion'],
                'indicadores' => $indicadoresCount,
                'company_id' => $validated['company_id'],
                'homologation_id' => $validated['homologation_id'],
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
                'message' => 'Certificación creada exitosamente',
                'certification' => array_merge(
                    $certification->load('company')->toArray(),
                    ['files' => $files]
                )
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear certificación:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Limpiar archivos en caso de error
            if (!empty($filePaths)) {
                foreach ($filePaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            return response()->json([
                'error' => 'Error al crear la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Certification $certification)
    {
        // Debug: log de datos recibidos
        Log::info('Datos recibidos en update:', [
            'all' => $request->all(),
            'has_files' => $request->hasFile('files'),
            'content_type' => $request->header('Content-Type'),
            'method' => $request->method()
        ]);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_obtencion' => 'required|date',
            'fecha_expiracion' => 'required|date|after:fecha_obtencion',
            'indicadores' => 'required|integer|min:0',
            'company_id' => 'required|exists:companies,id',
            'homologation_id' => 'required|exists:available_certifications,id',
            'organismo_certificador' => 'nullable|string|max:255',
        ]);

        try {
            $company = Company::find($validated['company_id']);
            
            // Verificar si ya existe otra certificación con el mismo nombre para esta empresa
            $existingCertification = $company->certifications()
                ->where('nombre', $validated['nombre'])
                ->where('id', '!=', $certification->id)
                ->first();
            
            if ($existingCertification) {
                return response()->json([
                    'error' => 'Ya existe una certificación con este nombre para esta empresa'
                ], 422);
            }

            // Procesar archivos existentes y nuevos
            $filePaths = [];
            if ($certification->file_paths) {
                $filePaths = json_decode($certification->file_paths, true) ?: [];
            }

            $totalSize = 0;
            $maxTotalSize = 15 * 1024 * 1024; // 15MB total

            // Calcular tamaño de archivos existentes
            foreach ($filePaths as $path) {
                if (file_exists(storage_path('app/public/' . $path))) {
                    $totalSize += filesize(storage_path('app/public/' . $path));
                }
            }

            // Procesar nuevos archivos
            if ($request->hasFile('files')) {
                $newFiles = [];

                foreach ($request->file('files') as $file) {
                    // Verificar tamaño total
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        // Limpiar archivos nuevos en caso de error
                        foreach ($newFiles as $newPath) {
                            Storage::disk('public')->delete($newPath);
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
                            Storage::disk('public')->delete($newPath);
                        }
                        throw $e;
                    }
                }
                
                // Agregar nuevos archivos a la lista existente
                $filePaths = array_merge($filePaths, $newFiles);
            }

            $validated['file_paths'] = json_encode($filePaths);
            $certification->update($validated);

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
                'message' => 'Certificación actualizada exitosamente',
                'certification' => array_merge(
                    $certification->load('company')->toArray(),
                    ['files' => $files]
                )
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
        try {
            // Eliminar archivos asociados
            if ($certification->file_paths) {
                $filePaths = json_decode($certification->file_paths, true) ?: [];
                foreach ($filePaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            $certification->delete();
            return response()->json([
                'message' => 'Certificación eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar certificación:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al eliminar la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:certifications,id'
        ]);

        try {
            $certifications = Certification::whereIn('id', $request->ids)->get();
            $deletedCount = 0;

            foreach ($certifications as $certification) {
                // Eliminar archivos asociados
                if ($certification->file_paths) {
                    $filePaths = json_decode($certification->file_paths, true) ?: [];
                    foreach ($filePaths as $path) {
                        Storage::disk('public')->delete($path);
                    }
                }
                $certification->delete();
                $deletedCount++;
            }

            return response()->json([
                'message' => "{$deletedCount} certificaciones eliminadas exitosamente"
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar certificaciones en lote:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Error al eliminar las certificaciones: ' . $e->getMessage()
            ], 500);
        }
    }
} 