<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\InfoAdicionalEmpresa;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\EvaluationQuestion;
use App\Models\EvaluationValueResult;
use Illuminate\Support\Facades\Auth;
use App\Models\IndicatorHomologation;
use App\Models\Certification;
use App\Models\Value;
use App\Models\EvaluatorAssessment;
class EvaluadorController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $company = Company::find($user->company_id);

        // Verificar si existe la empresa antes de acceder a sus propiedades
        if ($company && !$company->fecha_inicio_auto_evaluacion) {
            //$company->fecha_inicio_auto_evaluacion = now()->startOfDay();
            $company->fecha_inicio_auto_evaluacion = $company->created_at;
            $company->save();
        }

        // Verificar si la compañía existe
        if (!$company) {
            return Inertia::render('Evaluador/Dashboard', [
                'valuesProgressEvaluacion' => [],
                'error' => 'No se encontró la compañía asociada a este usuario'
            ]);
        }

        $certificaciones = Certification::where('company_id', $user->company_id)
            ->where(function ($query) {
                $query->whereNull('fecha_expiracion')
                    ->orWhere('fecha_expiracion', '>=', now()->startOfDay());
            })
            ->get();

        // Obtener indicadores homologados
        $homologatedIndicators = [];
        if ($certificaciones->count() > 0) {
            $homologationIds = $certificaciones->pluck('homologation_id')->filter()->toArray();
            if (!empty($homologationIds)) {
                $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                    ->whereHas('indicator', function ($query) use ($company) {
                        $query->where('is_active', true)
                            ->where('deleted', false)
                            ->where(function ($q) use ($company) {
                                $q->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            });
                    })
                    ->pluck('indicator_id')
                    ->toArray();
            }
        }
        // Obtener todos los valores activos con sus resultados
        $values = Value::where('is_active', true)
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->orderBy('name')
            ->with(['subcategories' => function ($query) use ($company) {
                $query->where('deleted', false)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->with(['indicators' => function ($query) use ($company) {
                        $query->where('deleted', false)
                            ->where(function ($q) use ($company) {
                                $q->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            });
                    }]);
            }])
            ->get();
        $valueEvaluationResults = EvaluationValueResult::where('company_id', $user->company_id)
            ->get()
            ->keyBy('value_id');
        // Calcular progreso para cada valor Evaluación
        $valuesProgressEvaluacion = $values->map(function ($value) use ($valueEvaluationResults, $homologatedIndicators, $company) {
            $totalQuestions = 0;
            $answeredQuestions = 0;
            $result = EvaluationValueResult::where('company_id', Auth::user()->company_id)
                ->where('value_id', $value->id)
                ->first();

            // Obtener todos los indicadores para este valor
            $indicators = Indicator::whereHas('subcategory', function ($query) use ($value) {
                $query->where('value_id', $value->id)
                    ->where('deleted', false);
            })
                ->where('is_active', true)
                ->where('deleted', false)
                ->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get();

            foreach ($indicators as $indicator) {
                // Verificar si el indicador tiene respuesta afirmativa
                $indicatorAnswer = IndicatorAnswer::where('company_id', Auth::user()->company_id)
                    ->where('indicator_id', $indicator->id)
                    ->where(function ($query) {
                        $query->where('answer', '1')
                            ->orWhere('answer', 'si')
                            ->orWhere('answer', 'sí')
                            ->orWhere('answer', 'yes')
                            ->orWhere('answer', 1)
                            ->orWhere('answer', true);
                    })
                    ->first();

                // Solo contar preguntas si el indicador tiene respuesta afirmativa
                if ($indicatorAnswer) {
                    // Contar preguntas de evaluación para este indicador
                    $evaluationQuestions = EvaluationQuestion::where('indicator_id', $indicator->id)
                        ->where('deleted', false)
                        ->get();

                    $totalQuestions += $evaluationQuestions->count();

                    // Verificar si el indicador está homologado
                    $isHomologated = in_array($indicator->id, $homologatedIndicators);

                    if ($isHomologated) {
                        // Si está homologado, todas sus preguntas se consideran respondidas
                        $answeredQuestions += $evaluationQuestions->count();
                    } else {
                        // Contar respuestas de evaluación para este indicador
                        $answeredCount = EvaluatorAssessment::where('company_id', Auth::user()->company_id)
                            ->where('indicator_id', $indicator->id)
                            ->whereIn('evaluation_question_id', $evaluationQuestions->pluck('id'))
                            ->count();

                        $answeredQuestions += $answeredCount;
                    }
                }
            }

            return [
                'id' => $value->id,
                'name' => $value->name,
                'total_questions' => $totalQuestions,
                'answered_questions' => $answeredQuestions,
                'progress' => $totalQuestions > 0 ? round(($answeredQuestions / $totalQuestions) * 100) : 0,
                'result' => $result,
            ];
        });

        return Inertia::render('Evaluador/Dashboard', [
            'valuesProgressEvaluacion' => $valuesProgressEvaluacion
        ]);
    }

    public function evaluations()
    {
        return Inertia::render('Evaluador/Evaluations');
    }

    public function getCompaniesList(Request $request)
    {
        try {
            $user = auth()->user();
            $query = $user->evaluatedCompanies()->withCount('users');

            // Búsqueda
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('estado_eval', 'like', "%{$searchTerm}%");
                });
            }

            // Ordenamiento
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $allowedSortFields = ['name', 'estado_eval', 'created_at'];

            if (in_array($sortBy, $allowedSortFields)) {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Paginación
            $perPage = $request->input('per_page', 10);
            $companies = $query->paginate($perPage);

            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las empresas'], 500);
        }
    }

    public function getCompaniesListToSelect()
    {
        try {
            $user = auth()->user();
            $companies = $user->evaluatedCompanies()->withCount('users')->orderBy('created_at', 'desc')->get();
            return response()->json($companies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las empresas'], 500);
        }
    }

    public function getActiveCompany()
    {
        // Obtener la empresa actual del usuario
        $user = auth()->user();
        if ($user->company_id) {
            $company = Company::find($user->company_id);
            return response()->json($company);
        }
        return response()->json(null);
    }

    public function switchCompany(Request $request)
    {
        $companyId = $request->input('company_id');
        $user = auth()->user();

        if ($companyId) {
            $company = Company::findOrFail($companyId);
            // Actualizar el company_id del usuario
            $user->company_id = $company->id;
            $user->save();
        } else {
            // Si no hay company_id, establecerlo como null
            $user->company_id = null;
            $user->save();
        }

        return response()->json(['success' => true]);
    }

    public function companies()
    {
        $companies = Company::with(['users' => function ($query) {
            $query->where('role', 'admin');
        }])
            ->withCount('users')
            ->latest()
            ->paginate(10);

        return Inertia::render('Evaluador/Empresas/Index', [
            'companies' => $companies
        ]);
    }

    public function reportes()
    {
        return Inertia::render('Evaluador/ReportesEvaluador');
    }

    public function updateEvaluationFields(Request $request)
    {
        $request->validate([
            'puntos_fuertes' => 'required|string',
            'oportunidades' => 'required|string',
            'tiene_multi_sitio' => 'required|boolean',
            'cantidad_multi_sitio' => 'nullable|required_if:tiene_multi_sitio,true|integer',
            'aprobo_evaluacion_multi_sitio' => 'required|boolean',
        ]);

        $user = auth()->user();
        $company = Company::find($user->company_id);

        if (!$company) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        // Si tiene_multi_sitio es false, establecer cantidad_multi_sitio como null
        $cantidad_multi_sitio = $request->tiene_multi_sitio ? $request->cantidad_multi_sitio : null;

        $company->update([
            'puntos_fuertes' => $request->puntos_fuertes,
            'oportunidades' => $request->oportunidades,
            'tiene_multi_sitio' => $request->tiene_multi_sitio,
            'cantidad_multi_sitio' => $cantidad_multi_sitio,
            'aprobo_evaluacion_multi_sitio' => $request->aprobo_evaluacion_multi_sitio,
        ]);

        $infoAdicional = InfoAdicionalEmpresa::where('company_id', $company->id)->first();

        $infoAdicional->update([
            'puntos_fuertes' => $request->puntos_fuertes,
            'oportunidades' => $request->oportunidades,
            'tiene_multi_sitio' => $request->tiene_multi_sitio,
            'cantidad_multi_sitio' => $cantidad_multi_sitio,
            'aprobo_evaluacion_multi_sitio' => $request->aprobo_evaluacion_multi_sitio,
        ]);

        return response()->json(['success' => true]);
    }

    public function getEvaluationFields(Company $company)
    {
        return response()->json([
            'puntos_fuertes' => $company->puntos_fuertes,
            'oportunidades' => $company->oportunidades,
        ]);
    }
}
