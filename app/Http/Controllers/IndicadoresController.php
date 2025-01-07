<?php

namespace App\Http\Controllers;

use App\Models\Value;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndicadoresController extends Controller
{
    public function index($id)
    {
        $user = auth()->user()->load('company');
        $value = Value::with(['subcategories.indicators'])->findOrFail($id);

        //Obtener las certificaciones de la empresa
        $certifications = $user->company->certifications;

        //Validar las homologaciones que tiene la empresa en base a las certificaciones
        $homologations = $certifications->flatMap->homologations;
        
        // Obtener las respuestas guardadas del usuario
        $savedAnswers = IndicatorAnswer::where('company_id', $user->company_id)
            ->whereIn('indicator_id', $value->subcategories->flatMap->indicators->pluck('id'))
            ->get();

        // Obtener la nota actual
        $currentScore = \App\Models\AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->latest('fecha_evaluacion')
            ->first()?->nota ?? 0;

        return Inertia::render('Dashboard/Indicadores/Indicadores', [
            'valueData' => $value,
            'userName' => $user->name,
            'user' => $user,
            'savedAnswers' => $savedAnswers,
            'currentScore' => $currentScore,
            'certifications' => $certifications,
            'homologations' => $homologations
        ]);
    }
}
