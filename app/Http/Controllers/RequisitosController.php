<?php

namespace App\Http\Controllers;

use App\Models\Requisitos;
use App\Models\Subcategory;
use App\Models\Value;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequisitosController extends Controller
{
    public function index(Request $request)
    {
        $query = Requisitos::with(['value', 'subcategory']);

        if ($request->has('search')) {
            $searchTerm = $request->search;
            //$query->where('name', 'like', "%{$searchTerm}%");
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhereHas('value', function($valueQuery) use ($searchTerm) {
                      $valueQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $requisitos = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($requisitos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'is_active' => 'boolean'
        ]);

        $requisito = Requisitos::create($request->all());

        return response()->json([
            'message' => 'Requisito creado exitosamente',
            'requisito' => $requisito
        ], 201);
    }

    public function update(Request $request, Requisitos $requisito)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'is_active' => 'boolean'
        ]);

        $requisito->update($request->all());

        return response()->json([
            'message' => 'Requisito actualizado exitosamente',
            'requisito' => $requisito
        ]);
    }

    public function destroy(Requisitos $requisito)
    {
        if ($requisito->indicators()->count() > 0) {
            return response()->json([
                'error' => 'No se puede eliminar el requisito porque tiene indicadores asociados'
            ], 422);
        }

        $requisito->delete();
        return response()->json(['message' => 'Requisito eliminado exitosamente']);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:requisitos,id'
            ]);

            // Verificar si algún requisito tiene indicadores asociados
            $requisitosConIndicadores = Requisitos::whereIn('id', $request->ids)
                ->withCount('indicators')
                ->having('indicators_count', '>', 0)
                ->get();

            if ($requisitosConIndicadores->isNotEmpty()) {
                return response()->json([
                    'error' => 'No se pueden eliminar algunos requisitos porque tienen indicadores asociados'
                ], 422);
            }

            $count = Requisitos::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => "{$count} requisitos eliminados exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar los requisitos: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getSubcategories(Request $request)
    {
        try {
            $valueId = $request->query('value_id');
            $subcategories = Subcategory::where('is_active', true)
                ->when($valueId, function ($query, $valueId) {
                    return $query->where('value_id', $valueId);
                })
                ->orderBy('name')
                ->get(['id', 'name', 'value_id']);

            return response()->json($subcategories);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las subcategorías: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRequisitosBySubcategory($subcategoryId)
    {
        $requisitos = Requisitos::where('subcategory_id', $subcategoryId)
            ->where('is_active', true)
            ->get(['id', 'name']);

        return response()->json($requisitos);
    }
}
