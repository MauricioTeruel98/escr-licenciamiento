<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $company = Company::find($user->company_id);

        return Inertia::render('Company/Edit', [
            'company' => $company,
            'userName' => $user->name,
            'sectors' => [
                'Agricultura',
                'Manufactura',
                'Servicios',
                'Tecnología',
                // Agregar más sectores según necesites
            ],
            'cities' => [
                'San José',
                'Alajuela',
                'Cartago',
                'Heredia',
                // Agregar más ciudades según necesites
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'required|url',
            'sector' => 'required|string',
            'city' => 'required|string',
            'commercial_activity' => 'required|string',
            'phone' => 'required|string',
            'mobile' => 'required|string',
            'is_exporter' => 'required|boolean',
        ]);

        $company = Company::find(auth()->user()->company_id);
        $company->update($validated);

        return redirect()->back()->with('success', 'La información de la empresa ha sido actualizada exitosamente.');
    }
} 