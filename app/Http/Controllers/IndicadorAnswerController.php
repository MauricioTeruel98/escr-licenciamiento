<?php

namespace App\Http\Controllers;

use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationResult;
use App\Models\AutoEvaluationValorResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class IndicadorAnswerController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            
            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            // Guardar respuestas individuales
            foreach ($request->answers as $indicatorId => $answer) {
                IndicatorAnswer::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'company_id' => $user->company_id,
                        'indicator_id' => $indicatorId,
                    ],
                    ['answer' => $answer]
                );
            }

            // Calcular notas por subcategoría
            $subcategoryScores = $this->calculateSubcategoryScores($request->value_id, $user->company_id);
            
            // Guardar resultados por subcategoría
            foreach ($subcategoryScores as $subcategoryId => $score) {
                AutoEvaluationValorResult::updateOrCreate(
                    [
                        'company_id' => $user->company_id,
                        'value_id' => $request->value_id,
                        'subcategory_id' => $subcategoryId,
                    ],
                    [
                        'nota' => $score,
                        'fecha_evaluacion' => now()
                    ]
                );
            }

            // Calcular y guardar nota final del valor
            $finalScore = round(collect($subcategoryScores)->avg());
            
            AutoEvaluationResult::updateOrCreate(
                [
                    'company_id' => $user->company_id,
                ],
                [
                    'nota' => $finalScore,
                    'status' => 'completed',
                    'fecha_aprobacion' => now()
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => '¡Respuestas guardadas exitosamente!',
                'finalScore' => $finalScore
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar respuestas:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar las respuestas: ' . $e->getMessage()
            ], 422);
        }
    }

    private function calculateSubcategoryScores($valueId, $companyId)
    {
        // Obtener todas las respuestas para los indicadores del valor
        $answers = DB::table('indicator_answers as ia')
            ->join('indicators as i', 'ia.indicator_id', '=', 'i.id')
            ->join('subcategories as s', 'i.subcategory_id', '=', 's.id')
            ->where('ia.company_id', $companyId)
            ->where('s.value_id', $valueId)
            ->select('s.id as subcategory_id', 'ia.answer')
            ->get();

        // Agrupar por subcategoría y calcular porcentaje
        $scores = [];
        foreach ($answers as $answer) {
            if (!isset($scores[$answer->subcategory_id])) {
                $scores[$answer->subcategory_id] = [
                    'total' => 0,
                    'positive' => 0
                ];
            }
            $scores[$answer->subcategory_id]['total']++;
            if ($answer->answer == 1) { // Asumiendo que 1 representa "sí"
                $scores[$answer->subcategory_id]['positive']++;
            }
        }

        // Calcular porcentaje por subcategoría
        return array_map(function($subcategoryStats) {
            if ($subcategoryStats['total'] === 0) return 0;
            return round(($subcategoryStats['positive'] / $subcategoryStats['total']) * 100);
        }, $scores);
    }
}
