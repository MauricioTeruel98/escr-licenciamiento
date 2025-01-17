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
            ->select('id', 'name')
            ->with(['autoEvaluationResult' => function($query) {
                $query->select('id', 'company_id', 'status', 'form_sended', 'created_at', 'fecha_aprobacion');
            }])
            ->withCount(['indicatorAnswers', 'indicatorAnswersEvaluation']);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $companies = $query->paginate($perPage);

        return response()->json($companies->through(function ($company) {
            // Determinar el estado y progreso
            $status = 'No aplica';
            $progress = 0;

            if ($company->autoEvaluationResult) {
                if ($company->autoEvaluationResult->form_sended) {
                    $status = 'Evaluación';
                    // Calcular progreso de evaluación
                    $progress = $company->indicator_answers_evaluation_count > 0 
                        ? min(100, ($company->indicator_answers_evaluation_count / 20) * 100) 
                        : 0;
                } else {
                    $status = 'Auto-evaluación';
                    // Calcular progreso de auto-evaluación
                    $progress = $company->indicator_answers_count > 0 
                        ? min(100, ($company->indicator_answers_count / 12) * 100) 
                        : 0;
                }
            }

            return [
                'id' => $company->id,
                'nombre' => $company->name,
                'estado' => $status,
                'progreso' => round($progress),
                'fecha_inicio' => $company->autoEvaluationResult ? $company->autoEvaluationResult->created_at->format('d/m/Y') : null,
                'fecha_fin' => $company->autoEvaluationResult && $company->autoEvaluationResult->fecha_aprobacion 
                    ? $company->autoEvaluationResult->fecha_aprobacion->format('d/m/Y') 
                    : null,
            ];
        }));
    }
}
