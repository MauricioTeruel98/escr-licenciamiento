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
        $user = auth()->user();
        $value = Value::with(['subcategories.indicators'])->findOrFail($id);

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
            'savedAnswers' => $savedAnswers,
            'currentScore' => $currentScore
        ]);
    }
}
