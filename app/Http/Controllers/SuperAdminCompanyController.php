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

        // Guardar la empresa seleccionada en la sesión
        session(['admin_company_id' => $validated['company_id']]);

        return response()->json(['message' => 'Empresa cambiada exitosamente']);
    }

    public function getCompaniesList()
    {
        $companies = Company::select('id', 'name')->get();
        return response()->json($companies);
    }

    public function getActiveCompany()
    {
        $companyId = session('admin_company_id');
        if (!$companyId) {
            return response()->json(null);
        }

        $company = Company::find($companyId);
        return response()->json($company);
    }
}