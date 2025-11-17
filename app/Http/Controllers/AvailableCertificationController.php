<?php

namespace App\Http\Controllers;

use App\Models\AvailableCertification;
use Illuminate\Http\Request;

class AvailableCertificationController extends Controller
{
    public function index(Request $request)
    {
        $query = AvailableCertification::query();

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('nombre', 'like', "%{$searchTerm}%");
        }

        // Si se solicita paginación, devolver paginado
        if ($request->has('per_page') || $request->has('page')) {
            $certifications = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 10);
            return response()->json($certifications);
        }

        // Si no se solicita paginación, devolver array simple
        $certifications = $query->orderBy('nombre', 'asc')->get();
        return response()->json($certifications);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:available_certifications',
            'tipo' => 'nullable|string|in:' . implode(',', array_keys(AvailableCertification::TIPOS)),
            'activo' => 'boolean'
        ]);

        $certification = AvailableCertification::create($request->all());

        return response()->json([
            'message' => 'Homologación creada exitosamente',
            'certification' => $certification
        ], 201);
    }

    public function update(Request $request, AvailableCertification $certification)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:available_certifications,nombre,' . $certification->id,
            'tipo' => 'nullable|string|in:' . implode(',', array_keys(AvailableCertification::TIPOS)),
            'activo' => 'boolean'
        ]);

        $certification->update($request->all());

        return response()->json([
            'message' => 'Homologación actualizada exitosamente',
            'certification' => $certification
        ]);
    }

    public function destroy(AvailableCertification $certification)
    {
        $certification->delete();
        return response()->json(['message' => 'Homologación eliminada exitosamente']);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:available_certifications,id'
            ]);

            $count = AvailableCertification::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => "{$count} homologaciones eliminadas exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar las homologaciones: ' . $e->getMessage()
            ], 500);
        }
    }
} 