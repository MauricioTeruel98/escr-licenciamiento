<?php

namespace App\Http\Controllers;

use App\Models\Indicator;
use App\Models\Value;
use App\Models\Subcategory;
use App\Models\AvailableCertification;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    public function index(Request $request)
    {
        $query = Indicator::with(['homologations', 'value', 'subcategory']);

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhereHas('homologations', function($q) use ($searchTerm) {
                      $q->where('nombre', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $indicators = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($indicators);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'homologation_ids' => 'required|array',
            'homologation_ids.*' => 'exists:available_certifications,id',
            'binding' => 'required|boolean',
            'self_evaluation_question' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'evaluation_questions' => 'required|array',
            'evaluation_questions.*' => 'required|string',
            'guide' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $indicator = Indicator::create([
            'name' => $request->name,
            'binding' => $request->binding,
            'self_evaluation_question' => $request->self_evaluation_question,
            'value_id' => $request->value_id,
            'subcategory_id' => $request->subcategory_id,
            'evaluation_questions' => $request->evaluation_questions,
            'guide' => $request->guide,
            'is_active' => $request->is_active ?? true,
        ]);

        $indicator->homologations()->attach($request->homologation_ids);

        $indicator->load(['homologations', 'value', 'subcategory']);

        return response()->json([
            'message' => 'Indicador creado exitosamente',
            'indicator' => $indicator
        ], 201);
    }

    public function update(Request $request, Indicator $indicator)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'homologation_ids' => 'required|array',
            'homologation_ids.*' => 'exists:available_certifications,id',
            'binding' => 'required|boolean',
            'self_evaluation_question' => 'nullable|string',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'evaluation_questions' => 'required|array',
            'evaluation_questions.*' => 'required|string',
            'guide' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $indicator->update([
            'name' => $request->name,
            'binding' => $request->binding,
            'self_evaluation_question' => $request->self_evaluation_question,
            'value_id' => $request->value_id,
            'subcategory_id' => $request->subcategory_id,
            'evaluation_questions' => $request->evaluation_questions,
            'guide' => $request->guide,
            'is_active' => $request->is_active ?? true,
        ]);

        $indicator->homologations()->sync($request->homologation_ids);

        $indicator->load(['homologations', 'value', 'subcategory']);

        return response()->json([
            'message' => 'Indicador actualizado exitosamente',
            'indicator' => $indicator
        ]);
    }

    public function destroy(Indicator $indicator)
    {
        $indicator->delete();
        return response()->json(['message' => 'Indicador eliminado exitosamente']);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:indicators,id'
            ]);

            $count = Indicator::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => "{$count} indicadores eliminados exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar los indicadores: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRelatedData()
    {
        $values = Value::where('is_active', true)->get(['id', 'name']);
        $subcategories = Subcategory::where('is_active', true)->get(['id', 'name']);
        $homologations = AvailableCertification::where('activo', true)->get(['id', 'nombre']);

        return response()->json([
            'values' => $values,
            'subcategories' => $subcategories,
            'homologations' => $homologations
        ]);
    }

    public function getSubcategoriesByValue($valueId)
    {
        $subcategories = Subcategory::where('value_id', $valueId)
            ->where('is_active', true)
            ->get(['id', 'name']);

        return response()->json($subcategories);
    }
}