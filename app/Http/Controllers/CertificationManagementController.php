<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CertificationManagementController extends Controller
{
    public function index(Request $request)
    {
        $certifications = Certification::with('company')
            ->when($request->search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%")
                      ->orWhereHas('company', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->orderBy($request->sort_by ?? 'created_at', $request->sort_order ?? 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json($certifications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_obtencion' => 'required|date',
            'fecha_expiracion' => 'required|date|after:fecha_obtencion',
            'indicadores' => 'required|integer|min:0',
            'company_id' => 'required|exists:companies,id'
        ]);

        $certification = Certification::create($validated);

        return response()->json([
            'message' => 'Certificación creada exitosamente',
            'certification' => $certification->load('company')
        ], 201);
    }

    public function update(Request $request, Certification $certification)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_obtencion' => 'required|date',
            'fecha_expiracion' => 'required|date|after:fecha_obtencion',
            'indicadores' => 'required|integer|min:0',
            'company_id' => 'required|exists:companies,id'
        ]);

        $certification->update($validated);

        return response()->json([
            'message' => 'Certificación actualizada exitosamente',
            'certification' => $certification->load('company')
        ]);
    }

    public function destroy(Certification $certification)
    {
        $certification->delete();
        return response()->json([
            'message' => 'Certificación eliminada exitosamente'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:certifications,id'
        ]);

        $count = Certification::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "{$count} certificaciones eliminadas exitosamente"
        ]);
    }
} 