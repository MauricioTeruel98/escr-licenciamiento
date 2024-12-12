<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;
use App\Models\Value;

class EvaluationController extends Controller 
{
    public function index($value_id)
    {
        $user = auth()->user();
        $company_id = $user->company_id;

        // Primero obtenemos los IDs de los indicadores con respuesta "Sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $company_id)
            ->where('answer', '1')
            ->pluck('indicator_id');

        $valueData = Value::with(['subcategories.indicators' => function ($query) use ($indicatorIds) {
            $query->whereIn('indicators.id', $indicatorIds);
        }, 'subcategories.indicators.evaluationQuestions'])
        ->findOrFail($value_id);

        // Para debug
        \Log::info('Indicadores encontrados:', [
            'indicator_ids' => $indicatorIds,
            'value_id' => $value_id,
            'subcategories' => $valueData->subcategories->map(function($sub) {
                return [
                    'id' => $sub->id,
                    'indicators_count' => $sub->indicators->count()
                ];
            })
        ]);

        return Inertia::render('Dashboard/Evaluacion/Evaluacion', [
            'valueData' => $valueData,
            'userName' => $user->name
        ]);
    }

    public function getIndicators()
    {
        $indicators = Indicator::with(['evaluationQuestions'])
            ->where('is_active', true)
            ->get()
            ->map(function ($indicator) {
                return [
                    'id' => $indicator->id,
                    'code' => $indicator->name,
                    'binding' => $indicator->binding,
                    'evaluation_questions' => $indicator->evaluationQuestions->map(function ($question) {
                        return [
                            'id' => $question->id,
                            'question' => $question->question
                        ];
                    })
                ];
            });

        return response()->json($indicators);
    }
}

?>