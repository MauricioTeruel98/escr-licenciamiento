<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\Indicator;
use Illuminate\Support\Facades\Storage;
use App\Models\EvaluatorAssessment;

class EvaluationAnswerController extends Controller
{
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $user = auth()->user();
            $savedAnswers = [];

            if (!$user) {
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            if (!$request->has('answers') || !is_array($request->answers)) {
                return response()->json(['message' => 'No se recibieron respuestas válidas'], 422);
            }

            $isPartialSave = $request->input('isPartialSave', false);
            $message = $isPartialSave ? 'Respuestas guardadas parcialmente' : 'Evaluación completada exitosamente';

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
                    'files' => array_map(function($path) {
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
            $user = auth()->user();

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
}
