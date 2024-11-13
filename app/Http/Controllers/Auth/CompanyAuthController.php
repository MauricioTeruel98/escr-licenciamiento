<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyAuthController extends Controller
{
    public function showRegard()
    {
        return Inertia::render('Auth/Regard');
    }

    public function showCompanyRegister()
    {
        return Inertia::render('Auth/CompanyRegister');
    }

    public function showLegalId()
    {
        return Inertia::render('Auth/LegalId');
    }

    public function showCompanyExists()
    {
        return Inertia::render('Auth/CompanyExists');
    }
} 