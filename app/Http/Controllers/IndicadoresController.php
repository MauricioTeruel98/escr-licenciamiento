<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class IndicadoresController extends Controller
{
    public function index(Request $request, $id)
    {
        $valueId = $id;
        return Inertia::render('Dashboard/Indicadores/Indicadores', compact('valueId'));
    }
} 