<?php

namespace App\Http\Controllers;

use App\Models\Value;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\IndicatorHomologation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndicadoresController extends Controller
{
    public function index($id)
    {
        $user = auth()->user()->load('company');
        $value = Value::with(['subcategories.indicators'])->findOrFail($id);

        // Obtener las certificaciones de la empresa
        $certifications = $user->company->certifications;

        // Obtener los IDs de las certificaciones disponibles asociadas
        $homologationIds = $certifications->pluck('homologation_id')->filter();

        // Obtener los indicadores homologados
        $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
            ->with(['indicator', 'availableCertification'])
            ->get()
            ->groupBy('homologation_id')
            ->map(function ($group) {
                return [
                    'certification_name' => $group->first()->availableCertification->nombre,
                    'indicators' => $group->map(function ($homologation) {
                        return [
                            'id' => $homologation->indicator->id,
                            'name' => $homologation->indicator->name,
                            // Agrega aquí cualquier otra información del indicador que necesites
                        ];
                    })
                ];
            });

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
            'homologatedIndicators' => $homologatedIndicators
        ]);
    }
}
