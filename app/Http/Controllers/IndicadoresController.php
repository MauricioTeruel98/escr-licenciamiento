<?php

namespace App\Http\Controllers;

use App\Models\Value;
use App\Models\Indicator;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndicadoresController extends Controller
{
    public function index(Request $request, $valueId)
    {
        $value = Value::with(['subcategories.indicators' => function($query) {
            $query->where('is_active', true);
        }])->findOrFail($valueId);

        return Inertia::render('Dashboard/Indicadores/Indicadores', [
            'valueData' => $value,
            'currentValue' => $value->name,
            'minimumScore' => $value->minimum_score
        ]);
    }
} 