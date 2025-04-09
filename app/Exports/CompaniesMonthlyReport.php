<?php

namespace App\Exports;

use App\Models\Company;
use App\Models\Value;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class CompaniesMonthlyReport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    protected $values;

    public function __construct()
    {
        $this->values = Value::where('is_active', true)->where('deleted', 0)->get();
    }

    public function collection()
    {
        return Company::with([
            'infoAdicional',
            'autoEvaluationValorResults',
            'autoEvaluationResult',
            'evaluationValueResults',
            'evaluationValueResultReferences'
        ])->get();
    }

    public function headings(): array
    {
        $baseHeadings = [
            'ID',
            'Nombre',
            'Cédula Jurídica',
            'Provincia',
            'Representante Legal',
            'Estado del Proceso'
        ];

        // Agregar una columna por cada valor
        foreach ($this->values as $value) {
            $baseHeadings[] = $value->name;
        }

        $baseHeadings[] = 'Progreso Total';
        $baseHeadings[] = 'Nota Final';

        return $baseHeadings;
    }

    public function map($company): array
    {
        $infoAdicional = $company->infoAdicional;
        $isAutoEvaluation = in_array($company->estado_eval, ['auto-evaluacion', 'auto-evaluacion-completed']);

        $row = [
            $company->id,
            $company->name,
            $infoAdicional ? $infoAdicional->cedula_juridica : '',
            $infoAdicional ? $infoAdicional->provincia : '',
            $infoAdicional ? $infoAdicional->representante_nombre : '',
            $company->getFormattedStateAttribute()
        ];

        $totalProgress = 0;
        $totalNota = 0;
        $countValues = 0;

        // Procesar cada valor
        foreach ($this->values as $value) {
            if ($isAutoEvaluation) {
                $valorResult = $company->autoEvaluationValorResults
                    ->where('value_id', $value->id)
                    ->first();

                $progress = $valorResult ? $valorResult->progress : 0;
                $nota = $valorResult ? $valorResult->nota : 0;
                $notaMinima = $value->minimum_score;
            } else {
                $reference = $company->evaluationValueResultReferences
                    ->where('value_id', $value->id)
                    ->first();
                $valorResult = $company->evaluationValueResults
                    ->where('value_id', $value->id)
                    ->first();

                $progress = $reference ? $reference->progress : 0;
                $nota = $valorResult ? $valorResult->nota : 0;
                $notaMinima = $value->minimum_score;
            }

            $row[] = "{$value->name}---Avance: {$progress}%---Nota: {$nota}/{$notaMinima}";

            if ($progress > 0) {
                $totalProgress += $progress;
                $totalNota += $nota;
                $countValues++;
            }
        }

        // Calcular promedios
        $avgProgress = $countValues > 0 ? round($totalProgress / $countValues) : 0;
        
        if ($isAutoEvaluation) {
            $finalNota = $company->autoEvaluationResult ? $company->autoEvaluationResult->nota : 0;
        } else {
            $finalNota = $countValues > 0 ? round($totalNota / $countValues) : 0;
        }

        $row[] = "{$avgProgress}%";
        $row[] = $finalNota;

        return $row;
    }

    public function title(): string
    {
        return 'Reporte Mensual de Empresas';
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = $sheet->getHighestColumn();
        
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