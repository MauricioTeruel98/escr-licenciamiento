<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\AvailableCertification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CertificationController extends Controller
{
    use AuthorizesRequests;

    public function create()
    {
        $certifications = auth()->user()->company->certifications()
            ->orderBy('created_at', 'desc')
            ->get();
            
        $availableCertifications = AvailableCertification::pluck('nombre');

        return Inertia::render('Dashboard/Certifications/Create', [
            'certifications' => $certifications,
            'availableCertifications' => $availableCertifications
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
        ]);

        $certification = auth()->user()->company->certifications()->create([
            ...$validated,
            'indicadores' => rand(1, 5) // Temporal, ajustar según lógica real
        ]);

        $certification->refresh();

        return response()->json($certification);
    }

    public function update(Request $request, Certification $certification)
    {
        $this->authorize('update', $certification);

        $validated = $request->validate([
            'fecha_obtencion' => 'required|date_format:Y-m-d',
            'fecha_expiracion' => 'required|date_format:Y-m-d|after:fecha_obtencion',
        ]);

        $certification->update($validated);

        return response()->json($certification);
    }

    public function destroy(Certification $certification)
    {
        $this->authorize('delete', $certification);
        
        $certification->delete();

        return response()->json(['message' => 'Certificación eliminada exitosamente']);
    }
} 