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
            'progreso' => $progreso
        ]);
    }
} 