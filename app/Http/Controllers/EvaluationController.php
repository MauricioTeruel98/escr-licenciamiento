<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;
use App\Models\Value;
use App\Models\EvaluatorAssessment;

class EvaluationController extends Controller 
{
    public function index($value_id)
    {
        $user = auth()->user();
        $company_id = $user->company_id;
        $isEvaluador = $user->role === 'evaluador';

        // Primero obtenemos los IDs de los indicadores con respuesta "Sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $company_id)
            ->where('answer', '1')
            ->pluck('indicator_id');

        $valueData = Value::with(['subcategories.indicators' => function ($query) use ($indicatorIds) {
            $query->whereIn('indicators.id', $indicatorIds);
        }, 'subcategories.indicators.evaluationQuestions'])
        ->findOrFail($value_id);

        // Obtener todas las respuestas de evaluación existentes
        $savedAnswers = \App\Models\IndicatorAnswerEvaluation::where('company_id', $company_id)
            ->get()
            ->map(function($answer) {
                $files = [];
                if ($answer->file_path) {
                    $filePaths = json_decode($answer->file_path);
                    if (is_array($filePaths)) {
                        $files = array_map(function($path) {
                            return [
                                'name' => basename($path),
                                'path' => $path,
                                'size' => file_exists(storage_path('app/public/' . $path)) ? 
                                    filesize(storage_path('app/public/' . $path)) : 0,
                                'type' => mime_content_type(storage_path('app/public/' . $path)) ?? 'application/octet-stream'
                            ];
                        }, $filePaths);
                    }
                }

                // Obtener la evaluación del evaluador para esta respuesta
                $evaluatorAssessment = EvaluatorAssessment::where('company_id', $answer->company_id)
                    ->where('evaluation_question_id', $answer->evaluation_question_id)
                    ->first();

                return [
                    'evaluation_question_id' => $answer->evaluation_question_id,
                    'indicator_id' => $answer->indicator_id,
                    'value' => $answer->answer,
                    'description' => $answer->description,
                    'files' => $files,
                    'approved' => $evaluatorAssessment ? $evaluatorAssessment->approved : null,
                    'evaluator_comment' => $evaluatorAssessment ? $evaluatorAssessment->comment : null
                ];
            })
            ->keyBy('evaluation_question_id')
            ->toArray();

        // Si es evaluador, asegurarse de que todas las evaluaciones existentes estén incluidas
        if ($isEvaluador) {
            $evaluatorAssessments = EvaluatorAssessment::where('company_id', $company_id)
                ->get();

            foreach ($evaluatorAssessments as $assessment) {
                $questionId = $assessment->evaluation_question_id;
                if (!isset($savedAnswers[$questionId])) {
                    $savedAnswers[$questionId] = [
                        'evaluation_question_id' => $questionId,
                        'indicator_id' => $assessment->indicator_id,
                        'value' => null,
                        'description' => null,
                        'files' => [],
                        'approved' => $assessment->approved,
                        'evaluator_comment' => $assessment->comment
                    ];
                } else {
                    $savedAnswers[$questionId]['approved'] = $assessment->approved;
                    $savedAnswers[$questionId]['evaluator_comment'] = $assessment->comment;
                }
            }
        }

        return Inertia::render('Dashboard/Evaluacion/Evaluacion', [
            'valueData' => $valueData,
            'userName' => $user->name,
            'savedAnswers' => $savedAnswers,
            'isEvaluador' => $isEvaluador
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