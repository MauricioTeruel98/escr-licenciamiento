<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use App\Models\Value;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubcategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Subcategory::with('value');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('subcategories.name', 'like', "%{$searchTerm}%")
                  ->orWhereHas('value', function($valueQuery) use ($searchTerm) {
                      $valueQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Primero ordenar por value_id y luego por order de forma descendente
        $query->orderBy('value_id')->orderBy('order', 'desc');

        $perPage = $request->input('per_page', 10);
        $subcategories = $query->paginate($perPage);

        return response()->json($subcategories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'is_active' => 'boolean'
        ]);

        // Obtener el máximo valor de orden para las subcategorías del mismo valor
        $maxOrder = Subcategory::where('value_id', $request->value_id)->max('order') ?? 0;
        
        // Crear la subcategoría con un orden mayor (para que aparezca al principio en orden descendente)
        $data = $request->all();
        $data['order'] = $maxOrder + 1;
        
        $subcategory = Subcategory::create($data);

        return response()->json([
            'message' => 'Subcategoría creada exitosamente',
            'subcategory' => $subcategory
        ], 201);
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'is_active' => 'boolean'
        ]);

        // Si el value_id ha cambiado, asignar un nuevo orden
        if ($request->value_id != $subcategory->value_id) {
            // Obtener el máximo valor de orden para las subcategorías del nuevo valor
            $maxOrder = Subcategory::where('value_id', $request->value_id)->max('order') ?? 0;
            $request->merge(['order' => $maxOrder + 1]);
        } else {
            // Mantener el orden actual
            $request->merge(['order' => $subcategory->order]);
        }

        $subcategory->update($request->all());

        return response()->json([
            'message' => 'Subcategoría actualizada exitosamente',
            'subcategory' => $subcategory
        ]);
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();
        return response()->json(['message' => 'Subcategoría eliminada exitosamente']);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:subcategories,id'
            ]);

            $count = Subcategory::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => "{$count} subcategorías eliminadas exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar las subcategorías: ' . $e->getMessage()
            ], 500);
        }
    }
} 