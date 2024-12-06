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
        $savedAnswers = IndicatorAnswer::where('user_id', $user->id)
            ->where('company_id', $user->company_id)
            ->whereIn('indicator_id', $value->subcategories->flatMap->indicators->pluck('id'))
            ->get();

        return Inertia::render('Dashboard/Indicadores/Indicadores', [
            'valueData' => $value,
            'userName' => $user->name,
            'savedAnswers' => $savedAnswers
        ]);
    }
} 