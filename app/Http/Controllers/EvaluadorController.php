<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;

class EvaluadorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Evaluador/Dashboard');
    }

    public function companies()
    {
        return Inertia::render('Evaluador/Companies');
    }

    public function evaluations()
    {
        return Inertia::render('Evaluador/Evaluations');
    }

    public function getCompaniesList()
    {
        // Obtener todas las empresas (igual que el super admin)
        $companies = Company::all();
        return response()->json($companies);
    }

    public function getActiveCompany()
    {
        // Obtener la empresa actual del usuario
        $user = auth()->user();
        if ($user->company_id) {
            return response()->json(Company::find($user->company_id));
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
} 