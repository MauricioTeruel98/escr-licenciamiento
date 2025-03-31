<?php

namespace App\Http\Controllers;

use App\Models\AutoEvaluationResult;
use App\Models\Company;
use App\Models\Value;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\IndicatorHomologation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IndicadoresController extends Controller
{
    public function index($id)
    {
        $user = Auth::user();
        $company = Company::find($user->company_id);

        // Verificar si la empresa ha iniciado su auto-evaluación
        /*if (!$company->fecha_inicio_auto_evaluacion) {
            return Inertia::render('Dashboard/Indicadores/Indicadores', [
                'error' => 'La empresa no ha iniciado su auto-evaluación'
            ]);
        }*/

        $value = Value::with(['subcategories' => function ($query) use ($company) {
            $query->where('deleted', false)
                ->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })->with(['indicators' => function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        })->with(['evaluationQuestions' => function($query) {
                            $query->where('deleted', false);
                        }]);
                }]);
        }])
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })->findOrFail($id);

        // Obtener las certificaciones de la empresa
        $certifications = $company->certifications;

        $autoevaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();

        $autoevaluationResultFormSended = false;
        $autoevaluationResultApplicationSended = false;

        $rolSuperAdmin = $user->role == 'super_admin';

        if ($autoevaluationResult) {
            $autoevaluationResultFormSended = $autoevaluationResult->form_sended;
            $autoevaluationResultApplicationSended = $autoevaluationResult->application_sended;
        }

        $autoevalEnded = $company->autoeval_ended;

        $availableToModifyAutoeval = true;

        if ($autoevaluationResultFormSended && $autoevaluationResultApplicationSended && $autoevalEnded && !$rolSuperAdmin) {
            $availableToModifyAutoeval = false;
        }

        // Filtrar certificaciones para excluir las vencidas
        $validCertifications = $certifications->filter(function ($certification) {
            return !$certification->isExpired();
        });

        // Obtener certificaciones vencidas
        $expiredCertifications = $certifications->filter(function ($certification) {
            return $certification->isExpired();
        });

        // Obtener los IDs de las certificaciones disponibles asociadas (solo de las no vencidas)
        $homologationIds = $validCertifications->pluck('homologation_id')->filter();

        // Obtener los IDs de las certificaciones vencidas
        $expiredHomologationIds = $expiredCertifications->pluck('homologation_id')->filter();

        // Obtener los indicadores homologados
        $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
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
                // Verificar que availableCertification existe antes de acceder a sus propiedades
                $certificationName = $group->first()->availableCertification ?
                    $group->first()->availableCertification->nombre : 'Certificación no disponible';

                return [
                    'certification_name' => $certificationName,
                    'indicators' => $group->map(function ($homologation) {
                        // Verificar que indicator existe antes de acceder a sus propiedades
                        if (!$homologation->indicator) {
                            return null;
                        }

                        return [
                            'id' => $homologation->indicator->id,
                            'name' => $homologation->indicator->name,
                            // Agrega aquí cualquier otra información del indicador que necesites
                        ];
                    })->filter() // Eliminar los valores nulos
                ];
            });

        // Obtener los indicadores que estaban homologados pero ya no lo están debido a certificaciones vencidas
        $previouslyHomologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $expiredHomologationIds)
            ->with(['indicator'])
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
            })
            ->get()
            ->pluck('indicator.id')
            ->unique()
            ->values()
            ->all();

        // Obtener las respuestas guardadas del usuario
        $savedAnswers = IndicatorAnswer::where('company_id', $user->company_id)
            ->whereIn('indicator_id', $value->subcategories->flatMap->indicators->pluck('id'))
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
            })
            ->get();

        $savedAnswersCount = IndicatorAnswer::where('company_id', $user->company_id)->count();
        // Formatear las respuestas para el componente React
        $formattedAnswers = [];
        $formattedJustifications = [];
        foreach ($savedAnswers as $answer) {
            $formattedAnswers[$answer->indicator_id] = $answer->answer;
            if (!empty($answer->justification)) {
                $formattedJustifications[$answer->indicator_id] = $answer->justification;
            }
        }

        // Obtener todos los IDs de indicadores homologados
        $homologatedIndicatorIds = collect($homologatedIndicators)->flatMap(function ($cert) {
            return collect($cert['indicators'])->pluck('id');
        })->unique()->toArray();

        // Asegurar que todos los indicadores homologados tengan valor "1"
        foreach ($homologatedIndicatorIds as $indicatorId) {
            $formattedAnswers[$indicatorId] = "1";
        }

        $numeroDeIndicadoresAResponder = Indicator::where('is_active', true)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->count();

        $numeroDeIndicadoresRespondidos = IndicatorAnswer::where('company_id', $user->company_id)
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where('is_active', true)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    });
            })
            ->count();

        // Obtener la nota actual
        $currentScore = \App\Models\AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->where('value_id', $id)
            ->latest('fecha_evaluacion')
            ->first()?->nota ?? 0;

        // Registrar información para depuración
        \Illuminate\Support\Facades\Log::info('Cargando indicadores para valor', [
            'value_id' => $id,
            'company_id' => $user->company_id,
            'savedAnswers' => $formattedAnswers,
            'savedJustifications' => $formattedJustifications,
            'homologatedIndicatorIds' => $homologatedIndicatorIds,
            'currentScore' => $currentScore,
            'autoEvalCompleted' => $company->estado_eval === 'auto-evaluacion-completed',
            'fecha_inicio_auto_evaluacion' => $company->fecha_inicio_auto_evaluacion
        ]);

        return Inertia::render('Dashboard/Indicadores/Indicadores', [
            'valueData' => $value,
            'userName' => $user->name,
            'user' => $user,
            'savedAnswers' => $formattedAnswers,
            'savedJustifications' => $formattedJustifications,
            'currentScore' => $currentScore,
            'certifications' => $certifications,
            'homologatedIndicators' => $homologatedIndicators,
            'previouslyHomologatedIndicators' => $previouslyHomologatedIndicators,
            'company' => $company,
            'availableToModifyAutoeval' => $availableToModifyAutoeval,
            'savedAnswersCount' => $savedAnswersCount
        ]);
    }
}
