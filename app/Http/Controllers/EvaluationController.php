<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;
use App\Models\Company;
use App\Models\EvaluationQuestion;
use App\Models\Value;
use App\Models\EvaluatorAssessment;
use App\Models\IndicatorAnswerEvaluation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Controlador de Evaluación
 * 
 * Gestiona la visualización y carga de evaluaciones.
 * 
 * Rutas:
 * - GET /evaluacion/{value_id}
 * - GET /api/evaluation/indicators
 * - POST /evaluation/send-application
 * 
 * Funcionalidades:
 * 1. Carga de preguntas por indicador
 * 2. Filtrado por fecha de registro
 * 3. Procesamiento de homologaciones
 * 4. Cálculo de progreso
 * 5. Gestión de estados
 */
class EvaluationController extends Controller
{
    public function index($value_id)
    {
        $user = Auth::user();
        $company_id = $user->company_id;
        $company = Company::find($company_id);
        $isEvaluador = $user->role === 'evaluador';
        $isSuperAdmin = $user->role === 'super_admin';

        // Obtener los IDs de los indicadores donde la empresa respondió "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $company_id)
            ->where(function ($query) {
                $query->where('answer', '1')
                    ->orWhere('answer', 'si')
                    ->orWhere('answer', 'sí')
                    ->orWhere('answer', 'yes')
                    ->orWhere('answer', 1)
                    ->orWhere('answer', true);
            })
            ->pluck('indicator_id')
            ->toArray();

        // Obtener el total de preguntas de evaluación por subcategoría con filtro de fecha
        $valueData = Value::with(['subcategories' => function ($query) use ($company, $indicatorIds) {
            $query->where('deleted', false)
                ->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->whereHas('indicators', function($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })->with(['indicators' => function ($query) use ($indicatorIds, $company) {
                    $query->where('deleted', false)
                        ->whereIn('indicators.id', $indicatorIds)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                }, 'indicators.evaluationQuestions' => function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                }]);
        }])
            ->where('deleted', false)
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

        // Obtener los IDs de los indicadores respondidos con "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $user->company_id)
            ->where(function ($query) {
                $query->whereIn('answer', ['1', 'si', 'sí', 'yes', 1, true]);
            })
            ->pluck('indicator_id'); // Obtener solo los IDs

        // Contar las preguntas asociadas a esos indicadores
        $numeroDePreguntasQueVaAResponderLaEmpresa = EvaluationQuestion::whereIn('indicator_id', $indicatorIds)->where('deleted', false)->count();

        $numeroDePreguntasQueVaAResponderLaEmpresaPorValor = EvaluationQuestion::whereIn('indicator_id', $indicatorIds)
            ->where('deleted', false)
            ->get()
            ->filter(function ($question) use ($value_id) {
                $indicatorValueId = Indicator::find($question->indicator_id)->value_id;
                return $indicatorValueId == $value_id;
            })
            ->count();

        $numeroDePreguntasQueRespondioLaEmpresa = IndicatorAnswerEvaluation::where('company_id', $user->company_id)->count();

        $numeroDePreguntasQueRespondioLaEmpresaPorValor = IndicatorAnswerEvaluation::where('company_id', $user->company_id)->get()
            ->filter(function ($question) use ($value_id) {
                $indicatorValueId = Indicator::find($question->indicator_id)->value_id;
                return $indicatorValueId == $value_id;
            })
            ->count();

        $numeroDePreguntasQueClificoElEvaluador = EvaluatorAssessment::where('company_id', $user->company_id)->count();

        $numeroDePreguntasQueClificoPositivamenteElEvaluador = EvaluatorAssessment::where('company_id', $user->company_id)->where('approved', true)->count();

        $numeroDePreguntasQueClificoPositivamenteElEvaluadorPorValor = EvaluatorAssessment::where('company_id', $user->company_id)->where('approved', true)->get()
            ->filter(function ($question) use ($value_id) {
                $indicatorValueId = Indicator::find($question->indicator_id)->value_id;
                return $indicatorValueId == $value_id;
            })
            ->count();

        // NUEVO: Obtener las certificaciones válidas de la empresa
        $validCertifications = $company->certifications()
            ->whereRaw('fecha_expiracion > NOW() OR fecha_expiracion IS NULL')
            ->select('id', 'nombre', 'fecha_obtencion', 'fecha_expiracion', 'homologation_id', 'file_paths')
            ->get();

        // NUEVO: Obtener los IDs de las certificaciones disponibles asociadas
        $homologationIds = $validCertifications->pluck('homologation_id')->filter();

