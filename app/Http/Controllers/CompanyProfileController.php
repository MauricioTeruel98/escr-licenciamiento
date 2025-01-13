<?php

namespace App\Http\Controllers;

use App\Models\InfoAdicionalEmpresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'nombre_legal' => 'required|string|max:255',
            // Agrega aquí las demás validaciones necesarias
        ]);

        $company = auth()->user()->company;

        // Procesar las imágenes si existen
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Guardar o actualizar la información adicional
        InfoAdicionalEmpresa::updateOrCreate(
            ['company_id' => $company->id],
            [
                // Información básica
                'nombre_comercial' => $request->nombre_comercial,
                'nombre_legal' => $request->nombre_legal,
                'descripcion_es' => $request->descripcion_es,
                'descripcion_en' => $request->descripcion_en,
                'anio_fundacion' => $request->anio_fundacion,
                'sitio_web' => $request->sitio_web,
                
                // Redes sociales
                'facebook' => $request->facebook,
                'linkedin' => $request->linkedin,
                'instagram' => $request->instagram,
                
                // Información de la empresa
                'sector' => $request->sector,
                'tamano_empresa' => $request->tamano_empresa,
                'cantidad_hombres' => $request->cantidad_hombres,
                'cantidad_mujeres' => $request->cantidad_mujeres,
                'cantidad_otros' => $request->cantidad_otros,
                'telefono_1' => $request->telefono_1,
                'telefono_2' => $request->telefono_2,
                'es_exportadora' => $request->es_exportadora,
                'paises_exportacion' => $request->paises_exportacion,
                
                // Dirección
                'provincia' => $request->provincia,
                'canton' => $request->canton,
                'distrito' => $request->distrito,
                
                // Información legal y comercial
                'cedula_juridica' => $request->cedula_juridica,
                'actividad_comercial' => $request->actividad_comercial,
                'producto_servicio' => $request->producto_servicio,
                'rango_exportaciones' => $request->rango_exportaciones,
                'planes_expansion' => $request->planes_expansion,
                
                // Licenciamiento
                'razon_licenciamiento_es' => $request->razon_licenciamiento_es,
                'razon_licenciamiento_en' => $request->razon_licenciamiento_en,
                'proceso_licenciamiento' => $request->proceso_licenciamiento,
                'recomienda_marca_pais' => $request->recomienda_marca_pais,
                'observaciones' => $request->observaciones,
                
                // Contacto de Mercadeo
                'mercadeo_nombre' => $request->mercadeo_nombre,
                'mercadeo_email' => $request->mercadeo_email,
                'mercadeo_puesto' => $request->mercadeo_puesto,
                'mercadeo_telefono' => $request->mercadeo_telefono,
                'mercadeo_celular' => $request->mercadeo_celular,
                
                // Contacto de Micrositio
                'micrositio_nombre' => $request->micrositio_nombre,
                'micrositio_email' => $request->micrositio_email,
                'micrositio_puesto' => $request->micrositio_puesto,
                'micrositio_telefono' => $request->micrositio_telefono,
                'micrositio_celular' => $request->micrositio_celular,
                
                // Contacto del Vocero
                'vocero_nombre' => $request->vocero_nombre,
                'vocero_email' => $request->vocero_email,
                'vocero_puesto' => $request->vocero_puesto,
                'vocero_telefono' => $request->vocero_telefono,
                'vocero_celular' => $request->vocero_celular,
                
                // Contacto del Representante Legal
                'representante_nombre' => $request->representante_nombre,
                'representante_email' => $request->representante_email,
                'representante_puesto' => $request->representante_puesto,
                'representante_telefono' => $request->representante_telefono,
                'representante_celular' => $request->representante_celular,
                
                // Arrays JSON
                'productos' => $request->productos,
            ]
        );

        return redirect()->back()->with('message', 'Información guardada exitosamente');
    }

    public function edit()
    {
        $company = auth()->user()->company;
        $infoAdicional = $company->infoAdicional;

        return Inertia::render('Dashboard/FormEmpresa', [
            'userName' => auth()->user()->name,
            'infoAdicional' => $infoAdicional
        ]);
    }
}
