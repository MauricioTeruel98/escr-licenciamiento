<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    public function showEvaluation()
    {
        $user = auth()->user();
        $isAdmin = $user->isAdmin();
        
        // Obtener el total de indicadores activos
        $totalIndicadores = Indicator::where('is_active', true)->count();
        
        // Obtener el número de respuestas de la empresa
        $indicadoresRespondidos = IndicatorAnswer::whereHas('indicator', function($query) {
            $query->where('is_active', true);
        })
        ->where('company_id', $user->company_id)
        ->count();
        
        // Calcular el porcentaje de progreso
        $progreso = $totalIndicadores > 0 ? round(($indicadoresRespondidos / $totalIndicadores) * 100) : 0;
        
        // Obtener indicadores vinculantes fallidos
        $failedBindingIndicators = IndicatorAnswer::where('company_id', $user->company_id)
            ->where('is_binding', true)
            ->where('answer', 0)
            ->with('indicator:id,name,self_evaluation_question')
            ->get()
            ->map(function($answer) {
                return [
                    'name' => $answer->indicator->name,
                    'question' => $answer->indicator->self_evaluation_question
                ];
            });
        
        // Obtener el status de la autoevaluación
        $status = 'no_apto';
        $autoEvaluationResult = \App\Models\AutoEvaluationResult::where('company_id', $user->company_id)->first();
        if ($autoEvaluationResult) {
            $status = $autoEvaluationResult->status;
        }

        $pendingRequests = [];
        if ($isAdmin) {
            $pendingRequests = User::where('company_id', $user->company_id)
                ->where('status', 'pending')
                ->select('id', 'name', 'email', 'created_at')
                ->get();
        }

        return Inertia::render('Dashboard/Evaluation', [
            'userName' => $user->name,
            'isAdmin' => $isAdmin,
            'pendingRequests' => $pendingRequests,
            'totalIndicadores' => $totalIndicadores,
            'indicadoresRespondidos' => $indicadoresRespondidos,
            'progreso' => $progreso,
            'companyName' => $user->company->name,
            'status' => $status,
            'failedBindingIndicators' => $failedBindingIndicators
        ]);
    }
} 