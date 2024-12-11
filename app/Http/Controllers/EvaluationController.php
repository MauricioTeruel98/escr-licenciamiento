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
        $valueData = Value::with(['subcategories.indicators.evaluationQuestions'])
            ->findOrFail($value_id);

        return Inertia::render('Dashboard/Evaluacion/Evaluacion', [
            'valueData' => $valueData,
            'userName' => auth()->user()->name
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