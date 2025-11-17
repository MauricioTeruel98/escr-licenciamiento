<?php

namespace App\Http\Controllers;

use App\Mail\AutoEvaluationComplete;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationResult;
use App\Models\AutoEvaluationSubcategoryResult;
use App\Models\AutoEvaluationValorResult;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\AutoEvaluationResults;
use App\Models\Value;
use Illuminate\Support\Str;
use App\Models\Company;
use App\Models\InfoAdicionalEmpresa;
use App\Models\User;
use App\Models\Certification;
use App\Models\IndicatorHomologation;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\MailService;

/**
 * Controlador de Respuestas de Indicadores
 * 
 * Gestiona el almacenamiento y procesamiento de respuestas.
 * 
 * Rutas:
 * - POST /indicadores/store-answers
 * - POST /indicadores/save-partial-answers
 * - POST /indicadores/finalizar-autoevaluacion
 * 
 * Funcionalidades:
 * 1. Almacenamiento de respuestas
 * 2. Validación de indicadores vinculantes
 * 3. Cálculo de puntajes por subcategoría
 * 4. Generación de resultados finales
 * 5. Envío de notificaciones
 */
class IndicadorAnswerController extends Controller
{
    protected $mailService;
    
    // Indicadores que no deben participar en cálculos (subcategoría, valor, progreso, estado)
    protected $excludedIndicatorIds = [141, 142];

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            // Obtener la empresa y su fecha de inicio de auto-evaluación
            $company = Company::find($user->company_id);
            if (!$company->fecha_inicio_auto_evaluacion) {
                return response()->json(['message' => 'La empresa no ha iniciado su auto-evaluación'], 400);
            }

            // Obtener los indicadores que existían antes de la fecha de inicio
            $indicators = Indicator::whereIn('id', array_keys($request->answers))
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->select('id', 'binding', 'is_binary')
                ->get()
                ->keyBy('id');

            // Verificar si hay indicadores válidos
            if ($indicators->isEmpty()) {
                return response()->json(['message' => 'No hay indicadores válidos para responder'], 400);
            }

            // Obtener las certificaciones válidas de la empresa
            $validCertifications = $company->certifications()
                ->whereRaw('fecha_expiracion > NOW() OR fecha_expiracion IS NULL')
                ->get();

            // Obtener los IDs de las certificaciones disponibles asociadas
            $homologationIds = $validCertifications->pluck('homologation_id')->filter();

            // Obtener los indicadores homologados
            $homologatedIndicators = [];
            if ($homologationIds->count() > 0) {
                $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                    ->pluck('indicator_id')
                    ->toArray();
            }

            // Guardar respuestas individuales
            foreach ($request->answers as $indicatorId => $answer) {
                // Verificar que el indicatorId sea un número válido y exista en los indicadores válidos
                if (!is_numeric($indicatorId) || $indicatorId <= 0 || !isset($indicators[$indicatorId])) {
                    Log::error('ID de indicador no válido:', [
                        'indicator_id' => $indicatorId,
                        'answer' => $answer
                    ]);
                    continue; // Saltar este indicador
                }

                // Si el indicador está homologado, forzar la respuesta a "1" (Sí)
                if (in_array($indicatorId, $homologatedIndicators)) {
                    $answer = "1";
                }

                // Obtener la justificación si existe
                $justification = isset($request->justifications[$indicatorId]) ? $request->justifications[$indicatorId] : null;

                // Verificar si ya existe una respuesta para este indicador en esta empresa
                $existingAnswer = IndicatorAnswer::where('company_id', $user->company_id)
                    ->where('indicator_id', $indicatorId)
                    ->first();

                if ($existingAnswer) {
                    // Actualizar la respuesta existente
                    $existingAnswer->update([
                        'answer' => $answer,
                        'justification' => $justification,
                        'user_id' => $user->id,
                        'is_binding' => $indicators[$indicatorId]->binding ?? false,
                        'updated_at' => now()
                    ]);
                } else {
                    // Crear nueva respuesta
                    IndicatorAnswer::create([
                        'user_id' => $user->id,
                        'company_id' => $user->company_id,
                        'indicator_id' => $indicatorId,
                        'answer' => $answer,
                        'justification' => $justification,
                        'is_binding' => $indicators[$indicatorId]->binding ?? false
                    ]);
                }
            }

