<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\InfoAdicionalEmpresa;

class EvaluadorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Evaluador/Dashboard');
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
                $query->where(function($q) use ($searchTerm) {
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