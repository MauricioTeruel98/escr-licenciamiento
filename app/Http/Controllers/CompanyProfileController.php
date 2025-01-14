<?php

namespace App\Http\Controllers;

use App\Models\InfoAdicionalEmpresa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CompanyProfileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'nombre_legal' => 'required|string|max:255',
            'logo' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'fotografias.*' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'certificaciones.*' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
        ]);

        $company = auth()->user()->company;
        $infoAdicional = InfoAdicionalEmpresa::firstOrNew(['company_id' => $company->id]);

        // Procesar el logo
        if ($request->hasFile('logo')) {
            // Eliminar logo anterior si existe
            if ($infoAdicional->logo_path && Storage::disk('public')->exists($infoAdicional->logo_path)) {
                Storage::disk('public')->delete($infoAdicional->logo_path);
            }
            $infoAdicional->logo_path = $request->file('logo')->store('company-files/logos', 'public');
        }

        // Procesar fotografías
        if ($request->hasFile('fotografias')) {
            $fotografiasPaths = [];
            // Mantener fotos existentes
            if ($infoAdicional->fotografias_paths) {
                $fotografiasPaths = array_filter($infoAdicional->fotografias_paths, function($path) {
                    return Storage::disk('public')->exists($path);
                });
            }
            // Agregar nuevas fotos
            foreach ($request->file('fotografias') as $foto) {
                $fotografiasPaths[] = $foto->store('company-files/fotografias', 'public');
            }
            $infoAdicional->fotografias_paths = $fotografiasPaths;
        }

        // Procesar certificaciones
        if ($request->hasFile('certificaciones')) {
            $certificacionesPaths = [];
            // Mantener certificaciones existentes
            if ($infoAdicional->certificaciones_paths) {
                $certificacionesPaths = array_filter($infoAdicional->certificaciones_paths, function($path) {
                    return Storage::disk('public')->exists($path);
                });
            }
            // Agregar nuevas certificaciones
            foreach ($request->file('certificaciones') as $cert) {
                $certificacionesPaths[] = $cert->store('company-files/certificaciones', 'public');
            }
            $infoAdicional->certificaciones_paths = $certificacionesPaths;
        }

        // Guardar resto de datos
        $infoAdicional->fill($request->except(['logo', 'fotografias', 'certificaciones']));
        $infoAdicional->save();

        return redirect()->back()->with('message', 'Información guardada exitosamente');
    }

    public function edit()
    {
        $company = auth()->user()->company;
        $infoAdicional = $company->infoAdicional;

        // Transformar las rutas de imágenes a URLs completas si existen
        if ($infoAdicional) {
            if ($infoAdicional->logo_path) {
                $infoAdicional->logo_url = asset('storage/' . $infoAdicional->logo_path);
            }
            
            if ($infoAdicional->fotografias_paths) {
                $infoAdicional->fotografias_urls = collect($infoAdicional->fotografias_paths)
                    ->map(fn($path) => asset('storage/' . $path))
                    ->toArray();
            }
            
            if ($infoAdicional->certificaciones_paths) {
                $infoAdicional->certificaciones_urls = collect($infoAdicional->certificaciones_paths)
                    ->map(fn($path) => asset('storage/' . $path))
                    ->toArray();
            }
        }

        return Inertia::render('Dashboard/FormEmpresa', [
            'userName' => auth()->user()->name,
            'infoAdicional' => $infoAdicional
        ]);
    }

    // Agregar método para eliminar archivos
    public function deleteFile(Request $request)
    {
        try {
            $company = auth()->user()->company;
            $infoAdicional = $company->infoAdicional;
            $tipo = $request->tipo;
            $path = $request->path;

            if (!$infoAdicional) {
                return response()->json(['message' => 'Información no encontrada'], 404);
            }

            switch ($tipo) {
                case 'logo':
                    if ($infoAdicional->logo_path === $path) {
                        Storage::disk('public')->delete($path);
                        $infoAdicional->logo_path = null;
                    }
                    break;

                case 'fotografias':
                    if ($infoAdicional->fotografias_paths) {
                        $fotografias = array_filter($infoAdicional->fotografias_paths, function($p) use ($path) {
                            return $p !== $path;
                        });
                        Storage::disk('public')->delete($path);
                        $infoAdicional->fotografias_paths = array_values($fotografias);
                    }
                    break;

                case 'certificaciones':
                    if ($infoAdicional->certificaciones_paths) {
                        $certificaciones = array_filter($infoAdicional->certificaciones_paths, function($p) use ($path) {
                            return $p !== $path;
                        });
                        Storage::disk('public')->delete($path);
                        $infoAdicional->certificaciones_paths = array_values($certificaciones);
                    }
                    break;
            }

            $infoAdicional->save();

            return response()->json([
                'success' => true,
                'message' => 'Archivo eliminado correctamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }
}
