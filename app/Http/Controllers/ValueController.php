<?php

namespace App\Http\Controllers;

use App\Models\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ValueController extends Controller
{
    public function index(Request $request)
    {
        $query = Value::with('subcategories');

        // Búsqueda
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('slug', 'like', "%{$searchTerm}%");
            });
        }

        // Ordenamiento (si lo necesitas)
        $query->orderBy('created_at', 'desc');

        // Paginación
        $perPage = $request->input('per_page', 10);
        $values = $query->paginate($perPage);

        return response()->json($values);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:values',
            'minimum_score' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        $value = Value::create([
            'name' => $request->name,
            'slug' => Str::slug($request->slug),
            'minimum_score' => $request->minimum_score,
            'is_active' => $request->is_active ?? true
        ]);

        return response()->json([
            'message' => 'Valor creado exitosamente',
            'value' => $value
        ], 201);
    }

    public function update(Request $request, Value $value)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:values,slug,' . $value->id,
            'minimum_score' => 'required|integer|min:0',
            'is_active' => 'boolean'
        ]);

        $value->update([
            'name' => $request->name,
            'slug' => Str::slug($request->slug),
            'minimum_score' => $request->minimum_score,
            'is_active' => $request->is_active
        ]);

        return response()->json([
            'message' => 'Valor actualizado exitosamente',
            'value' => $value
        ]);
    }

    public function destroy(Value $value)
    {
        $value->delete();
        return response()->json([
            'message' => 'Valor eliminado exitosamente'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:values,id'
            ]);

            $count = Value::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => "{$count} valores eliminados exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar los valores: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getActiveValues()
    {
        try {
            $values = Value::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']);

            return response()->json($values);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los valores: ' . $e->getMessage()
            ], 500);
        }
    }
} 