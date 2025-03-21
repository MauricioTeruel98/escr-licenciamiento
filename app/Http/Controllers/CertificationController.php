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
        ]);

        try {
            $company = Auth::user()->company;
            
            // Verificar si ya existe una certificación con el mismo nombre para esta empresa
            $existingCertification = $company->certifications()
                ->where('nombre', $validated['nombre'])
                ->first();
            
            if ($existingCertification) {
                return response()->json([
                    'error' => 'Ya existe una certificación con este nombre para su empresa'
                ], 422);
            }
            
            // Obtener el número de indicadores homologados para esta certificación
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
                'organismo_certificador' => $validated['organismo_certificador']
            ]);

            $certification->refresh();

            return response()->json([
                'certification' => $certification,
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
        ]);

        try {
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
} 