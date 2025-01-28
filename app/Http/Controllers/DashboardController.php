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

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    public function showEvaluation()
    {
        $user = auth()->user();
        $isAdmin = $user->isAdmin();
        
        // Obtener el total de indicadores activos
        $totalIndicadores = Indicator::where('is_active', true)->count();

        //Resultados de la autoevaluación
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();
        
        // Obtener el número de respuestas de la empresa
        $indicadoresRespondidos = IndicatorAnswer::whereHas('indicator', function($query) {
            $query->where('is_active', true);
        })
        ->where('company_id', $user->company_id)
        ->count();
        
        // Calcular el porcentaje de progreso
        $progreso = $totalIndicadores > 0 ? round(($indicadoresRespondidos / $totalIndicadores) * 100) : 0;
        
        // Obtener indicadores vinculantes fallidos
        $failedBindingIndicators = IndicatorAnswer::where('company_id', $user->company_id)
            ->where('is_binding', true)
            ->where('answer', 0)
            ->with('indicator:id,name,self_evaluation_question')
            ->get()
            ->map(function($answer) {
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
            ->map(function($result) {
                return [
                    'name' => $result->value->name,
                    'nota' => $result->nota
                ];
            });
        
        // Determinar el status
        $status = 'en_proceso';
        $autoEvaluationResult = \App\Models\AutoEvaluationResult::where('company_id', $user->company_id)->first();
        
        if ($autoEvaluationResult) {
            if ($indicadoresRespondidos === $totalIndicadores) {
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
            'progreso' => $progreso,
            'companyName' => $user->company->name,
            'status' => $status,
            'failedBindingIndicators' => $failedBindingIndicators,
            'failedValues' => $failedValues,
            'autoEvaluationResult' => $autoEvaluationResult
        ]);
    }

    public function showFormEmpresa(Request $request)
    {
        $user = auth()->user();
        $company = $user->company;
        $infoAdicional = $company->infoAdicional;

        // Actualizar form_sended en auto_evaluation_result
        if ($request->has('form_sended')) {
            AutoEvaluationResult::where('company_id', $user->company_id)
                ->update(['form_sended' => true]);
        }

        // Transformar las rutas de imágenes a URLs completas si existen
        if ($infoAdicional) {
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

            // Procesar productos con sus imágenes
            if ($infoAdicional && $infoAdicional->productos) {
                $infoAdicional->productos = $infoAdicional->productos->map(function($producto) {
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