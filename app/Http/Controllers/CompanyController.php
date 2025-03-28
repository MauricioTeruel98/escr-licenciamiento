<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\InfoAdicionalEmpresa;
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
                'Agrícola',
                'Alimentos',
                'Industria especializada',
                'Servicios',
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
            'puntos_fuertes' => 'nullable|string',
            'justificacion' => 'nullable|string',
            'oportunidades' => 'nullable|string',
        ], [
            'provincia.regex' => 'La provincia solo puede contener letras, números, espacios y guiones.',
            'website.url' => 'El formato del sitio web no es válido. Debe incluir "https://" o "http://" al inicio (ejemplo: https://www.miempresa.com)'
        ]);

        $company = Company::find(auth()->user()->company_id);
        $company->update($validated);

        $info_adicional = InfoAdicionalEmpresa::where('company_id', $company->id)->first();

        if ($info_adicional) {
            $info_adicional->nombre_comercial = $validated['name'];
            $info_adicional->sitio_web = $validated['website'];
            $info_adicional->sector = $validated['sector'];
            $info_adicional->provincia = $validated['provincia'];
            $info_adicional->actividad_comercial = $validated['commercial_activity'];
            $info_adicional->telefono_1 = $validated['phone'];
            $info_adicional->telefono_2 = $validated['mobile'];
            $info_adicional->puntos_fuertes = $validated['puntos_fuertes'];
            $info_adicional->justificacion = $validated['justificacion'];
            $info_adicional->oportunidades = $validated['oportunidades'];
            $info_adicional->save();
        }

        return redirect()->back()->with('success', 'La información de la empresa ha sido actualizada exitosamente.');
    }
} 