            // Recalcular todas las notas basadas en las respuestas actuales de la empresa
            $subcategoryScores = $this->calculateSubcategoryScores($request->value_id, $user->company_id);

            // Guardar resultados por subcategoría
            foreach ($subcategoryScores as $subcategoryId => $score) {
                AutoEvaluationSubcategoryResult::updateOrCreate(
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

            // Calcular y guardar nota final del valor (ponderado por número de indicadores)
            $finalScore = $this->calculateValueScoreWeighted($request->value_id, $user->company_id);

            $totalIndicators = 0;
            $answeredIndicators = 0;

            // Obtener todos los indicadores del valor
            $indicators = Indicator::whereHas('subcategory', function ($query) use ($request) {
                $query->where('value_id', $request->value_id);
            })
            ->where('is_active', true)
            ->where('deleted', false)
            ->whereNotIn('id', $this->excludedIndicatorIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->get();

            foreach ($indicators as $indicator) {
                $totalIndicators++;
                // Verificar si el indicador tiene respuesta válida (no nula o vacía)
                $hasAnswer = IndicatorAnswer::where('company_id', $user->company_id)
                    ->where('indicator_id', $indicator->id)
                    ->whereNotNull('answer')
                    ->where('answer', '!=', '')
                    ->exists();
                
                if ($hasAnswer) {
                    $answeredIndicators++;
                }
            }

            // Calcular el progreso, pero asegurar que nunca sea 100% si no todos los indicadores están respondidos
            $progress = $totalIndicators > 0 ? round(($answeredIndicators / $totalIndicators) * 100) : 0;
            
            // Si el progreso es 100% pero no todos los indicadores están respondidos, ajustar a 99%
            if ($progress === 100 && $answeredIndicators < $totalIndicators) {
                $progress = 99;
            }

            AutoEvaluationValorResult::updateOrCreate(
                [
                    'company_id' => $user->company_id,
                    'value_id' => $request->value_id,
                ],
                [
                    'nota' => $finalScore,
                    'progress' => $progress,
                    'fecha_evaluacion' => now()
                ]
            );

            // Verificar estado de la autoevaluación
            $totalIndicators = Indicator::where('is_active', true)
                ->where('deleted', false)
                ->whereNotIn('id', $this->excludedIndicatorIds)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->count();

            $answeredIndicators = IndicatorAnswer::where('company_id', $user->company_id)
                ->whereNotNull('answer')
                ->where('answer', '!=', '')
                ->whereNotIn('indicator_id', $this->excludedIndicatorIds)
                ->whereHas('indicator', function ($query) use ($company) {
                    $query->where('is_active', true)
                        ->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->count();

            // Verificar respuestas vinculantes
            $hasFailedBindingQuestions = IndicatorAnswer::where('company_id', $user->company_id)
                ->where('is_binding', true)
                ->where('answer', 0)
                ->whereNotIn('indicator_id', $this->excludedIndicatorIds)
                ->exists();

            // Verificar notas mínimas por valor
            $hasFailedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)
                ->whereHas('value', function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->with(['value' => function($query) {
                    $query->select('id', 'name', 'minimum_score');
                }])
                ->get()
                ->filter(function ($result) {
                    // Usar la nota mínima del valor o 70 como valor por defecto
                    $minimumScore = $result->value->minimum_score ?? 70;
                    return $result->nota < $minimumScore;
                })
                ->isNotEmpty(); // true si hay algún valor que no alcanza su nota mínima

            $activeValues = Value::where('is_active', true)
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->count();
            $evaluatedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)->count();

            // Determinar el estado
            $status = 'en_proceso';
            if ($evaluatedValues === $activeValues) {
                if (!$hasFailedBindingQuestions && !$hasFailedValues) {
                    $status = 'apto';
                } else {
                    $status = 'no_apto';
                }
            }

            // Actualizar resultado de autoevaluación
            AutoEvaluationResult::updateOrCreate(
                [
                    'company_id' => $user->company_id
                ],
                [
                    'indicadores_respondidos' => $answeredIndicators,
                    'total_indicadores' => $totalIndicators,
                    'status' => $status,
                    'fecha_actualizacion' => now(),
                    'fecha_aprobacion' => $status === 'apto' ? now() : null
                ]
            );

            DB::commit();

            // Verificar si todos los valores han sido evaluados
            $isAutoEvaluationComplete = $this->isAutoEvaluationComplete($user->company_id);
            $activeValues = Value::where('is_active', true)->count();
            $evaluatedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)->count();

            if ($isAutoEvaluationComplete) {
                // Obtener todos los valores y sus respuestas
                $allValues = Value::with(['subcategories' => function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        })->with(['indicators' => function ($query) use ($company) {
                            $query->where('deleted', false)
                                ->where(function ($q) use ($company) {
                                    $q->whereNull('created_at')
                                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                                });
                        }]);
                    }])
                    ->where('is_active', true)
                    ->where('deleted', false)
                    ->where(function ($query) use ($company) {
                        $query->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->get();

                $allAnswers = IndicatorAnswer::where('company_id', $user->company_id)
                    ->with('indicator.subcategory.value')
                    ->get()
                    ->groupBy('indicator.subcategory.value.id');

                // Obtener información adicional de la empresa
                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                // Generar PDF con todos los valores
                /*
                $pdf = Pdf::loadView('pdf/autoevaluation', [
                    'values' => $allValues,
                    'answers' => $allAnswers,
                    'company' => $company,
                    'date' => now()->format('d/m/Y'),
                    'finalScores' => AutoEvaluationValorResult::where('company_id', $user->company_id)
                        ->get()
                        ->keyBy('value_id')
                ]);

                // Crear estructura de carpetas para la empresa
                $companySlug = Str::slug($company->name);
                $basePath = storage_path('app/public/companies');
                $companyPath = "{$basePath}/{$company->id}/autoevaluations";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }

                // Generar nombre de archivo con timestamp
                $fileName = "autoevaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF al usuario administrador de la empresa
                $admin = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                Mail::to($admin->email)->send(new AutoEvaluationResults($fullPath, $user->company));

                $superAdminUsers = User::where('role', 'super_admin')->get();
                foreach ($superAdminUsers as $superAdmin) {
                    try {
                        $mail = new AutoEvaluationComplete($fullPath, $user->company);
                        $this->mailService->send($superAdmin->email, $mail);
                    } catch (\Exception $e) {
                        Log::error('Error al enviar el correo de autoevaluación completada al superadmin:', [
                            'error' => $e->getMessage(),
                            'user_id' => $superAdmin->id,
                            'email' => $superAdmin->email
                        ]);
                    }
                }

                // Actualizar la columna autoeval_ended en la tabla companies
                $company->update(['autoeval_ended' => true]);

                // Actualizar la columna estado_eval en la tabla companies
                $company->update(['estado_eval' => 'auto-evaluacion-completed']);

                $company->save();
                */

                return response()->json([
                    'success' => true,
                    'message' => '¡Autoevaluación completada! Se ha enviado un PDF a su correo con los resultados.',
                    'finalScore' => $finalScore,
                    'progress' => [
                        'answered' => $answeredIndicators,
                        'total' => $totalIndicators,
                        'status' => $status,
                        'hasFailedBindingQuestions' => $hasFailedBindingQuestions,
                        'hasFailedValues' => $hasFailedValues,
                        'activeValues' => $activeValues,
                        'evaluatedValues' => $evaluatedValues,
                        'isAutoEvaluationComplete' => $isAutoEvaluationComplete
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Respuestas guardadas exitosamente.',
                'finalScore' => $finalScore,
                'progress' => [
                    'answered' => $answeredIndicators,
                    'total' => $totalIndicators,
                    'status' => $status,
                    'hasFailedBindingQuestions' => $hasFailedBindingQuestions,
                    'hasFailedValues' => $hasFailedValues,
                    'activeValues' => $activeValues,
                    'evaluatedValues' => $evaluatedValues,
                    'isAutoEvaluationComplete' => $isAutoEvaluationComplete
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar respuestas:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error al guardar respuestas: ' . $e->getMessage()], 500);
        }
    }

    public function finalizarAutoEvaluacion()
    {
        $user = Auth::user();

        $company = Company::find($user->company_id);

        $autoevaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();

        $applicationSended = $autoevaluationResult->application_sended;
        $formSended = $autoevaluationResult->form_sended;

        $evaluacionCompleta = $this->isAutoEvaluationComplete($user->company_id);

        if ($applicationSended && $formSended && $evaluacionCompleta) {
            try {
                // Obtener todos los valores y sus respuestas
                $allValues = Value::with(['subcategories' => function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        })->with(['indicators' => function ($query) use ($company) {
                            $query->where('deleted', false)
                                ->where(function ($q) use ($company) {
                                    $q->whereNull('created_at')
                                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                                });
                        }]);
                    }])
                    ->where('is_active', true)
                    ->where('deleted', false)
                    ->where(function ($query) use ($company) {
                        $query->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->get();

                $allAnswers = IndicatorAnswer::where('company_id', $user->company_id)
                    ->with('indicator.subcategory.value')
                    ->get()
                    ->groupBy('indicator.subcategory.value.id');

                // Obtener información adicional de la empresa
                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                // Generar PDF con todos los valores
                $pdf = Pdf::loadView('pdf/autoevaluation', [
                    'values' => $allValues,
                    'answers' => $allAnswers,
                    'company' => $company,
                    'date' => now()->format('d/m/Y'),
                    'finalScores' => AutoEvaluationValorResult::where('company_id', $user->company_id)
                        ->get()
                        ->keyBy('value_id')
                ]);

                // Crear estructura de carpetas para la empresa
                $companySlug = Str::slug($company->name);
                $basePath = storage_path('app/public/companies');
                $companyPath = "{$basePath}/{$company->id}/autoevaluations";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }

                // Generar nombre de archivo con timestamp
                //$finalEvaluationPath = "companies/{$company->id}/evaluations/{$fileName}";
                $fileName = "autoevaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                $evaluationPath = "{$company->id}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF a todos los usuarios de la empresa
                $companyUsers = User::where('company_id', $user->company_id)->where('status', 'approved')->get();
                foreach ($companyUsers as $companyUser) {
                    try {
                        $mail = new \App\Mail\AutoEvaluationResults($fullPath, $company);
                        $this->mailService->send($companyUser->email, $mail);
                    } catch (\Exception $e) {
                        Log::error('Error al enviar el correo de resultados de evaluación al usuario ' . $companyUser->email . ': ' . $e->getMessage());
                    }
                }

                $superAdminUsers = User::where('role', 'super_admin')->get();
                foreach ($superAdminUsers as $superAdmin) {
                    try {
                        $mail = new \App\Mail\AutoEvaluationComplete($fullPath, $company);
                        $this->mailService->send($superAdmin->email, $mail);
                    } catch (\Exception $e) {
                        Log::error('Error al enviar el correo de resultados de evaluación al superadmin:', [
                            'error' => $e->getMessage(),
                            'user_id' => $superAdmin->id,
                            'email' => $superAdmin->email
                        ]);
                    }
                }

                //$finalAutoEvaluationPath = "{$evaluationPath}/{$fileName}";
                $finalAutoEvaluationPath = "companies/{$company->id}/autoevaluations/{$fileName}";

                // Actualizar la columna autoeval_ended en la tabla companies
                $company->update([
                    'autoeval_ended' => true,
                    'estado_eval' => 'auto-evaluacion-completed',
                    'auto_evaluation_document_path' => $finalAutoEvaluationPath
                ]);

                return response()->json([
                    'success' => true,
                    'message' => '¡Autoevaluación finalizada! Se ha enviado un PDF a su correo con los resultados.'
                ]);
            } catch (\Exception $e) {
                Log::error('Error al finalizar autoevaluación:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json(['message' => 'Error al finalizar autoevaluación: ' . $e->getMessage()], 500);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se puede finalizar la autoevaluación. Verifique que haya completado todos los requisitos.'
            ], 400);
        }
    }

    private function calculateSubcategoryScores($valueId, $companyId)
    {
        // Obtener la empresa y su fecha de inicio de auto-evaluación
        $company = Company::find($companyId);
        if (!$company->fecha_inicio_auto_evaluacion) {
            return [];
        }

        $excludedIds = $this->excludedIndicatorIds;

        // Obtener las certificaciones válidas de la empresa
        $validCertifications = $company->certifications()
            ->whereRaw('fecha_expiracion > NOW() OR fecha_expiracion IS NULL')
            ->get();

        // Obtener los IDs de las certificaciones disponibles asociadas
        $homologationIds = $validCertifications->pluck('homologation_id')->filter();

        // Obtener los indicadores homologados
        $homologatedIndicators = [];
        if ($homologationIds->count() > 0) {
            $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                ->pluck('indicator_id')
                ->toArray();
        }

        // 1) Obtener todos los indicadores válidos del valor (denominador)
        $indicators = DB::table('indicators as i')
            ->join('subcategories as s', 'i.subcategory_id', '=', 's.id')
            ->where('s.value_id', $valueId)
            ->where('i.deleted', false)
            ->where('s.deleted', false)
            ->where('i.is_active', true)
            ->whereNotIn('i.id', $excludedIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('i.created_at')
                    ->orWhere('i.created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->select('s.id as subcategory_id', 'i.id as indicator_id')
            ->get();

        if ($indicators->isEmpty()) {
            return [];
        }

        $indicatorIds = $indicators->pluck('indicator_id')->toArray();

        // 2) Obtener respuestas para esos indicadores de esta empresa
        $answers = DB::table('indicator_answers')
            ->where('company_id', $companyId)
            ->whereIn('indicator_id', $indicatorIds)
            ->select('indicator_id', 'answer')
            ->get()
            ->keyBy('indicator_id');

        // 3) Construir totales y positivos por subcategoría
        $scores = [];
        foreach ($indicators as $row) {
            $subcategoryId = $row->subcategory_id;
            $indicatorId = $row->indicator_id;

            if (!isset($scores[$subcategoryId])) {
                $scores[$subcategoryId] = [
                    'total' => 0,
                    'positive' => 0
                ];
            }

            $scores[$subcategoryId]['total']++;

            $answerRow = $answers->get($indicatorId);
            $isPositive = in_array($indicatorId, $homologatedIndicators) || ($answerRow && (string)$answerRow->answer === '1');
            if ($isPositive) {
                $scores[$subcategoryId]['positive']++;
            }
        }

        // 4) Calcular porcentaje por subcategoría (0 si no hay indicadores válidos)
        return array_map(function ($subcategoryStats) {
            if ($subcategoryStats['total'] === 0) return 0;
            return round(($subcategoryStats['positive'] / $subcategoryStats['total']) * 100);
        }, $scores);
    }

    /**
     * Calcula la nota del valor ponderando por número de indicadores por subcategoría.
     */
    private function calculateValueScoreWeighted(int $valueId, int $companyId): int
    {
        $company = Company::find($companyId);
        if (!$company->fecha_inicio_auto_evaluacion) {
            return 0;
        }

        $excludedIds = $this->excludedIndicatorIds;

        // Denominador por subcategoría: cantidad de indicadores válidos
        $subcatTotals = DB::table('indicators as i')
            ->join('subcategories as s', 'i.subcategory_id', '=', 's.id')
            ->where('s.value_id', $valueId)
            ->where('i.deleted', false)
            ->where('s.deleted', false)
            ->where('i.is_active', true)
            ->whereNotIn('i.id', $excludedIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('i.created_at')
                    ->orWhere('i.created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->groupBy('s.id')
            ->pluck(DB::raw('count(*)'), 's.id');

        if ($subcatTotals->isEmpty()) {
            return 0;
        }

        // Positivos por subcategoría (respuestas Sí u homologadas)
        $validCertifications = $company->certifications()
            ->whereRaw('fecha_expiracion > NOW() OR fecha_expiracion IS NULL')
            ->get();
        $homologationIds = $validCertifications->pluck('homologation_id')->filter();
        $homologated = [];
        if ($homologationIds->count() > 0) {
            $homologated = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                ->pluck('indicator_id')
                ->toArray();
        }

        $indicators = DB::table('indicators as i')
            ->join('subcategories as s', 'i.subcategory_id', '=', 's.id')
            ->where('s.value_id', $valueId)
            ->where('i.deleted', false)
            ->where('s.deleted', false)
            ->where('i.is_active', true)
            ->whereNotIn('i.id', $excludedIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('i.created_at')
                    ->orWhere('i.created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->select('s.id as subcategory_id', 'i.id as indicator_id')
            ->get();

        $answers = DB::table('indicator_answers')
            ->where('company_id', $companyId)
            ->whereIn('indicator_id', $indicators->pluck('indicator_id'))
            ->select('indicator_id', 'answer')
            ->get()
            ->keyBy('indicator_id');

        $subcatPositives = [];
        foreach ($indicators as $row) {
            $subId = $row->subcategory_id;
            $indId = $row->indicator_id;
            $isPositive = in_array($indId, $homologated) || (($answers->get($indId)->answer ?? null) == 1);
            if ($isPositive) {
                $subcatPositives[$subId] = ($subcatPositives[$subId] ?? 0) + 1;
            }
        }

        // Nota ponderada: (sumatoria de positivos) / (sumatoria de totales) * 100
        $sumPos = array_sum($subcatPositives);
        $sumTot = array_sum($subcatTotals->toArray());
        if ($sumTot === 0) return 0;
        return (int) round(($sumPos / $sumTot) * 100);
    }

    /**
     * Verifica si la autoevaluación está completa para una empresa
     * 
     * @param int $companyId ID de la empresa
     * @return bool True si la autoevaluación está completa, false en caso contrario
     */
    private function isAutoEvaluationComplete($companyId)
    {
        // Obtener la empresa y su fecha de inicio de auto-evaluación
        $company = Company::find($companyId);
        if (!$company->fecha_inicio_auto_evaluacion) {
            return false;
        }

        $activeValues = Value::where('is_active', true)
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->count();
        $evaluatedValues = AutoEvaluationValorResult::where('company_id', $companyId)->count();

        $numeroDeIndicadoresAResponderLaEmpresa = Indicator::where('is_active', true)
            ->where('deleted', false)
            ->whereNotIn('id', $this->excludedIndicatorIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->count();

        $numeroDeIndicadoresRespondidos = IndicatorAnswer::where('company_id', $companyId)
            ->whereNotIn('indicator_id', $this->excludedIndicatorIds)
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where('is_active', true)
                    ->where('deleted', false)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    });
            })
            ->count();

        $isComplete = $numeroDeIndicadoresAResponderLaEmpresa === $numeroDeIndicadoresRespondidos;

        Log::info('Verificación de autoevaluación completa:', [
            'company_id' => $companyId,
            'active_values' => $activeValues,
            'evaluated_values' => $evaluatedValues,
            'is_complete' => $isComplete,
            'fecha_inicio_auto_evaluacion' => $company->fecha_inicio_auto_evaluacion
        ]);

        return $isComplete;
    }

    /**
     * Verifica el estado de la autoevaluación y envía los correos electrónicos si está completa
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAutoEvaluationStatus(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            $companyId = $user->company_id;
            $isComplete = $this->isAutoEvaluationComplete($companyId);

            $activeValues = Value::where('is_active', true)->count();
            $evaluatedValues = AutoEvaluationValorResult::where('company_id', $companyId)->count();

            // Si la autoevaluación está completa pero no se ha marcado como finalizada
            $company = Company::find($companyId);

            if ($isComplete && !$company->autoeval_ended) {
                // Obtener todos los valores y sus respuestas

                $allValues = Value::with(['subcategories' => function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        })->with(['indicators' => function ($query) use ($company) {
                            $query->where('deleted', false)
                                ->where(function ($q) use ($company) {
                                    $q->whereNull('created_at')
                                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                                });
                        }]);
                    }])
                    ->where('is_active', true)
                    ->where('deleted', false)
                    ->where(function ($query) use ($company) {
                        $query->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->get();

                $allAnswers = IndicatorAnswer::where('company_id', $companyId)
                    ->with('indicator.subcategory.value')
                    ->get()
                    ->groupBy('indicator.subcategory.value.id');

                // Obtener información adicional de la empresa
                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($companyId);

                // Generar PDF con todos los valores
                $pdf = Pdf::loadView('pdf/autoevaluation', [
                    'values' => $allValues,
                    'answers' => $allAnswers,
                    'company' => $company,
                    'date' => now()->format('d/m/Y'),
                    'finalScores' => AutoEvaluationValorResult::where('company_id', $companyId)
                        ->get()
                        ->keyBy('value_id')
                ]);

                // Crear estructura de carpetas para la empresa
                $companySlug = Str::slug($company->name);
                $basePath = storage_path('app/public/companies');
                $companyPath = "{$basePath}/{$company->id}/autoevaluations";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }

                // Generar nombre de archivo con timestamp
                $fileName = "autoevaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF al usuario administrador de la empresa
                $admin = User::where('company_id', $companyId)->where('role', 'admin')->first();
                try {
                    $mail = new \App\Mail\AutoEvaluationResults($fullPath, $company);
                    $this->mailService->send($admin->email, $mail);
                } catch (\Exception $e) {
                    Log::error('Error al enviar el correo de resultados de evaluación: ' . $e->getMessage());
                }

                $superAdminUsers = User::where('role', 'super_admin')->get();
                foreach ($superAdminUsers as $superAdmin) {
                    try {
                        $mail = new \App\Mail\AutoEvaluationComplete($fullPath, $company);
                        $this->mailService->send($superAdmin->email, $mail);
                    } catch (\Exception $e) {
                        Log::error('Error al enviar el correo de resultados de evaluación al superadmin:', [
                            'error' => $e->getMessage(),
                            'user_id' => $superAdmin->id,
                            'email' => $superAdmin->email
                        ]);
                    }
                }

                // Actualizar la columna autoeval_ended en la tabla companies
                $company->update([
                    'autoeval_ended' => true,
                    'estado_eval' => 'auto-evaluacion-completed'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => '¡Autoevaluación completada! Se ha enviado un PDF a su correo con los resultados.',
                    'autoeval_status' => [
                        'is_complete' => true,
                        'active_values' => $activeValues,
                        'evaluated_values' => $evaluatedValues
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Estado de autoevaluación verificado.',
                'autoeval_status' => [
                    'is_complete' => $isComplete,
                    'active_values' => $activeValues,
                    'evaluated_values' => $evaluatedValues
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error al verificar estado de autoevaluación:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al verificar estado de autoevaluación: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Guarda respuestas parciales sin finalizar la autoevaluación
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function savePartialAnswers(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            // Obtener la empresa y verificar fecha de inicio
            $company = Company::find($user->company_id);
            
            // Obtener los indicadores para verificar cuáles son vinculantes y binarios
            $indicators = Indicator::whereIn('id', array_keys($request->answers))
                ->select('id', 'binding', 'is_binary')
                ->get()
                ->keyBy('id');

            // Obtener las certificaciones válidas de la empresa
            $validCertifications = $company->certifications()
                ->whereRaw('fecha_expiracion > NOW() OR fecha_expiracion IS NULL')
                ->get();

            // Obtener los IDs de las certificaciones disponibles asociadas
            $homologationIds = $validCertifications->pluck('homologation_id')->filter();

            // Obtener los indicadores homologados
            $homologatedIndicators = [];
            if ($homologationIds->count() > 0) {
                $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                    ->pluck('indicator_id')
                    ->toArray();
            }

            // Guardar respuestas individuales
            foreach ($request->answers as $indicatorId => $answer) {
                // Verificar que el indicatorId sea un número válido
                if (!is_numeric($indicatorId) || $indicatorId <= 0) {
                    Log::error('ID de indicador no válido:', [
                        'indicator_id' => $indicatorId,
                        'answer' => $answer
                    ]);
                    continue; // Saltar este indicador
                }

                // Si el indicador está homologado, forzar la respuesta a "1" (Sí)
                if (in_array($indicatorId, $homologatedIndicators)) {
                    $answer = "1";
                }

                // Obtener la justificación si existe
                $justification = isset($request->justifications[$indicatorId]) ? $request->justifications[$indicatorId] : null;

                // Verificar si ya existe una respuesta para este indicador en esta empresa
                $existingAnswer = IndicatorAnswer::where('company_id', $user->company_id)
                    ->where('indicator_id', $indicatorId)
                    ->first();

                if ($existingAnswer) {
                    // Actualizar la respuesta existente
                    $existingAnswer->update([
                        'answer' => $answer,
                        'justification' => $justification,
                        'user_id' => $user->id, // Actualizar al último usuario que modificó
                        'is_binding' => $indicators[$indicatorId]->binding ?? false,
                        'updated_at' => now()
                    ]);
                } else {
                    // Crear nueva respuesta
                    IndicatorAnswer::create([
                        'user_id' => $user->id,
                        'company_id' => $user->company_id,
                        'indicator_id' => $indicatorId,
                        'answer' => $answer,
                        'justification' => $justification,
                        'is_binding' => $indicators[$indicatorId]->binding ?? false
                    ]);
                }
            }

            // Después de guardar las respuestas, calcular el progreso del valor
            $totalIndicators = 0;
            $answeredIndicators = 0;

            // Obtener todos los indicadores del valor
            $indicators = Indicator::whereHas('subcategory', function ($query) use ($request) {
                $query->where('value_id', $request->value_id);
            })
            ->where('is_active', true)
            ->where('deleted', false)
            ->whereNotIn('id', $this->excludedIndicatorIds)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->get();

            foreach ($indicators as $indicator) {
                $totalIndicators++;
                // Verificar si el indicador tiene respuesta
                $hasAnswer = IndicatorAnswer::where('company_id', $user->company_id)
                    ->where('indicator_id', $indicator->id)
                    ->exists();
                
                if ($hasAnswer) {
                    $answeredIndicators++;
                }
            }

            $progress = $totalIndicators > 0 ? round(($answeredIndicators / $totalIndicators) * 100) : 0;

            // Calcular notas por subcategoría y nota final ponderada
            $subcategoryScores = $this->calculateSubcategoryScores($request->value_id, $user->company_id);
            $finalScore = $this->calculateValueScoreWeighted($request->value_id, $user->company_id);

            // Actualizar o crear el registro de resultado del valor
            AutoEvaluationValorResult::updateOrCreate(
                [
                    'company_id' => $user->company_id,
                    'value_id' => $request->value_id,
                ],
                [
                    'nota' => $finalScore,
                    'progress' => $progress,
                    'fecha_evaluacion' => now()
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Respuestas guardadas parcialmente.',
                'value_id' => $request->value_id,
                'progress' => $progress
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar respuestas parciales:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Error al guardar respuestas parciales: ' . $e->getMessage()], 500);
        }
    }
}
