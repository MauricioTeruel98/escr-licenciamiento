<?php

namespace App\Http\Controllers;

use App\Models\AutoEvaluationResult;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Indicator;
use App\Models\IndicatorAnswer;
use App\Models\AutoEvaluationValorResult;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Certification;
use App\Models\IndicatorHomologation;
use App\Models\Company;
use App\Models\Value;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    public function showEvaluation()
    {
        $user = Auth::user();
        $isAdmin = $user->role === 'admin';

        $companyId = $user->company_id;

        $company = Company::find($companyId);

        // Obtener el total de indicadores activos
        $totalIndicadores = Indicator::where('is_active', true)->count();

        //Resultados de la autoevaluación
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();

        // Obtener el número de respuestas de la empresa
        $indicadoresRespondidos = IndicatorAnswer::whereHas('indicator', function ($query) {
            $query->where('is_active', true);
        })
            ->where('company_id', $user->company_id)
            ->count();

        // Calcular el porcentaje de progreso
        $progreso = $totalIndicadores > 0 ? round(($indicadoresRespondidos / $totalIndicadores) * 100) : 0;

        // Calcular indicadores homologados por certificaciones
        $indicadoresHomologados = 0;
        $certificaciones = Certification::where('company_id', $user->company_id)
            ->where(function($query) {
                $query->whereNull('fecha_expiracion')
                      ->orWhere('fecha_expiracion', '>=', now()->startOfDay());
            })
            ->get();
            
        if ($certificaciones->count() > 0) {
            // Obtener IDs de las certificaciones disponibles asociadas
            $homologationIds = $certificaciones->pluck('homologation_id')->filter()->toArray();
            
            if (!empty($homologationIds)) {
                // Obtener indicadores homologados únicos (sin duplicados)
                $indicadoresHomologados = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                    ->whereHas('indicator', function ($query) {
                        $query->where('is_active', true);
                    })
                    ->distinct('indicator_id')
                    ->count('indicator_id');
            }
        }

        // Obtener indicadores vinculantes fallidos
        $failedBindingIndicators = IndicatorAnswer::where('company_id', $user->company_id)
            ->where('is_binding', true)
            ->where('answer', 0)
            ->with('indicator:id,name,self_evaluation_question')
            ->get()
            ->map(function ($answer) {
                return [
                    'name' => $answer->indicator->name,
                    'question' => $answer->indicator->self_evaluation_question
                ];
            });

        // Obtener valores con nota insuficiente (menor a 70)
        $failedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->where('nota', '<', 70)
            ->with('value:id,name')
            ->get()
            ->map(function ($result) {
                return [
                    'name' => $result->value->name,
                    'nota' => $result->nota
                ];
            });

        // Determinar el status
        $status = 'en_proceso';
        $autoEvaluationResult = \App\Models\AutoEvaluationResult::where('company_id', $user->company_id)->first();

        $activeValues = Value::where('is_active', true)->count();
        $evaluatedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)->count();

        if ($autoEvaluationResult) {
            if ($activeValues === $evaluatedValues) {
                if ($failedBindingIndicators->isEmpty() && $failedValues->isEmpty()) {
                    $status = 'apto';
                } else {
                    $status = 'no_apto';
                }
            }
        }

        $pendingRequests = [];
        if ($isAdmin) {
            $pendingRequests = User::where('company_id', $user->company_id)
                ->where('status', 'pending')
                ->select('id', 'name', 'email', 'created_at')
                ->get();
        }

        return Inertia::render('Dashboard/Evaluation', [
            'userName' => $user->name,
            'isAdmin' => $isAdmin,
            'pendingRequests' => $pendingRequests,
            'totalIndicadores' => $totalIndicadores,
            'indicadoresRespondidos' => $indicadoresRespondidos,
            'indicadoresHomologados' => $indicadoresHomologados,
            'progreso' => $progreso,
            'companyName' => $user->company->name,
            'status' => $status,
            'failedBindingIndicators' => $failedBindingIndicators,
            'failedValues' => $failedValues,
            'autoEvaluationResult' => $autoEvaluationResult,
            'company' => $company
        ]);
    }

    public function showFormEmpresa(Request $request)
    {
        $user = Auth::user();
        $company = $user->company;
        $infoAdicional = $company->infoAdicional;

        // Combinar los datos de la empresa con infoAdicional
        $companyData = [
            'nombre_comercial' => $company->name,
            'sitio_web' => $company->website,
            'sector' => $company->sector,
            'ciudad' => $company->city,
            'cedula_juridica' => $company->legal_id,
            'actividad_comercial' => $company->commercial_activity,
            'is_exporter' => $company->is_exporter,
            'telefono_1' => $company->phone,
            'telefono_2' => $company->mobile,
        ];

        // Cargar el archivo de lugares para obtener los IDs correspondientes a los nombres
        $lugaresJson = Storage::disk('public')->get('lugares.json');
        $lugares = json_decode($lugaresJson, true);
        
        // Buscar los IDs correspondientes a los nombres guardados en la base de datos
        $provinciaId = '';
        $cantonId = '';
        $distritoId = '';
        
        if ($company->provincia) {
            foreach ($lugares[0]['provincias'] as $provincia) {
                if ($provincia['name'] === $company->provincia) {
                    $provinciaId = $provincia['id'];
                    
                    if ($company->canton) {
                        foreach ($provincia['cantones'] as $canton) {
                            if ($canton['name'] === $company->canton) {
                                $cantonId = $canton['id'];
                                
                                if ($company->distrito) {
                                    foreach ($canton['distritos'] as $distrito) {
                                        if ($distrito['name'] === $company->distrito) {
                                            $distritoId = $distrito['id'];
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
        
        // Agregar los IDs de ubicación a los datos de la empresa
        $companyData['provincia_id'] = $provinciaId;
        $companyData['canton_id'] = $cantonId;
        $companyData['distrito_id'] = $distritoId;
        
        // Agregar los nombres de ubicación para referencia
        $companyData['provincia_nombre'] = $company->provincia;
        $companyData['canton_nombre'] = $company->canton;
        $companyData['distrito_nombre'] = $company->distrito;
        
        // Log para depuración
        Log::info('Datos de ubicación cargados', [
            'provincia' => $company->provincia,
            'canton' => $company->canton,
            'distrito' => $company->distrito,
            'provincia_id' => $provinciaId,
            'canton_id' => $cantonId,
            'distrito_id' => $distritoId
        ]);

        // Si existe infoAdicional, combinar con los datos de la empresa
        if ($infoAdicional) {
            // Actualizar form_sended en auto_evaluation_result
            if ($request->has('form_sended')) {
                AutoEvaluationResult::where('company_id', $user->company_id)
                    ->update(['form_sended' => true]);
            }

            // Logo
            if ($infoAdicional->logo_path) {
                $infoAdicional->logo_url = asset('storage/' . $infoAdicional->logo_path);
            }

            // Procesar fotografías
            $fotografias = [];
            if ($infoAdicional->fotografias_paths) {
                $paths = is_string($infoAdicional->fotografias_paths)
                    ? json_decode($infoAdicional->fotografias_paths, true)
                    : $infoAdicional->fotografias_paths;

                if (is_array($paths)) {
                    foreach ($paths as $path) {
                        if (Storage::disk('public')->exists($path)) {
                            $fotografias[] = [
                                'name' => basename($path),
                                'path' => $path,
                                'url' => asset('storage/' . $path),
                                'size' => Storage::disk('public')->size($path)
                            ];
                        }
                    }
                }
            }
            $infoAdicional->fotografias_urls = $fotografias;

            // Procesar certificaciones
            $certificaciones = [];
            if ($infoAdicional->certificaciones_paths) {
                $paths = is_string($infoAdicional->certificaciones_paths)
                    ? json_decode($infoAdicional->certificaciones_paths, true)
                    : $infoAdicional->certificaciones_paths;

                if (is_array($paths)) {
                    foreach ($paths as $path) {
                        if (Storage::disk('public')->exists($path)) {
                            $certificaciones[] = [
                                'name' => basename($path),
                                'path' => $path,
                                'url' => asset('storage/' . $path),
                                'size' => Storage::disk('public')->size($path)
                            ];
                        }
                    }
                }
            }
            $infoAdicional->certificaciones_urls = $certificaciones;

            // Cargar explícitamente la relación de productos
            $infoAdicional->load('productos');

            // Verificar que productos existe antes de usar map
            if ($infoAdicional->productos) {
                $infoAdicional->productos = $infoAdicional->productos->map(function ($producto) {
                    if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                        $producto->imagen_url = asset('storage/' . $producto->imagen);
                    }
                    return $producto;
                });
            }

            // Debug
            Log::info('Datos procesados de infoAdicional:', [
                'fotografias_paths' => $infoAdicional->fotografias_paths,
                'fotografias_urls' => $infoAdicional->fotografias_urls,
                'certificaciones_paths' => $infoAdicional->certificaciones_paths,
                'certificaciones_urls' => $infoAdicional->certificaciones_urls
            ]);

            $infoAdicional = array_merge($companyData, $infoAdicional->toArray());
        } else {
            $infoAdicional = $companyData;
        }

        return Inertia::render('Dashboard/FormEmpresa', [
            'userName' => $user->name,
            'infoAdicional' => $infoAdicional
        ]);
    }

    public function showComponents()
    {
        return Inertia::render('SuperAdmin/Components');
    }

    public function showReportes()
    {
        return Inertia::render('SuperAdmin/Reportes');
    }

    public function showProgresos()
    {
        return Inertia::render('SuperAdmin/Progresos');
    }
}
