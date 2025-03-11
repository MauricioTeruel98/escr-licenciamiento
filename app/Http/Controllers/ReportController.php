<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function getCompanies(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('per_page', 10);

        $query = Company::query()
            ->select('id', 'name', 'estado_eval', 'is_exporter', 'authorized_by_super_admin')
            ->orderBy('id', 'desc')
            ->with(['autoEvaluationResult' => function($query) {
                $query->select('id', 'company_id', 'status');
            }]);

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $companies = $query->paginate($perPage);

        return response()->json($companies->through(function ($company) {
            return [
                'id' => $company->id,
                'nombre' => $company->name,
                'estado' => $company->formatted_state,
                'es_exportador' => $company->is_exporter,
                'autorizado_por_super_admin' => $company->authorized_by_super_admin
            ];
        }));
    }

    public function getCompaniesEmpresa(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            
            $user = auth()->user();
            
            $query = $user->evaluatedCompanies()
                ->select('companies.id', 'companies.name', 'companies.estado_eval')
                ->orderBy('companies.id', 'desc')
                ->with(['autoEvaluationResult' => function($query) {
                    $query->select('id', 'company_id', 'status');
                }]);
            
            if ($search) {
                $query->where('companies.name', 'like', "%{$search}%");
            }
            
            $companies = $query->paginate($perPage);
            
            return response()->json($companies->through(function ($company) {
                return [
                    'id' => $company->id,
                    'nombre' => $company->name,
                    'estado' => $company->formatted_state
                ];
            }));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener las empresas'], 500);
        }
    }

    public function authorizeExporter(Company $company)
    {
        // Actualizar el campo authorized_by_super_admin a true
        $company->authorized_by_super_admin = true;
        $company->save();

        return response()->json([
            'success' => true,
            'message' => 'Empresa autorizada como exportadora exitosamente'
        ]);
    }
} 