<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\EvaluationQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\Indicator;
use Illuminate\Support\Facades\Storage;
use App\Models\EvaluatorAssessment;
use App\Notifications\EvaluationCompletedNotification;
use App\Notifications\EvaluationCompletedNotificationSuperAdmin;
use App\Notifications\EvaluationCalificatedNotification;
use App\Notifications\EvaluationCalificatedNotificationSuperAdmin;
use App\Models\User;
use App\Models\Value;
use App\Models\EvaluationValueResult;
use App\Models\IndicatorAnswer;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

class EvaluationAnswerController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();
            $savedAnswers = [];

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            // Validar tipos de archivos permitidos
            $validationResult = $this->validateFileTypes($request);
            if (!$validationResult['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => $validationResult['message']
                ], 422);
            }

            $isPartialSave = $request->input('isPartialSave', false);
            $message = $isPartialSave ? 'Respuestas guardadas correctamente' : 'Evaluación completada exitosamente';

            foreach ($request->answers as $questionId => $answerData) {
                // Si es evaluador, guardar la evaluación
                if ($user->role === 'evaluador') {
                    $evaluationQuestion = \App\Models\EvaluationQuestion::findOrFail($questionId);

                    // Guardar o actualizar la evaluación
                    EvaluatorAssessment::updateOrCreate(
                        [
                            'company_id' => $user->company_id,
                            'evaluation_question_id' => $questionId,
                        ],
                        [
                            'user_id' => $user->id,
                            'indicator_id' => $evaluationQuestion->indicator_id,
                            'approved' => $answerData['approved'] ?? false,
                            'comment' => $answerData['evaluator_comment'] ?? null,
                        ]
                    );

                    // Si es el último indicador del valor actual, calcular y guardar los resultados
                    if (!$isPartialSave) {
                        // Obtener el valor actual
                        $valueId = $request->input('value_id');

                        // Calcular la puntuación del valor
                        $valueScore = $this->calculateValueScore($valueId, $user->company_id);

                        // Guardar el resultado en la tabla evaluation_value_result
                        \App\Models\EvaluationValueResult::updateOrCreate(
                            [
                                'company_id' => $user->company_id,
                                'value_id' => $valueId,
                            ],
                            [
                                'nota' => $valueScore,
                                'fecha_evaluacion' => now()
                            ]
                        );
                    }

                    // No continuar con el proceso de guardar respuestas si es evaluador
                    continue;
                }

                // Validar estructura de datos
                if (!isset($answerData['value'])) {
                    continue;
                }

                // Obtener la pregunta de evaluación y su indicador asociado
                $evaluationQuestion = \App\Models\EvaluationQuestion::findOrFail($questionId);

                // Inicializar array de rutas de archivo
                $filePaths = [];

                // Mantener archivos existentes
                if (isset($answerData['existing_files']) && is_array($answerData['existing_files'])) {
                    foreach ($answerData['existing_files'] as $existingFile) {
                        $fileData = json_decode($existingFile, true);
                        if (isset($fileData['path'])) {
                            $filePaths[] = $fileData['path'];
                        }
                    }
                }

                // Agregar nuevos archivos
                if (isset($answerData['files']) && is_array($answerData['files'])) {
                    foreach ($answerData['files'] as $file) {
                        if ($file instanceof \Illuminate\Http\UploadedFile) {
                            $fileName = time() . '_' . $file->getClientOriginalName();
                            $path = $file->storeAs(
                                'evaluation-files/company_' . $user->company_id,
                                $fileName,
                                'public'
                            );
                            $filePaths[] = $path;
                        }
                    }
                }

                // Verificar si ya existe una respuesta
                $existingAnswer = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                    ->where('evaluation_question_id', $questionId)
                    ->first();

                $answerData = [
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'indicator_id' => $evaluationQuestion->indicator_id,
                    'evaluation_question_id' => $questionId,
                    'answer' => $answerData['value'],
                    'description' => $answerData['description'] ?? null,
                    'file_path' => json_encode($filePaths), // Guardamos todos los paths
                    'approved' => $user->role === 'evaluador' ? $answerData['approved'] : null
                ];

                if ($existingAnswer) {
                    $existingAnswer->update($answerData);
                    $answer = $existingAnswer;
                } else {
                    $answer = IndicatorAnswerEvaluation::create($answerData);
                }

                // Guardar la respuesta procesada
                $savedAnswers[$questionId] = [
                    'value' => $answer->answer,
                    'description' => $answer->description,
                    'files' => array_map(function ($path) {
                        return [
                            'name' => basename($path),
                            'path' => $path,
                            'size' => file_exists(storage_path('app/public/' . $path)) ?
                                filesize(storage_path('app/public/' . $path)) : 0,
                            'type' => mime_content_type(storage_path('app/public/' . $path)) ?? 'application/octet-stream'
                        ];
                    }, json_decode($answer->file_path) ?? [])
                ];
            }

            DB::commit();

            // Verificar si este es el último valor
            $isLastValue = Value::where('is_active', true)
                ->orderBy('id', 'desc')
                ->first()->id == $request->value_id;

            // Enviar notificación al completar la evaluación
            if ($isLastValue) {
                $adminUser = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                $superAdminUser = User::where('role', 'super_admin')->first();

                // Si el usuario es evaluador y es el último valor, generar PDF con los resultados
                if ($user->role === 'evaluador') {
                    // Obtener todos los valores
                    $allValues = Value::where('is_active', true)->get();

                    // Obtener la empresa evaluada
                    $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                    // Obtener las puntuaciones finales
                    $finalScores = EvaluationValueResult::where('company_id', $user->company_id)
                        ->get()
                        ->keyBy('value_id');

                    // Obtener todas las evaluaciones del evaluador para esta empresa
                    $evaluatorAssessments = EvaluatorAssessment::where('company_id', $user->company_id)
                        ->with(['evaluationQuestion', 'indicator'])
                        ->get()
                        ->groupBy('indicator_id');

                    // Obtener todas las respuestas de la empresa
                    $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                        ->with(['evaluationQuestion', 'indicator'])
                        ->get()
                        ->groupBy('indicator_id');

                    // Obtener todas las respuestas de autoevaluación
                    $autoEvaluationAnswers = \App\Models\IndicatorAnswer::where('company_id', $user->company_id)
                        ->with(['indicator'])
                        ->get()
                        ->groupBy('indicator_id');

                    // Agrupar indicadores por valor
                    $indicatorsByValue = Indicator::where('is_active', true)
                        ->with(['subcategory.value', 'evaluationQuestions'])
                        ->get()
                        ->groupBy('subcategory.value.id');

                    // Generar PDF con los resultados
                    $pdf = Pdf::loadView('pdf/evaluation', [
                        'values' => $allValues,
                        'company' => $company,
                        'evaluador' => $user,
                        'date' => now()->format('d/m/Y'),
                        'finalScores' => $finalScores,
                        'evaluatorAssessments' => $evaluatorAssessments,
                        'companyAnswers' => $companyAnswers,
                        'autoEvaluationAnswers' => $autoEvaluationAnswers,
                        'indicatorsByValue' => $indicatorsByValue
                    ]);

                    // Crear estructura de carpetas para la empresa
                    $companySlug = Str::slug($company->name); // Convertir nombre de empresa a slug
                    $basePath = storage_path('app/public/evaluations');
                    $companyPath = "{$basePath}/{$company->id}-{$companySlug}";

                    // Crear carpetas si no existen
                    if (!file_exists($basePath)) {
                        mkdir($basePath, 0755, true);
                    }
                    if (!file_exists($companyPath)) {
                        mkdir($companyPath, 0755, true);
                    }

                    // Generar nombre de archivo con timestamp
                    $fileName = "evaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                    $fullPath = "{$companyPath}/{$fileName}";

                    // Guardar PDF
                    $pdf->save($fullPath);

                    // Enviar email con PDF al usuario administrador de la empresa
                    if ($adminUser) {
                        Mail::to($adminUser->email)->send(new \App\Mail\EvaluationResults($fullPath, $company));
                    }

                    // Enviar email con PDF al superadmin
                    if ($superAdminUser) {
                        Mail::to($superAdminUser->email)->send(new \App\Mail\EvaluationResultsSuperAdmin($fullPath, $company));
                    }

                    $company->estado_eval = 'evaluado';

                    $company->save();
                }

                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                // Verificar si ya se enviaron las notificaciones para evitar duplicados
                if (!$this->notificationsAlreadySent($user->company_id, $request->value_id)) {
                    $adminUser = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                    $superAdminUser = User::where('role', 'super_admin')->first();

                    if ($adminUser) {
                        $adminUser->notify(new EvaluationCompletedNotification($user, $company->name));
                    }
                    if ($superAdminUser) {
                        $superAdminUser->notify(new EvaluationCompletedNotificationSuperAdmin($user, $company->name));
                    }

                    // Registrar que se enviaron las notificaciones
                    $this->markNotificationsAsSent($user->company_id, $request->value_id);

                    $company->estado_eval = 'evaluacion-completada';
                    $company->save();
                }
            }

            return response()->json([
                'success' => true,
                'message' => $user->role === 'evaluador' ?
                    '¡Evaluación guardada exitosamente!' :
                    $message,
                'savedAnswers' => $savedAnswers,
                'isPartialSave' => $isPartialSave
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar: ' . $e->getMessage()
            ], 422);
        }
    }

    public function deleteFile(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            $questionId = $request->indicator_id;
            $filePath = $request->file_path;

            // Buscar la respuesta usando evaluation_question_id
            $answer = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                ->where('evaluation_question_id', $questionId)
                ->first();

            if (!$answer) {
                return response()->json(['message' => 'Respuesta no encontrada'], 404);
            }

            // Obtener array de archivos actual
            $files = json_decode($answer->file_path, true) ?? [];

            // Encontrar y eliminar el archivo específico
            if (($key = array_search($filePath, $files)) !== false) {
                // Eliminar el archivo del storage
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }

                // Eliminar la ruta del archivo del array
                unset($files[$key]);

                // Reindexar el array y actualizar en la base de datos
                $files = array_values($files);
                $answer->file_path = json_encode($files);
                $answer->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Archivo eliminado correctamente',
                    'files' => $files
                ]);
            }

            return response()->json(['message' => 'Archivo no encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Error al eliminar archivo:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    // Método para obtener las evaluaciones existentes
    public function getEvaluations($companyId)
    {
        try {
            $evaluations = EvaluatorAssessment::where('company_id', $companyId)
                ->with(['indicator', 'evaluationQuestion'])
                ->get();

            return response()->json([
                'success' => true,
                'evaluations' => $evaluations
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener evaluaciones:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener evaluaciones: ' . $e->getMessage()
            ], 422);
        }
    }

    public function storeByIndicator(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();
            $savedAnswers = [];

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            // Validar tipos de archivos permitidos
            $validationResult = $this->validateFileTypes($request);
            if (!$validationResult['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => $validationResult['message']
                ], 422);
            }

            $isPartialSave = $request->input('isPartialSave', false);
            $message = $isPartialSave ? 'Respuestas guardadas correctamente' : 'Evaluación completada exitosamente';
            $indicatorId = $request->input('indicator_id');

            foreach ($request->answers as $questionId => $answerData) {
                // Si es evaluador, guardar la evaluación
                if ($user->role === 'evaluador') {
                    $evaluationQuestion = \App\Models\EvaluationQuestion::findOrFail($questionId);

                    // Guardar o actualizar la evaluación
                    EvaluatorAssessment::updateOrCreate(
                        [
                            'company_id' => $user->company_id,
                            'evaluation_question_id' => $questionId,
                        ],
                        [
                            'user_id' => $user->id,
                            'indicator_id' => $evaluationQuestion->indicator_id,
                            'approved' => $answerData['approved'] ?? false,
                            'comment' => $answerData['evaluator_comment'] ?? null,
                        ]
                    );

                    // Obtener el valor actual
                    $valueId = $request->input('value_id');

                    // Calcular la puntuación del valor
                    $valueScore = $this->calculateValueScore($valueId, $user->company_id);

                    // Guardar el resultado en la tabla evaluation_value_result
                    \App\Models\EvaluationValueResult::updateOrCreate(
                        [
                            'company_id' => $user->company_id,
                            'value_id' => $valueId,
                        ],
                        [
                            'nota' => $valueScore,
                            'fecha_evaluacion' => now()
                        ]
                    );

                    // Verificar si este es el último valor
                    /*
                    $isLastValue = Value::where('is_active', true)
                        ->orderBy('id', 'desc')
                        ->first()->id == $request->value_id;

                    if ($isLastValue) {
                        $adminUser = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                        $superAdminUser = User::where('role', 'super_admin')->first();


                        $companyName = $user->company->name; // Obtener el nombre de la empresa

                        if ($adminUser) {
                            $adminUser->notify(new EvaluationCalificatedNotification($user, $companyName));
                        }
                        if ($superAdminUser) {
                            $superAdminUser->notify(new EvaluationCalificatedNotificationSuperAdmin($user, $companyName));
                        }
                    }*/

                    // No continuar con el proceso de guardar respuestas si es evaluador
                    continue;
                }

                // Validar estructura de datos
                if (!isset($answerData['value'])) {
                    continue;
                }

                // Obtener la pregunta de evaluación y su indicador asociado
                $evaluationQuestion = \App\Models\EvaluationQuestion::findOrFail($questionId);

                // Inicializar array de rutas de archivo
                $filePaths = [];

                // Mantener archivos existentes
                if (isset($answerData['existing_files']) && is_array($answerData['existing_files'])) {
                    foreach ($answerData['existing_files'] as $existingFile) {
                        $fileData = json_decode($existingFile, true);
                        if (isset($fileData['path'])) {
                            $filePaths[] = $fileData['path'];
                        }
                    }
                }

                // Agregar nuevos archivos
                if (isset($answerData['files']) && is_array($answerData['files'])) {
                    foreach ($answerData['files'] as $file) {
                        if ($file instanceof \Illuminate\Http\UploadedFile) {
                            $fileName = time() . '_' . $file->getClientOriginalName();
                            $path = $file->storeAs(
                                'evaluation-files/company_' . $user->company_id,
                                $fileName,
                                'public'
                            );
                            $filePaths[] = $path;
                        }
                    }
                }

                // Verificar si ya existe una respuesta
                $existingAnswer = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                    ->where('evaluation_question_id', $questionId)
                    ->first();

                $answerData = [
                    'user_id' => $user->id,
                    'company_id' => $user->company_id,
                    'indicator_id' => $evaluationQuestion->indicator_id,
                    'evaluation_question_id' => $questionId,
                    'answer' => $answerData['value'],
                    'description' => $answerData['description'] ?? null,
                    'file_path' => json_encode($filePaths), // Guardamos todos los paths
                    'approved' => $user->role === 'evaluador' ? $answerData['approved'] : null
                ];

                if ($existingAnswer) {
                    $existingAnswer->update($answerData);
                    $answer = $existingAnswer;
                } else {
                    $answer = IndicatorAnswerEvaluation::create($answerData);
                }

                // Guardar la respuesta procesada
                $savedAnswers[$questionId] = [
                    'value' => $answer->answer,
                    'description' => $answer->description,
                    'files' => array_map(function ($path) {
                        return [
                            'name' => basename($path),
                            'path' => $path,
                            'size' => file_exists(storage_path('app/public/' . $path)) ?
                                filesize(storage_path('app/public/' . $path)) : 0,
                            'type' => mime_content_type(storage_path('app/public/' . $path)) ?? 'application/octet-stream'
                        ];
                    }, json_decode($answer->file_path) ?? [])
                ];
            }

            // Obtener los IDs de los indicadores respondidos con "sí"
            $indicatorIds = IndicatorAnswer::where('company_id', $user->company_id)
                ->where(function ($query) {
                    $query->whereIn('answer', ['1', 'si', 'sí', 'yes', 1, true]);
                })
                ->pluck('indicator_id'); // Obtener solo los IDs

            // Contar las preguntas asociadas a esos indicadores
            $numeroDePreguntasQueVaAResponderLaEmpresa = EvaluationQuestion::whereIn('indicator_id', $indicatorIds)->count();

            $numeroDePreguntasQueRespondioLaEmpresa = IndicatorAnswerEvaluation::where('company_id', $user->company_id)->count();

            $numeroDePreguntasQueClificoElEvaluador = EvaluatorAssessment::where('company_id', $user->company_id)->count();

            // Enviar notificación al completar la evaluación
            if ($numeroDePreguntasQueRespondioLaEmpresa == $numeroDePreguntasQueVaAResponderLaEmpresa && $user->role !== 'evaluador') {
                $adminUser = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                $superAdminUser = User::where('role', 'super_admin')->first();

                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                // Verificar si ya se enviaron las notificaciones para evitar duplicados
                if (!$this->notificationsAlreadySent($user->company_id, $request->value_id)) {
                    if ($adminUser) {
                        $adminUser->notify(new EvaluationCompletedNotification($user, $company->name));
                    }
                    if ($superAdminUser) {
                        $superAdminUser->notify(new EvaluationCompletedNotificationSuperAdmin($user, $company->name));
                    }

                    // Registrar que se enviaron las notificaciones
                    $this->markNotificationsAsSent($user->company_id, $request->value_id);
                }

                $company->estado_eval = 'evaluacion-completada';
                $company->save();
            }
            // Si el usuario es evaluador y es el último valor, generar PDF con los resultados
            if ($user->role === 'evaluador' && $numeroDePreguntasQueClificoElEvaluador == $numeroDePreguntasQueVaAResponderLaEmpresa) {

                $adminUser = User::where('company_id', $user->company_id)->where('role', 'admin')->first();
                $superAdminUser = User::where('role', 'super_admin')->first();

                // Obtener todos los valores
                $allValues = Value::where('is_active', true)->get();

                // Obtener la empresa evaluada
                $company = Company::with(['infoAdicional', 'users', 'certifications'])->find($user->company_id);

                // Obtener las puntuaciones finales
                $finalScores = EvaluationValueResult::where('company_id', $user->company_id)
                    ->get()
                    ->keyBy('value_id');

                // Obtener todas las evaluaciones del evaluador para esta empresa
                $evaluatorAssessments = EvaluatorAssessment::where('company_id', $user->company_id)
                    ->with(['evaluationQuestion', 'indicator'])
                    ->get()
                    ->groupBy('indicator_id');

                // Obtener todas las respuestas de la empresa
                $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                    ->with(['evaluationQuestion', 'indicator'])
                    ->get()
                    ->groupBy('indicator_id');

                // Obtener todas las respuestas de autoevaluación
                $autoEvaluationAnswers = \App\Models\IndicatorAnswer::where('company_id', $user->company_id)
                    ->with(['indicator'])
                    ->get()
                    ->groupBy('indicator_id');


                // Agrupar indicadores por valor
                $indicatorsByValue = Indicator::where('is_active', true)
                    ->with(['subcategory.value', 'evaluationQuestions'])
                    ->get()
                    ->groupBy('subcategory.value.id');

                if (!$this->notificationsAlreadySent($user->company_id, $request->value_id)) {

                    // Generar PDF con los resultados
                    $pdf = Pdf::loadView('pdf/evaluation', [
                        'values' => $allValues,
                        'company' => $company,
                        'evaluador' => $user,
                        'date' => now()->format('d/m/Y'),
                        'finalScores' => $finalScores,
                        'evaluatorAssessments' => $evaluatorAssessments,
                        'companyAnswers' => $companyAnswers,
                        'autoEvaluationAnswers' => $autoEvaluationAnswers,
                        'indicatorsByValue' => $indicatorsByValue
                    ]);

                    // Crear estructura de carpetas para la empresa
                    $companySlug = Str::slug($company->name); // Convertir nombre de empresa a slug
                    $basePath = storage_path('app/public/evaluations');
                    $companyPath = "{$basePath}/{$company->id}-{$companySlug}";

                    // Crear carpetas si no existen
                    if (!file_exists($basePath)) {
                        mkdir($basePath, 0755, true);
                    }
                    if (!file_exists($companyPath)) {
                        mkdir($companyPath, 0755, true);
                    }

                    // Generar nombre de archivo con timestamp
                    $fileName = "evaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
                    $fullPath = "{$companyPath}/{$fileName}";

                    // Guardar PDF
                    $pdf->save($fullPath);

                    // Enviar email con PDF al usuario administrador de la empresa
                    if ($adminUser) {
                        Mail::to($adminUser->email)->send(new \App\Mail\EvaluationResults($fullPath, $company));
                    }

                    // Enviar email con PDF al superadmin
                    if ($superAdminUser) {
                        Mail::to($superAdminUser->email)->send(new \App\Mail\EvaluationResultsSuperAdmin($fullPath, $company));
                    }

                    // Registrar que se enviaron las notificaciones
                    $this->markNotificationsAsSent($user->company_id, $request->value_id);
                }
                $company->estado_eval = 'evaluado';
                $company->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $user->role === 'evaluador' ?
                    '¡Evaluación guardada exitosamente!' :
                    $message,
                'savedAnswers' => $savedAnswers,
                'indicator_id' => $indicatorId
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar las respuestas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valida que los archivos subidos sean de los tipos permitidos
     * (jpg, jpeg, png, pdf, excel y word) y no excedan el tamaño máximo
     * 
     * @param Request $request
     * @return array
     */
    private function validateFileTypes(Request $request)
    {
        $allowedTypes = [
            // Imágenes
            'image/jpeg',
            'image/jpg',
            'image/png',
            // PDF
            'application/pdf',
            // Excel
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // Word
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        // Tamaño máximo: 2MB
        $maxSize = 2 * 1024 * 1024;

        // Número máximo de archivos por pregunta
        $maxFiles = 3;

        $errorMessages = [];

        if ($request->has('answers') && is_array($request->answers)) {
            foreach ($request->answers as $questionId => $answerData) {
                if (isset($answerData['files']) && is_array($answerData['files'])) {
                    // Verificar que no se exceda el número máximo de archivos por pregunta
                    if (count($answerData['files']) > $maxFiles) {
                        $errorMessages[] = "Solo se permite subir hasta {$maxFiles} archivos por pregunta.";
                        continue;
                    }

                    foreach ($answerData['files'] as $index => $file) {
                        if ($file instanceof \Illuminate\Http\UploadedFile) {
                            // Validar tipo de archivo
                            if (!in_array($file->getMimeType(), $allowedTypes)) {
                                $errorMessages[] = "El archivo '{$file->getClientOriginalName()}' no es de un tipo permitido. Solo se permiten archivos jpg, jpeg, png, pdf, excel y word.";
                            }

                            // Validar tamaño de archivo
                            if ($file->getSize() > $maxSize) {
                                $errorMessages[] = "El archivo '{$file->getClientOriginalName()}' excede el tamaño máximo permitido de 2MB.";
                            }
                        }
                    }
                }
            }
        }

        if (!empty($errorMessages)) {
            return [
                'valid' => false,
                'message' => implode("\n", $errorMessages)
            ];
        }

        return ['valid' => true];
    }

    /**
     * Calcula la puntuación de un valor basado en las evaluaciones del evaluador
     * 
     * @param int $valueId ID del valor
     * @param int $companyId ID de la empresa
     * @return int Puntuación calculada (0-100)
     */
    private function calculateValueScore($valueId, $companyId)
    {
        // Obtener todos los indicadores asociados al valor
        $indicators = \App\Models\Indicator::where('value_id', $valueId)
            ->where('is_active', true)
            ->pluck('id');

        if ($indicators->isEmpty()) {
            return 0;
        }

        // Obtener todas las evaluaciones para estos indicadores
        $evaluations = EvaluatorAssessment::where('company_id', $companyId)
            ->whereIn('indicator_id', $indicators)
            ->get();

        if ($evaluations->isEmpty()) {
            return 0;
        }

        // Calcular el porcentaje de aprobación
        $totalEvaluations = $evaluations->count();
        $approvedEvaluations = $evaluations->where('approved', true)->count();

        // Calcular y redondear el porcentaje
        return round(($approvedEvaluations / $totalEvaluations) * 100);
    }

    /**
     * Verifica si ya se enviaron notificaciones para esta empresa y valor
     * 
     * @param int $companyId
     * @param int $valueId
     * @return bool
     */
    private function notificationsAlreadySent($companyId, $valueId)
    {
        // Usar cache para verificar si ya se enviaron notificaciones
        $cacheKey = "notifications_sent_{$companyId}_{$valueId}";
        return Cache::has($cacheKey);
    }

    /**
     * Marca las notificaciones como enviadas para esta empresa y valor
     * 
     * @param int $companyId
     * @param int $valueId
     * @return void
     */
    private function markNotificationsAsSent($companyId, $valueId)
    {
        // Guardar en cache que ya se enviaron notificaciones (expira en 24 horas)
        $cacheKey = "notifications_sent_{$companyId}_{$valueId}";
        Cache::put($cacheKey, true, now()->addHours(12));
    }
}
