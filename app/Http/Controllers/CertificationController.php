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
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $companySlug = Str::slug($company->name);
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs(
                        "companies/{$company->id}-{$companySlug}/certifications",
                        $fileName,
                        'public'
                    );
                    $filePaths[] = $path;
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

            return response()->json([
                'error' => 'Error al crear la certificación: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Certification $certification)
    {
        $this->authorize('update', $certification);

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
                $companySlug = Str::slug($certification->company->name);
                foreach ($request->file('files') as $file) {
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs(
                        "companies/{$certification->company_id}-{$companySlug}/certifications",
                        $fileName,
                        'public'
                    );
                    $filePaths[] = $path;
                }
                
                $certification->file_paths = json_encode($filePaths);
            }

            $certification->update($validated);

            return response()->json([
                'certification' => $certification,
                'message' => 'Certificación actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar la certificación'
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