<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\IndicatorAnswerEvaluation;
use Illuminate\Support\Str;

class EvaluationAnswerController extends Controller 
{
    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            $company = $user->company;
            
            // Validar request
            $request->validate([
                'answers' => 'required|array',
                'answers.*.question_id' => 'required|exists:evaluation_questions,id',
                'answers.*.value' => 'required|boolean',
                'answers.*.description' => 'required|string',
                'answers.*.files' => 'nullable|array'
            ]);

            foreach ($request->answers as $answer) {
                $filePaths = [];
                
                // Procesar archivos si existen
                if (!empty($answer['files'])) {
                    foreach ($answer['files'] as $file) {
                        // Crear nombre único para el archivo
                        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
                        
                        // Guardar archivo en carpeta de la empresa
                        $path = $file->storeAs(
                            "companies/{$company->id}/evaluations",
                            $fileName,
                            'public'
                        );
                        
                        $filePaths[] = $path;
                    }
                }

                // Guardar respuesta
                IndicatorAnswerEvaluation::create([
                    'user_id' => $user->id,
                    'company_id' => $company->id,
                    'indicator_id' => $answer['indicator_id'],
                    'answer' => $answer['value'],
                    'description' => $answer['description'],
                    'file_path' => json_encode($filePaths)
                ]);
            }

            return response()->json([
                'message' => 'Evaluación guardada exitosamente',
                'success' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al guardar la evaluación: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}

?>