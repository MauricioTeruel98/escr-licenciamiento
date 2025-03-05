<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;
use App\Models\Company;
use App\Models\Value;
use App\Models\EvaluatorAssessment;
use App\Models\IndicatorAnswerEvaluation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EvaluationController extends Controller
{
    public function index($value_id)
    {
        $user = Auth::user();
        $company_id = $user->company_id;
        $isEvaluador = $user->role === 'evaluador';

        // Obtener los IDs de los indicadores donde la empresa respondió "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $company_id)
            ->where(function($query) {
                $query->where('answer', '1')
                      ->orWhere('answer', 'si')
                      ->orWhere('answer', 'sí')
                      ->orWhere('answer', 'yes')
                      ->orWhere('answer', 1)
                      ->orWhere('answer', true);
            })
            ->pluck('indicator_id')
            ->toArray();

        // Log para depuración
        Log::info('Indicadores con respuesta "sí":', $indicatorIds);

        // Obtener el total de preguntas de evaluación por subcategoría
        $valueData = Value::with(['subcategories.indicators' => function($query) use ($indicatorIds) {
                $query->whereIn('indicators.id', $indicatorIds);
            }, 'subcategories.indicators.evaluationQuestions'])
            ->findOrFail($value_id);

        // Calcular el progreso
        $totalQuestions = 0;
        $answeredQuestions = 0;
        
        foreach ($valueData->subcategories as $subcategory) {
            foreach ($subcategory->indicators as $indicator) {
                foreach ($indicator->evaluationQuestions as $question) {
                    $totalQuestions++;
                    
                    if ($isEvaluador) {
                        // Para evaluadores, verificar si existe una evaluación para esta pregunta
                        $hasEvaluation = EvaluatorAssessment::where('company_id', $company_id)
                            ->where('evaluation_question_id', $question->id)
                            ->whereNotNull('approved') // Asegurarse de que se haya tomado una decisión (aprobado o no)
                            ->exists();
                            
                        if ($hasEvaluation) {
                            $answeredQuestions++;
                        }
                    } else {
                        // Para empresas, verificar si existe una respuesta para esta pregunta
                        $hasAnswer = IndicatorAnswerEvaluation::where('company_id', $company_id)
                            ->where('evaluation_question_id', $question->id)
                            ->exists();
                            
                        if ($hasAnswer) {
                            $answeredQuestions++;
                        }
                    }
                }
            }
        }

        $progress = $totalQuestions > 0 ? round(($answeredQuestions / $totalQuestions) * 100) : 0;

        // Obtener todas las respuestas de evaluación existentes
        $savedAnswers = \App\Models\IndicatorAnswerEvaluation::where('company_id', $company_id)
            ->get()
            ->map(function ($answer) {
                $files = [];
                if ($answer->file_path) {
                    $filePaths = json_decode($answer->file_path);
                    if (is_array($filePaths)) {
                        $files = array_map(function ($path) {
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

        $company = Company::find($company_id);

        return Inertia::render('Dashboard/Evaluacion/Evaluacion', [
            'valueData' => $valueData,
            'userName' => $user->name,
            'savedAnswers' => $savedAnswers,
            'isEvaluador' => $isEvaluador,
            'progress' => $progress,
            'totalSteps' => $valueData->subcategories->count(),
            'value_id' => $value_id,
            'company' => $company
        ]);
    }

    public function getIndicators()
    {
        // Obtener el usuario autenticado y su empresa
        $user = Auth::user();
        $companyId = $user->company_id;

        // Obtener los IDs de los indicadores donde la empresa respondió "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $companyId)
            ->where(function($query) {
                $query->where('answer', '1')
                      ->orWhere('answer', 'si')
                      ->orWhere('answer', 'sí')
                      ->orWhere('answer', 'yes')
                      ->orWhere('answer', 1)
                      ->orWhere('answer', true);
            })
            ->pluck('indicator_id')
            ->toArray();

        // Obtener solo los indicadores que la empresa respondió "sí" y que estén activos
        $indicators = Indicator::with(['evaluationQuestions'])
            ->whereIn('id', $indicatorIds)
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

    public function sendApplication()
    {
        //Cambiar user_id por company_id
        $user = Auth::user();
        $companyId = $user->company_id;

        DB::table('auto_evaluation_result')
            ->where('company_id', $companyId)
            ->update(['application_sended' => 1]);

        return response()->json(['message' => 'Solicitud enviada correctamente']);
    }
}
