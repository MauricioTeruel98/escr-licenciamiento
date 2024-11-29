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
            $query->where('name', 'like', "%{$searchTerm}%");
        }

        $subcategories = $query->orderBy('created_at', 'desc')->paginate(10);

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

        $subcategory = Subcategory::create($request->all());

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