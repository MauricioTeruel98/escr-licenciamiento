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
        $sortBy = $request->input('sort_by', 'id');
        $sortOrder = $request->input('sort_order', 'desc');

        // Lista de columnas permitidas para ordenamiento
        $allowedSortColumns = [
            'id',
            'nombre',
            'estado',
            'fecha_inicio',
            'fecha_fin',
            'progreso'
        ];

        $query = Company::query()
            ->select(
                'companies.id', 
                'companies.name as nombre', 
                'companies.authorized', 
                'companies.estado_eval', 
                'companies.fecha_calificacion_evaluador'
            )
            ->leftJoin('auto_evaluation_result', 'companies.id', '=', 'auto_evaluation_result.company_id')
            ->withCount(['indicatorAnswers', 'indicatorAnswersEvaluation'])
            ->with('autoEvaluationResult');

        // Aplicar búsqueda
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('companies.name', 'like', "%{$search}%")
                  ->orWhere('companies.estado_eval', 'like', "%{$search}%");
            });
        }

        // Aplicar ordenamiento
        if (in_array($sortBy, $allowedSortColumns)) {
            switch ($sortBy) {
                case 'nombre':
                    $query->orderBy('companies.name', $sortOrder);
                    break;
                case 'estado':
                    $query->orderBy('companies.estado_eval', $sortOrder);
                    break;
                case 'fecha_inicio':
                    $query->orderBy('auto_evaluation_result.created_at', $sortOrder);
                    break;
                case 'fecha_fin':
                    $query->orderBy('companies.fecha_calificacion_evaluador', $sortOrder);
                    break;
                case 'progreso':
                    // Ordenar por el conteo de respuestas según el estado
                    $query->orderByRaw("
                        CASE 
                            WHEN companies.estado_eval IN ('evaluacion', 'evaluacion-completada') 
                            THEN (SELECT COUNT(*) FROM indicator_answers_evaluation WHERE company_id = companies.id)
                            ELSE (SELECT COUNT(*) FROM indicator_answers WHERE company_id = companies.id)
                        END " . $sortOrder);
                    break;
                default:
                    $query->orderBy('companies.id', $sortOrder);
            }
        } else {
            $query->orderBy('companies.id', 'desc');
        }

        // Asegurarnos de que seleccionamos registros únicos
        $query->groupBy(
            'companies.id',
            'companies.name',
            'companies.authorized',
            'companies.estado_eval',
            'companies.fecha_calificacion_evaluador'
        );

        $companies = $query->paginate($perPage);

        return response()->json($companies->through(function ($company) {
            // Calcular el progreso
            $progress = 0;

            if ($company->autoEvaluationResult) {
                if (in_array($company->estado_eval, ['evaluacion', 'evaluacion-completada'])) {
                    $progress = $company->indicator_answers_evaluation_count > 0 
                        ? min(100, ($company->indicator_answers_evaluation_count / 20) * 100) 
                        : 0;
                } else {
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
                'fecha_fin' => $company->fecha_calificacion_evaluador ? 
                    $company->fecha_calificacion_evaluador->format('d/m/Y') : null,
            ];
        }));
    }
}
