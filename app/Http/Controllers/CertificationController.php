<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificationController extends Controller
{
    public function create()
    {
        return Inertia::render('Dashboard/Certifications/Create');
    }
} 