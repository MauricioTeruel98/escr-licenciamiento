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
use App\Models\EvaluationQuestion;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\EvaluatorAssessment;
use App\Models\EvaluationValueResult;
use App\Models\EvaluationValueResultReference;

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

        // Verificar si la empresa ha iniciado su auto-evaluación
        /*if (!$company->fecha_inicio_auto_evaluacion) {
            return Inertia::render('Dashboard/Evaluation', [
                'userName' => $user->name,
                'isAdmin' => $isAdmin,
                'error' => 'La empresa no ha iniciado su auto-evaluación'
            ]);
        }*/

        // Obtener el total de indicadores activos
        $totalIndicadores = Indicator::where('is_active', true)
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->count();

        //Resultados de la autoevaluación
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();

        // Obtener el número de respuestas de la empresa
        $indicadoresRespondidos = IndicatorAnswer::whereHas('indicator', function ($query) use ($company) {
            $query->where('is_active', true)
                ->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
        })
            ->where('company_id', $user->company_id)
            ->count();

        // Calcular el porcentaje de progreso
        $progreso = $totalIndicadores > 0 ? round(($indicadoresRespondidos / $totalIndicadores) * 100) : 0;

        // Obtener los IDs de los indicadores respondidos con "sí"
        $indicatorIds = IndicatorAnswer::where('company_id', $user->company_id)
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
            })
            ->where(function ($query) {
                $query->whereIn('answer', ['1', 'si', 'sí', 'yes', 1, true]);
            })
            ->pluck('indicator_id');

        $numeroDePreguntasQueVaAResponderLaEmpresa = 0;
        $numeroDePreguntasQueRespondioLaEmpresa = 0;
        $progresoEvaluacion = 0;

        if ($company->estado_eval != 'auto-evaluacion' && $company->estado_eval != 'auto-evaluacion-completed') {
            $numeroDePreguntasQueVaAResponderLaEmpresa = EvaluationQuestion::whereIn('indicator_id', $indicatorIds)
                ->where('deleted', false)
                ->whereHas('indicator', function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->count();

            $numeroDePreguntasQueRespondioLaEmpresa = IndicatorAnswerEvaluation::where('company_id', $user->company_id)
                ->whereHas('evaluationQuestion', function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->whereHas('evaluationQuestion.indicator', function ($query) use ($company) {
                    $query->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        });
                })
                ->count();

            $progresoEvaluacion = $numeroDePreguntasQueVaAResponderLaEmpresa > 0
                ? ($numeroDePreguntasQueRespondioLaEmpresa / $numeroDePreguntasQueVaAResponderLaEmpresa) * 100
                : 0;
        }

        // Calcular indicadores homologados por certificaciones
        $indicadoresHomologados = 0;
        $certificaciones = Certification::where('company_id', $user->company_id)
            ->where(function ($query) {
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
                    ->whereHas('indicator', function ($query) use ($company) {
                        $query->where('is_active', true)
                            ->where('deleted', false)
                            ->where(function ($q) use ($company) {
                                $q->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            });
                    })
                    ->distinct('indicator_id')
                    ->count('indicator_id');
            }
        }

        // Obtener indicadores vinculantes fallidos
        $failedBindingIndicators = IndicatorAnswer::where('company_id', $user->company_id)
            ->where('is_binding', true)
            ->where('answer', 0)
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
            })
            ->with('indicator:id,name,self_evaluation_question')
            ->get()
            ->map(function ($answer) {
                return [
                    'name' => $answer->indicator->name,
                    'question' => $answer->indicator->self_evaluation_question
                ];
            });

        // Obtener valores con nota insuficiente (menor a la nota mínima requerida para cada valor)
        $failedValues = AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->whereHas('value', function ($query) use ($company) {
                $query->where('deleted', false)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    });
            })
            ->with(['value' => function ($query) {
                $query->select('id', 'name', 'minimum_score');
            }])
            ->get()
            ->filter(function ($result) {
                // Usar la nota mínima del valor o 70 como valor por defecto
                $minimumScore = $result->value->minimum_score ?? 70;
                return $result->nota < $minimumScore;
            })
            ->map(function ($result) {
                return [
                    'name' => $result->value->name,
                    'nota' => $result->nota,
                    'nota_minima' => $result->value->minimum_score ?? 70
                ];
            })
            ->values(); // Asegura que el array resultante esté reindexado

        // Determinar el status
        $status = 'en_proceso';
        $autoEvaluationResult = \App\Models\AutoEvaluationResult::where('company_id', $user->company_id)->first();

        $activeValues = Value::where('is_active', true)
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->count();
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

        // Obtener preguntas descalificatorias respondidas con NO
        $preguntasDescalificatoriasRechazadas = EvaluatorAssessment::with(['indicator', 'evaluationQuestion'])
            ->whereHas('indicator', function ($query) use ($company) {
                $query->where('binding', true)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    });
            })
            ->whereHas('evaluationQuestion') // Asegurar que la pregunta existe
            ->where('approved', false)
            ->where('company_id', $user->company_id)
            ->get()
            ->map(function ($assessment) {
                // Validar que evaluationQuestion no sea null antes de acceder a sus propiedades
                return [
                    'indicator_name' => $assessment->indicator ? $assessment->indicator->name : 'N/A',
                    'indicator_id' => $assessment->indicator_id,
                    'question' => $assessment->evaluationQuestion ? $assessment->evaluationQuestion->question : 'N/A',
                    'question_id' => $assessment->evaluation_question_id,
                    'evaluator_comment' => $assessment->comment
                ];
            });

        // Obtener todos los valores activos con sus resultados
        $values = Value::where('is_active', true)
            ->where('deleted', false)
            ->where(function ($query) use ($company) {
                $query->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->with(['subcategories' => function ($query) use ($company) {
                $query->where('deleted', false)
                    ->where(function ($q) use ($company) {
                        $q->whereNull('created_at')
                            ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                    })
                    ->with(['indicators' => function ($query) use ($company) {
                        $query->where('deleted', false)
                            ->where(function ($q) use ($company) {
                                $q->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            });
                    }]);
            }])
            ->get();

        // Obtener los resultados de autoevaluación para cada valor
        $valueResults = AutoEvaluationValorResult::where('company_id', $user->company_id)
            ->get()
            ->keyBy('value_id');

        $valueEvaluationResults = EvaluationValueResult::where('company_id', $user->company_id)
            ->get()
            ->keyBy('value_id');

        // Obtener indicadores homologados
        $homologatedIndicators = [];
        if ($certificaciones->count() > 0) {
            $homologationIds = $certificaciones->pluck('homologation_id')->filter()->toArray();
            if (!empty($homologationIds)) {
                $homologatedIndicators = IndicatorHomologation::whereIn('homologation_id', $homologationIds)
                    ->whereHas('indicator', function ($query) use ($company) {
                        $query->where('is_active', true)
                            ->where('deleted', false)
                            ->where(function ($q) use ($company) {
                                $q->whereNull('created_at')
                                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                            });
                    })
                    ->pluck('indicator_id')
                    ->toArray();
            }
        }

        // Calcular progreso para cada valor autoevaluación
        $valuesProgress = $values->map(function ($value) use ($valueResults, $homologatedIndicators, $company) {
            $totalIndicators = 0;
            $answeredIndicators = 0;
            $answeredIndicatorIds = []; // Array para rastrear indicadores ya contados
            
            foreach ($value->subcategories as $subcategory) {
                foreach ($subcategory->indicators as $indicator) {
                    $totalIndicators++;
                    // Verificar si el indicador está homologado y no ha sido contado aún
                    if (in_array($indicator->id, $homologatedIndicators)) {
                        $answeredIndicators++;
                        $answeredIndicatorIds[] = $indicator->id; // Registrar este indicador como contado
                    }
                }
            }
            
            // Obtener respuestas de indicadores (Si/No) para esta compañía y valor
            $answeredQuery = IndicatorAnswer::where('company_id', Auth::user()->company_id)
                ->whereHas('indicator', function ($query) use ($value, $company) {
                    $query->where('is_active', true)
                        ->where('deleted', false)
                        ->where(function ($q) use ($company) {
                            $q->whereNull('created_at')
                                ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                        })
                        ->whereHas('subcategory', function ($q) use ($value) {
                            $q->where('value_id', $value->id)
                                ->where('deleted', false);
                        });
                });
            
            // Si hay indicadores ya contados, excluirlos de la consulta
            if (!empty($answeredIndicatorIds)) {
                $answeredQuery->whereHas('indicator', function($q) use ($answeredIndicatorIds) {
                    $q->whereNotIn('id', $answeredIndicatorIds);
                });
            }
            
            $answered = $answeredQuery->count();
            
            $answeredIndicators += $answered;
            
            return [
                'id' => $value->id,
                'name' => $value->name,
                'minimum_score' => $value->minimum_score,
                'total_indicators' => $totalIndicators,
                'answered_indicators' => $answeredIndicators,
                'progress' => $totalIndicators > 0 ? round(($answeredIndicators / $totalIndicators) * 100) : 0,
                'result' => $valueResults->get($value->id),
            ];
        });

        // Calcular progreso para cada valor Evaluación
        $valuesProgressEvaluacion = $values->map(function ($value) use ($valueEvaluationResults, $homologatedIndicators, $company) {
            $totalQuestions = 0;
            $answeredQuestions = 0;
            $result = EvaluationValueResultReference::where('company_id', Auth::user()->company_id)
                ->where('value_id', $value->id)
                ->where('value_completed', true)
                ->first();
                
            // Obtener todos los indicadores para este valor
            $indicators = Indicator::whereHas('subcategory', function ($query) use ($value) {
                $query->where('value_id', $value->id)
                    ->where('deleted', false);
            })
            ->where('is_active', true)
            ->where('deleted', false)
            ->where(function ($q) use ($company) {
                $q->whereNull('created_at')
                    ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
            })
            ->get();
            
            foreach ($indicators as $indicator) {
                // Verificar si el indicador tiene respuesta afirmativa
                $indicatorAnswer = IndicatorAnswer::where('company_id', Auth::user()->company_id)
                    ->where('indicator_id', $indicator->id)
                    ->where(function ($query) {
                        $query->where('answer', '1')
                            ->orWhere('answer', 'si')
                            ->orWhere('answer', 'sí')
                            ->orWhere('answer', 'yes')
                            ->orWhere('answer', 1)
                            ->orWhere('answer', true);
                    })
                    ->first();
                
                // Solo contar preguntas si el indicador tiene respuesta afirmativa
                if ($indicatorAnswer) {
                    // Contar preguntas de evaluación para este indicador
                    $evaluationQuestions = EvaluationQuestion::where('indicator_id', $indicator->id)
                        ->where('deleted', false)
                        ->get();
                    
                    $totalQuestions += $evaluationQuestions->count();
                    
                    // Verificar si el indicador está homologado
                    $isHomologated = in_array($indicator->id, $homologatedIndicators);
                    
                    if ($isHomologated) {
                        // Si está homologado, todas sus preguntas se consideran respondidas
                        $answeredQuestions += $evaluationQuestions->count();
                    } else {
                        // Contar respuestas de evaluación para este indicador
                        $answeredCount = IndicatorAnswerEvaluation::where('company_id', Auth::user()->company_id)
                            ->where('indicator_id', $indicator->id)
                            ->whereIn('evaluation_question_id', $evaluationQuestions->pluck('id'))
                            ->count();
                        
                        $answeredQuestions += $answeredCount;
                    }
                }
            }
            
            return [
                'id' => $value->id,
                'name' => $value->name,
                'total_questions' => $totalQuestions,
                'answered_questions' => $answeredQuestions,
                'progress' => $totalQuestions > 0 ? round(($answeredQuestions / $totalQuestions) * 100) : 0,
                'result' => $result,
            ];
        });

        return Inertia::render('Dashboard/Evaluation', [
            'userName' => $user->name,
            'isAdmin' => $isAdmin,
            'pendingRequests' => $pendingRequests,
            'totalIndicadores' => $totalIndicadores,
            'indicadoresRespondidos' => $indicadoresRespondidos,
            'indicadoresHomologados' => $indicadoresHomologados,
            'numeroDePreguntasQueVaAResponderLaEmpresa' => $numeroDePreguntasQueVaAResponderLaEmpresa,
            'numeroDePreguntasQueRespondioLaEmpresa' => $numeroDePreguntasQueRespondioLaEmpresa,
            'progreso' => $progreso,
            'progresoEvaluacion' => $progresoEvaluacion,
            'companyName' => $user->company->name,
            'status' => $status,
            'failedBindingIndicators' => $failedBindingIndicators,
            'failedValues' => $failedValues,
            'autoEvaluationResult' => $autoEvaluationResult,
            'company' => $company,
            'preguntasDescalificatoriasRechazadas' => $preguntasDescalificatoriasRechazadas,
            'valuesProgress' => $valuesProgress,
            'valuesProgressEvaluacion' => $valuesProgressEvaluacion,
            'flash' => [
                'error' => session('error'),
                'success' => session('success')
            ]
        ]);
    }

    public function showFormEmpresa(Request $request)
    {
        $user = Auth::user();
        $company = $user->company;
        $infoAdicional = $company->infoAdicional;
        $autoEvaluationResult = AutoEvaluationResult::where('company_id', $user->company_id)->first();

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
                    // Crear un array con todos los atributos que queremos asegurar que estén incluidos
                    $productoData = [
                        'id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'descripcion' => $producto->descripcion,
                        'imagen' => $producto->imagen,
                        'imagen_2' => $producto->imagen_2,
                        'imagen_3' => $producto->imagen_3
                    ];

                    // Añadir URLs para las imágenes si existen
                    if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                        $productoData['imagen_url'] = asset('storage/' . $producto->imagen);
                    }

                    if ($producto->imagen_2 && Storage::disk('public')->exists($producto->imagen_2)) {
                        $productoData['imagen_2_url'] = asset('storage/' . $producto->imagen_2);
                    }

                    if ($producto->imagen_3 && Storage::disk('public')->exists($producto->imagen_3)) {
                        $productoData['imagen_3_url'] = asset('storage/' . $producto->imagen_3);
                    }

                    // Convertir el array a objeto para mantener consistencia con el código existente
                    return (object)$productoData;
                });

                // Agregar un log para depurar las imágenes de productos
                Log::info(
                    'Productos cargados con sus imágenes:',
                    $infoAdicional->productos->map(function ($producto) {
                        return [
                            'id' => $producto->id,
                            'nombre' => $producto->nombre,
                            'imagen' => $producto->imagen,
                            'imagen_url' => $producto->imagen_url ?? null,
                            'imagen_2' => $producto->imagen_2,
                            'imagen_2_url' => $producto->imagen_2_url ?? null,
                            'imagen_3' => $producto->imagen_3,
                            'imagen_3_url' => $producto->imagen_3_url ?? null,
                        ];
                    })->toArray()
                );
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

        $company = Company::find($user->company_id);

        return Inertia::render('Dashboard/FormEmpresa', [
            'userName' => $user->name,
            'infoAdicional' => $infoAdicional,
            'autoEvaluationResult' => $autoEvaluationResult,
            'company' => $company
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
