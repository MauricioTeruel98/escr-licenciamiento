<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\AutoEvaluationResult;
use Illuminate\Http\Request;

class CompanyAuthorizationController extends Controller
{
    public function authorizeCompany(Company $company)
    {
        // Verificar si el formulario fue enviado
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $company->id)
            ->first();

        if (!$autoEvaluationResult || !$autoEvaluationResult->form_sended) {
            return response()->json([
                'message' => 'La empresa debe completar y enviar el formulario antes de ser autorizada'
            ], 422);
        }

        $company->authorized = true;

        // Actualizar la columna estado_eval en la tabla companies
        $company->update(['estado_eval' => 'evaluacion']);

        $company->save();

        return response()->json(['message' => 'Empresa autorizada exitosamente']);
    }
}