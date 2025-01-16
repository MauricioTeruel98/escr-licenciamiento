<?php

namespace App\Http\Controllers;

use App\Models\AutoEvaluationResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;

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

        //Resultados de la autoevaluación
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();
        
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

        // Obtener valores con nota insuficiente (menor a 70)
        $failedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->where('nota', '<', 70)
            ->with('value:id,name')
            ->get()
            ->map(function($result) {
                return [
                    'name' => $result->value->name,
                    'nota' => $result->nota
                ];
            });
        
        // Determinar el status
        $status = 'en_proceso';
        $autoEvaluationResult = \App\Models\AutoEvaluationResult::where('company_id', $user->company_id)->first();
        
        if ($autoEvaluationResult) {
            if ($indicadoresRespondidos === $totalIndicadores) {
                if ($failedBindingIndicators->isEmpty() && $failedValues->isEmpty()) {
                    $status = 'apto';
                } else {
                    $status = 'no_apto';
                }
            }
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
            'failedBindingIndicators' => $failedBindingIndicators,
            'failedValues' => $failedValues,
            'autoEvaluationResult' => $autoEvaluationResult
        ]);
    }

    public function showFormEmpresa(Request $request)
    {
        $user = auth()->user();
        $company = $user->company;
        $infoAdicional = $company->infoAdicional;

        // Actualizar form_sended en auto_evaluation_result
        if ($request->has('form_sended')) {
            AutoEvaluationResult::where('company_id', $user->company_id)
                ->update(['form_sended' => true]);
        }

        // Transformar las rutas de imágenes a URLs completas si existen
        if ($infoAdicional) {
            if ($infoAdicional->logo_path) {
                $infoAdicional->logo_url = asset('storage/' . $infoAdicional->logo_path);
            }
            
            if ($infoAdicional->fotografias_paths) {
                $infoAdicional->fotografias_urls = collect($infoAdicional->fotografias_paths)
                    ->map(fn($path) => asset('storage/' . $path))
                    ->toArray();
            }
            
            if ($infoAdicional->certificaciones_paths) {
                $infoAdicional->certificaciones_urls = collect($infoAdicional->certificaciones_paths)
                    ->map(fn($path) => asset('storage/' . $path))
                    ->toArray();
            }
        }

        return Inertia::render('Dashboard/FormEmpresa', [
            'userName' => $user->name,
            'infoAdicional' => $infoAdicional
        ]);
    }

    public function showComponents()
    {
        return Inertia::render('SuperAdmin/Components');
    }

    public function showReportes()
    {
        return Inertia::render('SuperAdmin/Reportes');
    }

    public function showProgresos()
    {
        return Inertia::render('SuperAdmin/Progresos');
    }
} 