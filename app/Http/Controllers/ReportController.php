<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ReportController extends Controller
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
            'es_exportador'
        ];

        $query = Company::query()
            ->select('id', 'name', 'estado_eval', 'is_exporter', 'authorized_by_super_admin')
            ->with(['autoEvaluationResult' => function($query) {
                $query->select('id', 'company_id', 'status');
            }]);

        // Aplicar búsqueda
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('estado_eval', 'like', "%{$search}%");
            });
        }

        // Aplicar ordenamiento
        if (in_array($sortBy, $allowedSortColumns)) {
            if ($sortBy === 'nombre') {
                $query->orderBy('name', $sortOrder);
            } elseif ($sortBy === 'estado') {
                $query->orderBy('estado_eval', $sortOrder);
            } elseif ($sortBy === 'es_exportador') {
                $query->orderBy('is_exporter', $sortOrder);
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }
        } else {
            $query->orderBy('id', 'desc');
        }

        $companies = $query->paginate($perPage);

        return response()->json($companies->through(function ($company) {
            return [
                'id' => $company->id,
                'nombre' => $company->name,
                'estado' => $company->formatted_state,
                'estado_eval' => $company->estado_eval,
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
            $sortBy = $request->input('sort_by', 'id');
            $sortOrder = $request->input('sort_order', 'desc');
            
            $user = Auth::user();
            
            $query = $user->evaluatedCompanies()
                ->select('companies.id', 'companies.name', 'companies.estado_eval')
                ->with(['autoEvaluationResult' => function($query) {
                    $query->select('id', 'company_id', 'status');
                }]);
            
            if ($search) {
                $query->where('companies.name', 'like', "%{$search}%");
            }

            // Aplicar ordenamiento
            if ($sortBy === 'nombre') {
                $query->orderBy('companies.name', $sortOrder);
            } elseif ($sortBy === 'estado') {
                $query->orderBy('companies.estado_eval', $sortOrder);
            } else {
                $query->orderBy('companies.id', $sortOrder);
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