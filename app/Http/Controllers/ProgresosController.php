<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class ProgresosController extends Controller
{
    public function getCompanies(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('per_page', 10);

        $query = Company::query()
            ->select('id', 'name as nombre', 'authorized', 'estado_eval')
            ->orderBy('id', 'desc')
            ->withCount(['indicatorAnswers', 'indicatorAnswersEvaluation'])
            ->with('autoEvaluationResult');

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('estado_eval', 'like', "%{$search}%");
        }

        $companies = $query->paginate($perPage);

        return response()->json($companies->through(function ($company) {
            // Determinar el progreso basado en el estado
            $progress = 0;

            if ($company->autoEvaluationResult) {
                if (in_array($company->estado_eval, ['evaluacion', 'evaluacion-completada'])) {
                    // Calcular progreso de evaluación
                    $progress = $company->indicator_answers_evaluation_count > 0 
                        ? min(100, ($company->indicator_answers_evaluation_count / 20) * 100) 
                        : 0;
                } else {
                    // Calcular progreso de auto-evaluación
                    $progress = $company->indicator_answers_count > 0 
                        ? min(100, ($company->indicator_answers_count / 12) * 100) 
                        : 0;
                }
            }

            return [
                'id' => $company->id,
                'nombre' => $company->nombre,
                'estado' => $company->formatted_state,
                'progreso' => $progress,
                'authorized' => $company->authorized,
                'form_sended' => $company->autoEvaluationResult ? 
                    $company->autoEvaluationResult->form_sended : false,
                'fecha_inicio' => $company->autoEvaluationResult ? 
                    $company->autoEvaluationResult->created_at->format('d/m/Y') : null,
                'fecha_fin' => $company->autoEvaluationResult && 
                    $company->autoEvaluationResult->fecha_aprobacion ? 
                    $company->autoEvaluationResult->fecha_aprobacion->format('d/m/Y') : null,
            ];
        }));
    }
}
