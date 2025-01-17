<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class SuperAdminCompanyController extends Controller
{
    public function switchCompany(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id'
        ]);

        $user = auth()->user();
        
        if ($user->role !== 'super_admin') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Actualizar el company_id del usuario super_admin
        $user->company_id = $validated['company_id'];
        $user->save();


        // También guardamos en sesión para mantener consistencia
        session(['admin_company_id' => $validated['company_id']]);

        $company = Company::find($validated['company_id']);

        return response()->json([
            'message' => 'Empresa cambiada exitosamente',
            'company' => [
                'id' => $company->id,
                'name' => $company->name
            ]
        ]);
    }

    public function getCompaniesList()
    {
        $companies = Company::select('id', 'name')->get();
        return response()->json($companies);
    }

    public function getActiveCompany()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'super_admin') {
            return response()->json(null);
        }

        $company = Company::find($user->company_id);
        return response()->json($company);
    }
}