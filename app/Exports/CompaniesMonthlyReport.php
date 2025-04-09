<?php

namespace App\Exports;

use App\Models\Company;
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
    public function collection()
    {
        return Company::with('infoAdicional')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Cédula Jurídica',
            'Nombre Comercial',
            'Nombre Legal',
            'Estado de Evaluación',
            'Fecha de Registro',
            'Última Actualización',
        ];
    }

    public function map($company): array
    {
        $infoAdicional = $company->infoAdicional;

        return [
            $company->id,
            $company->name,
            $infoAdicional ? $infoAdicional->cedula_juridica : '',
            $infoAdicional ? $infoAdicional->nombre_comercial : '',
            $infoAdicional ? $infoAdicional->nombre_legal : '',
            $company->estado_eval ?? 'N/A',
            $company->created_at ? $company->created_at->format('d/m/Y') : '',
            $company->updated_at ? $company->updated_at->format('d/m/Y') : '',
        ];
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