<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EvaluadorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Evaluador/Dashboard');
    }

    public function companies()
    {
        return Inertia::render('Evaluador/Companies');
    }

    public function evaluations()
    {
        return Inertia::render('Evaluador/Evaluations');
    }
} 