<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Models\InfoAdicionalEmpresa;
use Illuminate\Support\Facades\Log;
use App\Models\Value;
use App\Models\EvaluatorAssessment;
use App\Models\IndicatorAnswerEvaluation;
use App\Models\Indicator;
use App\Models\EvaluationValueResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

        // Verificar si el usuario es super_admin o evaluador
        $user = auth()->user();
        if ($user->role === 'super_admin' || $user->role === 'evaluador') {
            // Solo regenerar el documento si la empresa ya ha sido evaluada
            if (in_array($company->estado_eval, ['evaluado', 'evaluacion-calificada'])) {
                $documentRegenerated = $this->regenerateEvaluationDocument($company, $user);
                if ($documentRegenerated) {
                    Log::info('Documento de evaluación regenerado exitosamente', [
                        'company_id' => $company->id,
                        'user_id' => $user->id,
                        'role' => $user->role
                    ]);
                } else {
                    Log::warning('No se pudo regenerar el documento de evaluación', [
                        'company_id' => $company->id,
                        'user_id' => $user->id,
                        'role' => $user->role
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'La información de la empresa ha sido actualizada exitosamente.');
    }

    private function regenerateEvaluationDocument($company, $user)
    {
        try {
            // Crear estructura de carpetas para la empresa
            $companySlug = Str::slug($company->name);
            $basePath = storage_path('app/public/companies');
            $companyPath = "{$basePath}/{$company->id}/evaluations";

            // Eliminar todos los PDFs anteriores de evaluación
            if (file_exists($companyPath)) {
                $files = glob($companyPath . "/evaluation_{$company->id}_{$companySlug}_*.pdf");
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                    }
                }
            }

            // Obtener todos los valores
            $allValues = Value::where('is_active', true)
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get();

            // Obtener las puntuaciones finales
            $finalScores = EvaluationValueResult::where('company_id', $company->id)
                ->get()
                ->keyBy('value_id');

            // Obtener todas las evaluaciones del evaluador para esta empresa
            $evaluatorAssessments = EvaluatorAssessment::where('company_id', $company->id)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de la empresa
            $companyAnswers = IndicatorAnswerEvaluation::where('company_id', $company->id)
                ->with(['evaluationQuestion', 'indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Obtener todas las respuestas de autoevaluación
            $autoEvaluationAnswers = \App\Models\IndicatorAnswer::where('company_id', $company->id)
                ->with(['indicator'])
                ->get()
                ->groupBy('indicator_id');

            // Agrupar indicadores por valor
            $indicatorsByValue = Indicator::where('is_active', true)
                ->with(['subcategory.value', 'evaluationQuestions'])
                ->where('deleted', false)
                ->where(function ($query) use ($company) {
                    $query->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                })
                ->get()
                ->groupBy('subcategory.value.id');

            // Generar nuevo PDF
            $pdf = Pdf::loadView('pdf/evaluation', [
                'values' => $allValues,
                'company' => $company,
                'evaluador' => $user,
                'date' => now()->format('d/m/Y'),
                'finalScores' => $finalScores,
                'evaluatorAssessments' => $evaluatorAssessments,
                'companyAnswers' => $companyAnswers,
                'autoEvaluationAnswers' => $autoEvaluationAnswers,
                'indicatorsByValue' => $indicatorsByValue
            ]);

            // Crear carpetas si no existen
            if (!file_exists($basePath)) {
                mkdir($basePath, 0755, true);
            }
            if (!file_exists($companyPath)) {
                mkdir($companyPath, 0755, true);
            }

            // Generar nombre de archivo con timestamp
            $fileName = "evaluation_{$company->id}_{$companySlug}_" . date('Y-m-d_His') . '.pdf';
            $fullPath = "{$companyPath}/{$fileName}";

            // Guardar PDF
            $pdf->save($fullPath);

            $finalEvaluationPath = "companies/{$company->id}/evaluations/{$fileName}";

            // Actualizar la ruta del documento en la empresa
            $company->evaluation_document_path = $finalEvaluationPath;
            $company->save();

            Log::info('PDFs anteriores eliminados y nuevo PDF generado', [
                'company_id' => $company->id,
                'new_path' => $finalEvaluationPath
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error al regenerar el documento de evaluación:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }
} 