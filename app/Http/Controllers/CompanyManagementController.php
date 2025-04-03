<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyProducts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
class CompanyManagementController extends Controller
{
    public function index(Request $request)
    {
        $allowedSortColumns = [
            'legal_id',
            'name',
            'sector',
            'provincia',
            'is_exporter',
            'users_count',
            'created_at'
        ];

        $query = Company::with([
            'users' => function ($query) {
                $query->where('role', 'admin');
            },
            'evaluators' => function ($query) {
                $query->select('users.id', 'users.name', 'users.email');
            }
        ]);

        // Aplicar búsqueda
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $search = $request->search;
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('legal_id', 'like', "%{$search}%")
                  ->orWhere('provincia', 'like', "%{$search}%")
                  ->orWhere('sector', 'like', "%{$search}%");
            });
        }

        // Contar usuarios
        $query->withCount('users');

        // Aplicar ordenamiento
        if ($request->has('sort_by') && in_array($request->sort_by, $allowedSortColumns)) {
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($request->sort_by, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $companies = $query->paginate($request->input('per_page', 10));

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
        try {
            // Verificar si tiene usuarios
            /*if ($company->users()->count() > 0) {
                return response()->json([
                    'message' => 'No se puede eliminar la empresa ' . $company->name . ' porque tiene usuarios asociados'
                ], 422);
            }*/

            // Iniciar transacción
            DB::beginTransaction();

            // Eliminar todos los registros relacionados
            DB::table('evaluation_value_results')->where('company_id', $company->id)->delete();
            DB::table('auto_evaluation_result')->where('company_id', $company->id)->delete();
            DB::table('auto_evaluation_valor_result')->where('company_id', $company->id)->delete();
            DB::table('auto_evaluation_subcategory_result')->where('company_id', $company->id)->delete();
            DB::table('certifications')->where('company_id', $company->id)->delete();
            DB::table('company_products')->where('company_id', $company->id)->delete();
            DB::table('info_adicional_empresas')->where('company_id', $company->id)->delete();
            DB::table('indicator_answers')->where('company_id', $company->id)->delete();
            DB::table('indicator_answers_evaluation')->where('company_id', $company->id)->delete();
            DB::table('company_evaluator')->where('company_id', $company->id)->delete();
            DB::table('evaluator_assessments')->where('company_id', $company->id)->delete();
            //DB::table('users')->where('company_id', $company->id)->delete();

            // También eliminar archivos físicos si existen
            $this->deleteCompanyFiles($company);

            // Finalmente eliminar la empresa
            $company->delete();

            DB::commit();

            return response()->json([
                'message' => 'Empresa eliminada exitosamente'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error al eliminar empresa:', [
                'company_id' => $company->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al eliminar la empresa: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:companies,id'
        ]);

        try {
            // Verificar empresas con usuarios
            $companiesWithUsers = Company::whereIn('id', $request->ids)
                ->has('users')
                ->count();

            $companiesWithUsersNames = Company::whereIn('id', $request->ids)
                ->has('users')
                ->pluck('name')
                ->implode(', ');

            /*if ($companiesWithUsers > 0) {
                return response()->json([
                    'message' => 'No se pueden eliminar empresas ' . $companiesWithUsersNames . ' que tienen usuarios asociados'
                ], 422);
            }*/

           // Iniciar transacción
           DB::beginTransaction();

           // Eliminar todos los registros relacionados
           DB::table('evaluation_value_results')->whereIn('company_id', $request->ids)->delete();
           DB::table('auto_evaluation_result')->whereIn('company_id', $request->ids)->delete();
           DB::table('auto_evaluation_valor_result')->whereIn('company_id', $request->ids)->delete();
           DB::table('auto_evaluation_subcategory_result')->whereIn('company_id', $request->ids)->delete();
           DB::table('certifications')->whereIn('company_id', $request->ids)->delete();
           DB::table('company_products')->whereIn('company_id', $request->ids)->delete();
           DB::table('info_adicional_empresas')->whereIn('company_id', $request->ids)->delete();
           DB::table('indicator_answers')->whereIn('company_id', $request->ids)->delete();
           DB::table('indicator_answers_evaluation')->whereIn('company_id', $request->ids)->delete();
           DB::table('company_evaluator')->whereIn('company_id', $request->ids)->delete();
           DB::table('evaluator_assessments')->whereIn('company_id', $request->ids)->delete();
           //DB::table('users')->whereIn('company_id', $request->ids)->delete();

            // Eliminar archivos físicos de todas las empresas
            foreach ($request->ids as $companyId) {
                $company = Company::find($companyId);
                if ($company) {
                    $this->deleteCompanyFiles($company);
                }
            }

            // Eliminar las empresas
            $count = Company::whereIn('id', $request->ids)->delete();

            DB::commit();

            return response()->json([
                'message' => "{$count} empresas eliminadas exitosamente"
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error al eliminar empresas en lote:', [
                'company_ids' => $request->ids,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al eliminar las empresas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Elimina los archivos físicos asociados a una empresa
     */
    private function deleteCompanyFiles(Company $company)
    {
        try {
            $companyPath = "companies/{$company->id}";
            
            // Eliminar el directorio completo de la empresa si existe
            if (Storage::disk('public')->exists($companyPath)) {
                Storage::disk('public')->deleteDirectory($companyPath);
            }
        } catch (\Exception $e) {
            Log::warning("Error al eliminar archivos de la empresa {$company->id}: " . $e->getMessage());
            // No lanzamos la excepción para permitir que continúe el proceso de eliminación
        }
    }
} 