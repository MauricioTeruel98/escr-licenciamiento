<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;

class EvaluationController extends Controller 
{
    public function index()
    {
        return Inertia::render('Dashboard/Evaluacion/Evaluacion');
    }
}

?>