<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class IndicadoresController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Indicadores/Indicadores');
    }
} 