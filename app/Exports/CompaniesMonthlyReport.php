<?php

namespace App\Exports;

use App\Models\Company;
use App\Models\Value;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\Exportable;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Facades\DB;

class CompaniesMonthlyReport implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    use Exportable;

    protected $values;
    protected $inicio;
    protected $fin;
    protected $metadata;

    public function __construct($inicio = null, $fin = null)
    {
        $this->values = Value::select('id', 'name', 'minimum_score')
            ->where('is_active', true)
            ->where('deleted', 0)
            ->get();

        $this->inicio = $inicio;
        $this->fin = $fin;
        
        // Inicializar metadata
        $this->metadata = [
            'total_companies' => 0,
            'companies_by_state' => [],
            'average_progress' => 0,
            'average_score' => 0,
            'generated_at' => now()->toDateTimeString()
        ];
    }

    public function getMetadata()
    {
        // Obtener el total de empresas
        $query = Company::query();
        if ($this->inicio && $this->fin) {
            $query->whereBetween('created_at', [$this->inicio, $this->fin]);
        }
        $this->metadata['total_companies'] = $query->count();

        // Obtener empresas por estado
        $companiesByState = $query->select('estado_eval', DB::raw('count(*) as total'))
            ->groupBy('estado_eval')
            ->get()
            ->pluck('total', 'estado_eval')
            ->toArray();
        
        $this->metadata['companies_by_state'] = $companiesByState;

        // Calcular promedios
        $companies = $query->with([
            'autoEvaluationValorResults',
            'autoEvaluationResult',
            'evaluationValueResults',
            'evaluationValueResultReferences'
        ])->get();

        $totalProgress = 0;
        $totalScore = 0;
        $companiesWithProgress = 0;

        foreach ($companies as $company) {
            $isAutoEvaluation = in_array($company->estado_eval, ['auto-evaluacion', 'auto-evaluacion-completed']);
            
            if ($isAutoEvaluation) {
                $progress = $company->autoEvaluationValorResults->avg('progress') ?? 0;
                $score = $company->autoEvaluationResult->nota ?? 0;
            } else {
                $progress = $company->evaluationValueResultReferences->avg('progress') ?? 0;
                $score = $company->evaluationValueResults->avg('nota') ?? 0;
            }

            if ($progress > 0) {
                $totalProgress += $progress;
                $totalScore += $score;
                $companiesWithProgress++;
            }
        }

        if ($companiesWithProgress > 0) {
            $this->metadata['average_progress'] = round($totalProgress / $companiesWithProgress, 2);
            $this->metadata['average_score'] = round($totalScore / $companiesWithProgress, 2);
        }

        return $this->metadata;
    }

    public function query()
    {
        $query = Company::query()
            ->with([
                'infoAdicional:id,company_id,provincia,representante_nombre',
                'autoEvaluationValorResults:id,company_id,value_id,nota,progress',
                'autoEvaluationResult:id,company_id,nota',
                'evaluationValueResults:id,company_id,value_id,nota',
                'evaluationValueResultReferences:id,company_id,value_id,progress',
                'users' => function($query) {
                    $query->select('id', 'company_id', 'name', 'lastname', 'role')
                          ->where('role', 'admin');
                }
            ]);

        // Si se pasan fechas, filtrar por el rango
        if ($this->inicio && $this->fin) {
            $query->whereBetween('created_at', [$this->inicio, $this->fin]);
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        $baseHeadings = [
            'ID',
            'Nombre',
            'Cédula Jurídica',
            'Provincia',
            'Representante Legal',
            'Estado del Proceso',
            'Status'
        ];

        foreach ($this->values as $value) {
            $baseHeadings[] = $value->name;
        }

        $baseHeadings[] = 'Progreso de la etapa';
        $baseHeadings[] = 'Porcentaje Total del Proceso';
        $baseHeadings[] = 'Fecha de Vencimiento';
        $baseHeadings[] = 'Fecha de Registro';

        return $baseHeadings;
    }

    public function map($company): array
    {
        $infoAdicional = $company->infoAdicional;
        $isAutoEvaluation = in_array($company->estado_eval, ['auto-evaluacion', 'auto-evaluacion-completed']);

        // Obtener el representante legal o el administrador de la empresa
        // Si el representante legal está vacío, se muestra el nombre del administrador de la empresa
        $representanteLegal = '';
        if ($infoAdicional && !empty($infoAdicional->representante_nombre)) {
            $representanteLegal = $infoAdicional->representante_nombre;
        } else {
            // Si no hay representante legal, usar el administrador de la empresa
            $admin = $company->users->first();
            if ($admin) {
                $representanteLegal = trim($admin->name . ' ' . $admin->lastname);
            }
        }

        $row = [
            $company->id,
            $company->name,
            $company->legal_id, // La cédula jurídica está en el campo legal_id de la tabla companies
            $company->provincia,
            $representanteLegal,
            $company->getFormattedStateAttribute(),
            $company->status
        ];

        $totalProgress = 0;
        $totalNota = 0;
        $countValues = 0;
        $totalValues = count($this->values);

        foreach ($this->values as $value) {
            if ($isAutoEvaluation) {
                $valorResult = $company->autoEvaluationValorResults
                    ->where('value_id', $value->id)
                    ->first();

                $progress = $valorResult ? $valorResult->progress : 0;
                $nota = $valorResult ? $valorResult->nota : 0;
            } else {
                $reference = $company->evaluationValueResultReferences
                    ->where('value_id', $value->id)
                    ->first();
                $valorResult = $company->evaluationValueResults
                    ->where('value_id', $value->id)
                    ->first();

                $progress = $reference ? $reference->progress : 0;
                $nota = $valorResult ? $valorResult->nota : 0;
            }

            $row[] = "{$value->name}---Avance: {$progress}%---Nota: {$nota}/{$value->minimum_score}";

            // Siempre sumar el progreso, incluso si es 0
            $totalProgress += $progress;
            $totalNota += $nota;
            $countValues++;
        }

        // Calcular el progreso promedio considerando todos los valores
        $avgProgress = $totalValues > 0 ? round($totalProgress / $totalValues) : 0;
        
        // Calcular el porcentaje total del proceso considerando las etapas
        // Autoevaluación: 50% del proceso total
        // Evaluación: 50% del proceso total
        $totalProcessPercentage = 0;
        
        if ($isAutoEvaluation) {
            // Si está en autoevaluación, calcular 50% del progreso de autoevaluación
            $autoEvalProgress = $totalValues > 0 ? round($totalProgress / $totalValues) : 0;
            $totalProcessPercentage = round(($autoEvalProgress * 50) / 100, 1);
        } else {
            // Si está en evaluación, calcular 50% de autoevaluación + 50% del progreso de evaluación
            $evaluationProgress = $totalValues > 0 ? round($totalProgress / $totalValues) : 0;
            $totalProcessPercentage = round(50 + (($evaluationProgress * 50) / 100), 1);
        }
        
        // La nota final ahora es el porcentaje total del proceso
        $row[] = "{$avgProgress}%";
        $row[] = "{$totalProcessPercentage}%";
        
        // Añadir fecha de vencimiento formateada
        $fechaVencimiento = $company->fecha_vencimiento ? $company->fecha_vencimiento->format('d/m/Y') : 'N/A';
        $row[] = $fechaVencimiento;
        
        // Añadir fecha de registro formateada
        $fechaRegistro = $company->created_at ? $company->created_at->format('d/m/Y H:i') : 'N/A';
        $row[] = $fechaRegistro;

        return $row;
    }

    public function title(): string
    {
        return 'Reporte Mensual de Empresas';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2C3E50'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }
} 