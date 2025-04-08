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
            'Teléfono',
            'Teléfono Móvil',
            'Sitio Web',
            'Sector',
            'Provincia',
            'Cantón',
            'Distrito',
            'Actividad Comercial',
            'Es Exportadora',
            'Descripción (ES)',
            'Descripción (EN)',
            'Año de Fundación',
            'Facebook',
            'LinkedIn',
            'Instagram',
            'Otra Red Social',
            'Tamaño de Empresa',
            'Cantidad Hombres',
            'Cantidad Mujeres',
            'Cantidad Otros',
            'Teléfono 1',
            'Teléfono 2',
            'Países Exportación',
            'Rango Exportaciones',
            'Planes Expansión',
            'Razón Licenciamiento (ES)',
            'Razón Licenciamiento (EN)',
            'Proceso Licenciamiento',
            'Recomienda Marca País',
            'Observaciones',
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
            $company->phone,
            $company->mobile,
            $company->website ?? ($infoAdicional ? $infoAdicional->sitio_web : ''),
            $company->sector,
            $company->provincia,
            $company->canton,
            $company->distrito,
            $company->commercial_activity,
            $company->is_exporter ? 'Sí' : 'No',
            $infoAdicional ? $infoAdicional->descripcion_es : '',
            $infoAdicional ? $infoAdicional->descripcion_en : '',
            $infoAdicional ? $infoAdicional->anio_fundacion : '',
            $infoAdicional ? $infoAdicional->facebook : '',
            $infoAdicional ? $infoAdicional->linkedin : '',
            $infoAdicional ? $infoAdicional->instagram : '',
            $infoAdicional ? $infoAdicional->otra_red_social : '',
            $infoAdicional ? $infoAdicional->tamano_empresa : '',
            $infoAdicional ? $infoAdicional->cantidad_hombres : '',
            $infoAdicional ? $infoAdicional->cantidad_mujeres : '',
            $infoAdicional ? $infoAdicional->cantidad_otros : '',
            $infoAdicional ? $infoAdicional->telefono_1 : '',
            $infoAdicional ? $infoAdicional->telefono_2 : '',
            $infoAdicional ? $infoAdicional->paises_exportacion : '',
            $infoAdicional ? $infoAdicional->rango_exportaciones : '',
            $infoAdicional ? $infoAdicional->planes_expansion : '',
            $infoAdicional ? $infoAdicional->razon_licenciamiento_es : '',
            $infoAdicional ? $infoAdicional->razon_licenciamiento_en : '',
            $infoAdicional ? $infoAdicional->proceso_licenciamiento : '',
            $infoAdicional ? ($infoAdicional->recomienda_marca_pais ? 'Sí' : 'No') : '',
            $infoAdicional ? $infoAdicional->observaciones : '',
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