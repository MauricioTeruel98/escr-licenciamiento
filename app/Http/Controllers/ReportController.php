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
            ->select('id', 'name', 'estado_eval')
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
                'estado' => $company->formatted_state
            ];
        }));
    }
} 