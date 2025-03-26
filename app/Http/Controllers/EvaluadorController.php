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

    public function getCompaniesList()
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
        ]);

        $user = auth()->user();
        $company = Company::find($user->company_id);

        if (!$company) {
            return response()->json(['error' => 'Empresa no encontrada'], 404);
        }

        $company->update([
            'puntos_fuertes' => $request->puntos_fuertes,
            'oportunidades' => $request->oportunidades,
        ]);

        $infoAdicional = InfoAdicionalEmpresa::where('company_id', $company->id)->first();

        $infoAdicional->update([
            'puntos_fuertes' => $request->puntos_fuertes,
            'oportunidades' => $request->oportunidades,
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