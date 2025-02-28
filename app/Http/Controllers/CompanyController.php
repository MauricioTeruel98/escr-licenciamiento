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

        // Cargar las provincias desde el archivo lugares.json
        $lugaresJson = file_get_contents(storage_path('app/public/lugares.json'));
        $lugares = json_decode($lugaresJson, true);
        
        // Extraer solo las provincias
        $provincias = [];
        if (isset($lugares[0]['provincias'])) {
            foreach ($lugares[0]['provincias'] as $provincia) {
                $provincias[] = [
                    'id' => $provincia['id'],
                    'name' => $provincia['name']
                ];
            }
        }

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
            'provincias' => $provincias
        ]);
    }

    public function update(Request $request)
    {
        // Limpiar los datos de entrada
        $cleanedData = [];
        foreach ($request->all() as $key => $value) {
            if (is_string($value)) {
                if ($key === 'website') {
                    // Para URLs solo eliminamos espacios al inicio y comillas
                    $cleanedValue = preg_replace('/[\'"]/', '', ltrim($value));
                } else {
                    // Para otros campos eliminamos espacios al inicio, comillas, barras y barras invertidas
                    $cleanedValue = preg_replace('/[\'"\\\\\\/]/', '', ltrim($value));
                }
                $request->merge([$key => $cleanedValue]);
                $cleanedData[$key] = $cleanedValue;
            }
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'required|url',
            'sector' => 'required|string',
            'provincia' => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-áéíóúÁÉÍÓÚñÑ]+$/'],
            'commercial_activity' => 'required|string',
            'phone' => 'required|string',
            'mobile' => 'required|string',
            'is_exporter' => 'required|boolean',
        ], [
            'provincia.regex' => 'La provincia solo puede contener letras, números, espacios y guiones.'
        ]);

        $company = Company::find(auth()->user()->company_id);
        $company->update($validated);

        return redirect()->back()->with('success', 'La información de la empresa ha sido actualizada exitosamente.');
    }
} 