        // NUEVO: Obtener los indicadores homologados y sus certificaciones
        $homologatedIndicators = [];
        if ($homologationIds->count() > 0) {
            $homologatedIndicators = \App\Models\IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                ->with(['indicator', 'availableCertification'])
                ->whereHas('indicator', function ($query) use ($company) {
                    $query->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    });
                })
                ->get()
                ->groupBy('homologation_id')
                ->map(function ($group) {
                    $certificationName = $group->first()->availableCertification ?
                        $group->first()->availableCertification->nombre : 'Certificación no disponible';

                    return [
                        'certification_name' => $certificationName,
                        'indicators' => $group->map(function ($homologation) {
                            if (!$homologation->indicator) {
                                return null;
                            }
                            return [
                                'id' => $homologation->indicator->id,
                                'name' => $homologation->indicator->name,
                            ];
                        })->filter()
                    ];
                })
                ->toArray();
        }

        // Obtener todos los IDs de indicadores homologados
        $homologatedIndicatorIds = collect($homologatedIndicators)->flatMap(function ($certification) {
            return collect($certification['indicators'])->pluck('id');
        })->unique()->toArray();

        // Marcar los indicadores homologados en valueData y añadir la información de la certificación
        $valueData->subcategories->each(function ($subcategory) use ($validCertifications, $homologatedIndicators) {
            $subcategory->indicators->each(function ($indicator) use ($validCertifications, $homologatedIndicators) {
                // Buscar la certificación que homologa este indicador
                foreach ($homologatedIndicators as $certification) {
                    foreach ($certification['indicators'] as $homologatedIndicator) {
                        if ($homologatedIndicator['id'] === $indicator->id) {
                            $indicator->isHomologated = true;
                            $indicator->homologation_name = $certification['certification_name'];

                            // Buscar la certificación válida correspondiente
                            $matchingCertification = $validCertifications->first(function ($cert) use ($certification) {
                                return $cert->nombre === $certification['certification_name'];
                            });

                            if ($matchingCertification) {
                                $indicator->certification = [
                                    'id' => $matchingCertification->id,
                                    'nombre' => $matchingCertification->nombre,
                                    'fecha_obtencion' => $matchingCertification->fecha_obtencion,
                                    'fecha_expiracion' => $matchingCertification->fecha_expiracion,
                                    'file_paths' => $matchingCertification->file_paths
                                ];
                            }
                            return;
                        }
                    }
                }
                $indicator->isHomologated = false;
                $indicator->certification = null;
            });
        });

        // NUEVO: Calcular el total de indicadores homologados para este valor
        $totalHomologatedIndicators = 0;
        foreach ($valueData->subcategories as $subcategory) {
            foreach ($subcategory->indicators as $indicator) {
                if ($indicator->isHomologated) {
                    $totalHomologatedIndicators++;
                }
            }
        }

        //dd($validCertifications);

        return Inertia::render('Dashboard/Evaluacion/Evaluacion', [
            'valueData' => $valueData,
            'userName' => $user->name,
            'savedAnswers' => $savedAnswers,
            'isEvaluador' => $isEvaluador,
            'isSuperAdmin' => $isSuperAdmin,
            'progress' => $progress,
            'totalSteps' => $valueData->subcategories->count(),
            'value_id' => $value_id,
            'company' => $company,
            'validCertifications' => $validCertifications,
            'numeroDePreguntasQueVaAResponderLaEmpresa' => $numeroDePreguntasQueVaAResponderLaEmpresa,
            'numeroDePreguntasQueRespondioLaEmpresa' => $numeroDePreguntasQueRespondioLaEmpresa,
            'numeroDePreguntasQueRespondioLaEmpresaPorValor' => $numeroDePreguntasQueRespondioLaEmpresaPorValor,
            'numeroDePreguntasQueClificoElEvaluador' => $numeroDePreguntasQueClificoElEvaluador,
            'numeroDePreguntasQueVaAResponderLaEmpresaPorValor' => $numeroDePreguntasQueVaAResponderLaEmpresaPorValor,
            'numeroDePreguntasQueClificoPositivamenteElEvaluador' => $numeroDePreguntasQueClificoPositivamenteElEvaluador,
            'numeroDePreguntasQueClificoPositivamenteElEvaluadorPorValor' => $numeroDePreguntasQueClificoPositivamenteElEvaluadorPorValor,
            'totalHomologatedIndicators' => $totalHomologatedIndicators
        ]);
    }

    public function getIndicators()
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $company = Company::find($companyId);

        // Obtener los IDs de los indicadores donde la empresa respondió "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $companyId)
            ->where(function ($query) {
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
        $indicators = Indicator::with(['evaluationQuestions' => function ($query) use ($company) {
            $query->where(function ($q) use ($company) {
                $q->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            });
        }])
            ->whereIn('id', $indicatorIds)
            ->where('is_active', true)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
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
