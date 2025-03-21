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
        $query = Indicator::with(['homologations', 'value', 'subcategory', 'evaluationQuestions' => function($query) {
            $query->where('deleted', false);
        }, 'requisito'])
            ->where('deleted', false);

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhereHas('homologations', function ($q) use ($searchTerm) {
                        $q->where('nombre', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('value', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    })
                    ->orWhereHas('subcategory', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
                    });
            });
        }

        $indicators = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($indicators);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'homologation_ids' => 'nullable|array',
            'homologation_ids.*' => 'exists:available_certifications,id',
            'binding' => 'required|boolean',
            'self_evaluation_question' => 'required|string',
            'evaluation_questions' => 'nullable|array',
            'evaluation_questions.*' => 'nullable|string',
            'guide' => 'nullable|string',
            'is_active' => 'boolean',
            'requisito_id' => 'required|exists:requisitos,id',
            'is_binary' => 'required|boolean'
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
            'requisito_id' => $request->requisito_id,
            'is_binary' => $request->is_binary
        ]);

        $indicator->homologations()->attach($request->homologation_ids);

        // Filtrar y guardar solo las preguntas no vacías
        $evaluationQuestions = $request->input('evaluation_questions', []);
        $evaluationQuestionsBinary = $request->input('evaluation_questions_binary', []);

        foreach ($evaluationQuestions as $index => $question) {
            // Verificar que la pregunta no esté vacía
            if (!empty(trim($question))) {
                $is_binary = isset($evaluationQuestionsBinary[$index]) ? $evaluationQuestionsBinary[$index] : false;
                $indicator->evaluationQuestions()->create([
                    'question' => $question,
                    'is_binary' => $is_binary
                ]);
            }
        }

        $indicator->load(['homologations', 'value', 'subcategory']);

        return response()->json([
            'message' => 'Indicador creado exitosamente',
            'indicator' => $indicator
        ], 201);
    }

    public function update(Request $request, Indicator $indicator)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'value_id' => 'required|exists:values,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'homologation_ids' => 'nullable|array',
            'homologation_ids.*' => 'exists:available_certifications,id',
            'binding' => 'required|boolean',
            'self_evaluation_question' => 'required|string',
            'evaluation_questions' => 'nullable|array',
            'evaluation_questions.*' => 'nullable|string',
            'evaluation_question_ids' => 'nullable|array',
            'evaluation_question_ids.*' => 'nullable|integer',
            'guide' => 'nullable|string',
            'is_active' => 'boolean',
            'requisito_id' => 'required|exists:requisitos,id',
            'is_binary' => 'required|boolean',
            'questions_to_delete' => 'nullable|array',
            'questions_to_delete.*' => 'exists:evaluation_questions,id'
        ]);

        // Actualizar los datos del indicador
        $indicator->update([
            'name' => $request->name,
            'binding' => $request->binding,
            'self_evaluation_question' => $request->self_evaluation_question,
            'value_id' => $request->value_id,
            'subcategory_id' => $request->subcategory_id,
            'guide' => $request->guide,
            'is_active' => $request->is_active ?? true,
            'requisito_id' => $request->requisito_id,
            'is_binary' => $request->is_binary
        ]);

        // Sincronizar homologations
        $indicator->homologations()->sync($request->homologation_ids);

        // Marcar como eliminadas las preguntas que se van a eliminar
        if ($request->has('questions_to_delete')) {
            $indicator->evaluationQuestions()
                ->whereIn('id', $request->questions_to_delete)
                ->update([
                    'deleted' => true,
                    'deleted_at' => now()
                ]);
        }

        // Procesar las preguntas existentes y nuevas
        $evaluationQuestions = $request->input('evaluation_questions', []);
        $evaluationQuestionsBinary = $request->input('evaluation_questions_binary', []);
        $evaluationQuestionIds = $request->input('evaluation_question_ids', []);

        foreach ($evaluationQuestions as $index => $question) {
            if (!empty(trim($question))) {
                $is_binary = isset($evaluationQuestionsBinary[$index]) ? $evaluationQuestionsBinary[$index] : false;
                $questionId = isset($evaluationQuestionIds[$index]) ? $evaluationQuestionIds[$index] : null;

                if ($questionId && $indicator->evaluationQuestions()->where('id', $questionId)->exists()) {
                    // Actualizar pregunta existente
                    $indicator->evaluationQuestions()->where('id', $questionId)->update([
                        'question' => $question,
                        'is_binary' => $is_binary
                    ]);
                } else {
                    // Crear nueva pregunta
                    $indicator->evaluationQuestions()->create([
                        'question' => $question,
                        'is_binary' => $is_binary,
                        'deleted' => false
                    ]);
                }
            }
        }

        // Recargar relaciones filtrando las preguntas eliminadas
        $indicator->load(['homologations', 'value', 'subcategory', 'evaluationQuestions' => function($query) {
            $query->where('deleted', false);
        }]);

        return response()->json([
            'message' => 'Indicador actualizado exitosamente',
            'indicator' => $indicator
        ]);
    }

    public function deleteEvaluationQuestion($indicatorId, $questionId)
    {
        try {
            $indicator = Indicator::findOrFail($indicatorId);
            $question = $indicator->evaluationQuestions()->findOrFail($questionId);
            
            // Implementar borrado lógico
            $question->update([
                'deleted' => true,
                'deleted_at' => now()
            ]);
            
            // Recargar el indicador con sus relaciones para devolver datos actualizados
            $indicator = Indicator::with(['homologations', 'value', 'subcategory', 'evaluationQuestions' => function($query) {
                $query->where('deleted', false);
            }, 'requisito'])
                ->findOrFail($indicatorId);
            
            return response()->json([
                'message' => 'Pregunta de evaluación eliminada exitosamente',
                'indicator' => $indicator
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar la pregunta: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Indicator $indicator)
    {
        // Marcar el indicador como eliminado
        $indicator->update([
            'deleted' => true,
            'deleted_at' => now()
        ]);

        // Marcar todas las preguntas de evaluación asociadas como eliminadas
        $indicator->evaluationQuestions()->update([
            'deleted' => true,
            'deleted_at' => now()
        ]);

        return response()->json(['message' => 'Indicador eliminado exitosamente']);
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:indicators,id'
            ]);

            // Marcar los indicadores como eliminados
            $indicators = Indicator::whereIn('id', $request->ids)->get();
            
            foreach ($indicators as $indicator) {
                $indicator->update([
                    'deleted' => true,
                    'deleted_at' => now()
                ]);

                // Marcar todas las preguntas de evaluación asociadas como eliminadas
                $indicator->evaluationQuestions()->update([
                    'deleted' => true,
                    'deleted_at' => now()
                ]);
            }

            return response()->json([
                'message' => count($request->ids) . " indicadores eliminados exitosamente"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar los indicadores: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getRelatedData()
    {
        $values = Value::where('is_active', true)
            ->where('deleted', false)
            ->get(['id', 'name']);
        $subcategories = Subcategory::where('is_active', true)
            ->where('deleted', false)
            ->get(['id', 'name']);
        $homologations = AvailableCertification::where('activo', true)
            ->get(['id', 'nombre']);

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
            ->where('deleted', false)
            ->get(['id', 'name']);

        return response()->json($subcategories);
    }
}
