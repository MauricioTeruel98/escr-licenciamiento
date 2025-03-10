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

class IndicadorAnswerController extends Controller
{
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

            // Obtener los indicadores para verificar cuáles son vinculantes y binarios
            $indicators = Indicator::whereIn('id', array_keys($request->answers))
                ->select('id', 'binding', 'is_binary')
                ->get()
                ->keyBy('id');

            // Obtener las certificaciones válidas de la empresa
            $company = Company::find($user->company_id);
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

            // Calcular y guardar nota final del valor
            $finalScore = round(collect($subcategoryScores)->avg());

            AutoEvaluationValorResult::updateOrCreate(
                [
                    'company_id' => $user->company_id,
                    'value_id' => $request->value_id,
                ],
                [
                    'nota' => $finalScore,
                    'fecha_evaluacion' => now()
                ]
            );

            // Verificar estado de la autoevaluación
            $totalIndicators = Indicator::where('is_active', true)->count();
            $answeredIndicators = IndicatorAnswer::where('company_id', $user->company_id)
                ->whereHas('indicator', function($query) {
                    $query->where('is_active', true);
                })
                ->count();
            
            // Verificar respuestas vinculantes
            $hasFailedBindingQuestions = IndicatorAnswer::where('company_id', $user->company_id)
                ->where('is_binding', true)
                ->where('answer', 0)
                ->exists();

            // Verificar notas mínimas por valor
            $hasFailedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)
                ->where('nota', '<', 70)
                ->exists();

            // Determinar el estado
            $status = 'en_proceso';
            if ($answeredIndicators === $totalIndicators) {
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
                $allValues = Value::with(['subcategories.indicators'])
                    ->where('is_active', true)
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
                $companySlug = Str::slug($user->company->name); // Convertir nombre de empresa a slug
                $basePath = storage_path('app/public/autoevaluations');
                $companyPath = "{$basePath}/{$user->company_id}-{$companySlug}";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }
                
                // Generar nombre de archivo con timestamp
                $fileName = "autoevaluation_{$user->company_id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF al usuario administrador de la empresa
                $admin = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                Mail::to($admin->email)->send(new AutoEvaluationResults($fullPath, $user->company));

                $superadminuser = User::where('role', 'super_admin')->first();
                Mail::to($superadminuser->email)->send(new AutoEvaluationComplete($fullPath, $user->company));

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

        if($applicationSended && $formSended && $evaluacionCompleta){
            try {
                // Obtener todos los valores y sus respuestas
                $allValues = Value::with(['subcategories.indicators'])
                    ->where('is_active', true)
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
                $basePath = storage_path('app/public/autoevaluations');
                $companyPath = "{$basePath}/{$user->company_id}-{$companySlug}";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }
                
                // Generar nombre de archivo con timestamp
                $fileName = "autoevaluation_{$user->company_id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF al usuario administrador de la empresa
                $admin = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                try {
                    Mail::to($admin->email)->send(new AutoEvaluationResults($fullPath, $company));
                } catch (\Exception $e) {
                    Log::error('Error al enviar el correo de resultados de evaluación: ' . $e->getMessage());
                }

                $superadminuser = User::where('role', 'super_admin')->first();
                try {
                    Mail::to($superadminuser->email)->send(new AutoEvaluationComplete($fullPath, $company));
                } catch (\Exception $e) {
                    Log::error('Error al enviar el correo de resultados de evaluación al superadmin: ' . $e->getMessage());
                }

                // Actualizar la columna autoeval_ended en la tabla companies
                $company->update([
                    'autoeval_ended' => true,
                    'estado_eval' => 'auto-evaluacion-completed'
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
        // Obtener las certificaciones válidas de la empresa
        $company = Company::find($companyId);
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

        // Obtener todas las respuestas más recientes para los indicadores del valor
        $answers = DB::table('indicator_answers as ia')
            ->join('indicators as i', 'ia.indicator_id', '=', 'i.id')
            ->join('subcategories as s', 'i.subcategory_id', '=', 's.id')
            ->where('ia.company_id', $companyId)
            ->where('s.value_id', $valueId)
            ->select('s.id as subcategory_id', 'ia.answer', 'i.id as indicator_id')
            ->orderBy('ia.updated_at', 'desc') // Asegurar que tomamos las respuestas más recientes
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
            
            // Si el indicador está homologado, contar como respuesta positiva (1)
            if ($answer->answer == 1 || in_array($answer->indicator_id, $homologatedIndicators)) {
                $scores[$answer->subcategory_id]['positive']++;
            }
        }

        // Calcular porcentaje por subcategoría
        return array_map(function ($subcategoryStats) {
            if ($subcategoryStats['total'] === 0) return 0;
            return round(($subcategoryStats['positive'] / $subcategoryStats['total']) * 100);
        }, $scores);
    }

    /**
     * Verifica si la autoevaluación está completa para una empresa
     * 
     * @param int $companyId ID de la empresa
     * @return bool True si la autoevaluación está completa, false en caso contrario
     */
    private function isAutoEvaluationComplete($companyId)
    {
        $activeValues = Value::where('is_active', true)->count();
        $evaluatedValues = AutoEvaluationValorResult::where('company_id', $companyId)->count();

        $numeroDeIndicadoresAResponder = Indicator::where('is_active', true)->count();

        $numeroDeIndicadoresRespondidos = IndicatorAnswer::where('company_id', $companyId)
            ->whereHas('indicator', function($query) {
                $query->where('is_active', true);
            })
            ->count();
        
        $isComplete = $numeroDeIndicadoresAResponder === $numeroDeIndicadoresRespondidos;
        
        Log::info('Verificación de autoevaluación completa:', [
            'company_id' => $companyId,
            'active_values' => $activeValues,
            'evaluated_values' => $evaluatedValues,
            'is_complete' => $isComplete
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
                $allValues = Value::with(['subcategories.indicators'])
                    ->where('is_active', true)
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
                $basePath = storage_path('app/public/autoevaluations');
                $companyPath = "{$basePath}/{$companyId}-{$companySlug}";

                // Crear carpetas si no existen
                if (!file_exists($basePath)) {
                    mkdir($basePath, 0755, true);
                }
                if (!file_exists($companyPath)) {
                    mkdir($companyPath, 0755, true);
                }
                
                // Generar nombre de archivo con timestamp
                $fileName = "autoevaluation_{$companyId}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                $fullPath = "{$companyPath}/{$fileName}";

                // Guardar PDF
                $pdf->save($fullPath);

                // Enviar email con PDF al usuario administrador de la empresa
                $admin = User::where('company_id', $companyId)->where('role', 'admin')->first();
                try {
                    Mail::to($admin->email)->send(new AutoEvaluationResults($fullPath, $company));
                } catch (\Exception $e) {
                    Log::error('Error al enviar el correo de resultados de evaluación: ' . $e->getMessage());
                }

                $superadminuser = User::where('role', 'super_admin')->first();
                try {
                    Mail::to($superadminuser->email)->send(new AutoEvaluationComplete($fullPath, $company));
                } catch (\Exception $e) {
                    Log::error('Error al enviar el correo de resultados de evaluación al superadmin: ' . $e->getMessage());
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
}
