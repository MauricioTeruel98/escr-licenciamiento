<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompanyManagementController extends Controller
{
    public function index(Request $request)
    {
        $companies = Company::with(['users' => function ($query) {
            $query->where('role', 'admin');
        }])
        ->when($request->search, function($query, $search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('legal_id', 'like', "%{$search}%")
                  ->orWhere('provincia', 'like', "%{$search}%")
                  ->orWhere('sector', 'like', "%{$search}%");
            });
        })
        ->withCount('users')
        ->orderBy($request->sort_by ?? 'created_at', $request->sort_order ?? 'desc')
        ->paginate($request->per_page ?? 10);

        return response()->json($companies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'legal_id' => 'required|string|unique:companies,legal_id',
            'name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'sector' => 'required|string',
            'provincia' => 'required|string',
            'commercial_activity' => 'required|string',
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'is_exporter' => 'boolean'
        ]);

        $company = Company::create($validated);

        return response()->json([
            'message' => 'Empresa creada exitosamente',
            'company' => $company
        ], 201);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'legal_id' => 'required|string|unique:companies,legal_id,' . $company->id,
            'name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'sector' => 'required|string',
            'provincia' => 'required|string',
            'commercial_activity' => 'required|string',
            'phone' => 'nullable|string',
            'mobile' => 'nullable|string',
            'is_exporter' => 'boolean'
        ]);

        $company->update($validated);

        return response()->json([
            'message' => 'Empresa actualizada exitosamente',
            'company' => $company
        ]);
    }

    /**
     * Obtiene los detalles completos de una empresa específica
     *
     * @param Company $company
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Company $company)
    {
        // Cargar la relación infoAdicional
        $company->load('infoAdicional');

        $productos = CompanyProducts::where('company_id', $company->id)->get();
        
        return response()->json([
            'company' => $company,
            'info_adicional' => $company->infoAdicional,
            'productos' => $productos
        ]);
    }

    public function destroy(Company $company)
    {
        if ($company->users()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar la empresa porque tiene usuarios asociados'
            ], 422);
        }

        $company->delete();

        return response()->json([
            'message' => 'Empresa eliminada exitosamente'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:companies,id'
        ]);

        $companiesWithUsers = Company::whereIn('id', $request->ids)
            ->has('users')
            ->count();

        if ($companiesWithUsers > 0) {
            return response()->json([
                'message' => 'No se pueden eliminar empresas que tienen usuarios asociados'
            ], 422);
        }

        $count = Company::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "{$count} empresas eliminadas exitosamente"
        ]);
    }
} 