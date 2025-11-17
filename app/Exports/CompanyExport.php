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
use Illuminate\Support\Collection;

class CompanyExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    protected $company;

    public function __construct(Company $company)
    {
        $this->company = $company;
    }

    public function collection()
    {
        // Devolvemos una colección con un solo elemento (la empresa)
        return new Collection([$this->company]);
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
            'Contacto Mercadeo - Nombre',
            'Contacto Mercadeo - Email',
            'Contacto Mercadeo - Puesto',
            'Contacto Mercadeo - Teléfono',
            'Contacto Mercadeo - Celular',
            'Contacto Micrositio - Nombre',
            'Contacto Micrositio - Email',
            'Contacto Micrositio - Puesto',
            'Contacto Micrositio - Teléfono',
            'Contacto Micrositio - Celular',
            'Contacto Vocero - Nombre',
            'Contacto Vocero - Email',
            'Contacto Vocero - Puesto',
            'Contacto Vocero - Teléfono',
            'Contacto Vocero - Celular',
            'Contacto Representante - Nombre',
            'Contacto Representante - Email',
            'Contacto Representante - Puesto',
            'Contacto Representante - Teléfono',
            'Contacto Representante - Celular',
            'Estado de Evaluación',
            'Status',
            'Fecha de Vencimiento',
            'Fecha de Registro',
            'Última Actualización',
        ];
    }

    public function map($company): array
    {
        // Obtener la información adicional de la empresa
        $infoAdicional = $company->infoAdicional;

        return [
            $company->id,
            $company->name,
            $company->legal_id, // La cédula jurídica está en el campo legal_id de la tabla companies
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
            $infoAdicional ? $infoAdicional->mercadeo_nombre : '',
            $infoAdicional ? $infoAdicional->mercadeo_email : '',
            $infoAdicional ? $infoAdicional->mercadeo_puesto : '',
            $infoAdicional ? $infoAdicional->mercadeo_telefono : '',
            $infoAdicional ? $infoAdicional->mercadeo_celular : '',
            $infoAdicional ? $infoAdicional->micrositio_nombre : '',
            $infoAdicional ? $infoAdicional->micrositio_email : '',
            $infoAdicional ? $infoAdicional->micrositio_puesto : '',
            $infoAdicional ? $infoAdicional->micrositio_telefono : '',
            $infoAdicional ? $infoAdicional->micrositio_celular : '',
            $infoAdicional ? $infoAdicional->vocero_nombre : '',
            $infoAdicional ? $infoAdicional->vocero_email : '',
            $infoAdicional ? $infoAdicional->vocero_puesto : '',
            $infoAdicional ? $infoAdicional->vocero_telefono : '',
            $infoAdicional ? $infoAdicional->vocero_celular : '',
            $infoAdicional ? $infoAdicional->representante_nombre : '',
            $infoAdicional ? $infoAdicional->representante_email : '',
            $infoAdicional ? $infoAdicional->representante_puesto : '',
            $infoAdicional ? $infoAdicional->representante_telefono : '',
            $infoAdicional ? $infoAdicional->representante_celular : '',
            $company->getFormattedStateAttribute(),
            $company->status,
            $company->fecha_vencimiento ? $company->fecha_vencimiento->format('d/m/Y') : '',
            $company->created_at->format('d/m/Y'),
            $company->updated_at->format('d/m/Y'),
        ];
    }

    /**
     * Aplicar estilos a la hoja de cálculo
     */
    public function styles(Worksheet $sheet)
    {
        // Obtener el número total de columnas
        $lastColumn = $sheet->getHighestColumn();
        $totalColumns = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($lastColumn);
        
        // Aplicar estilos a la cabecera
        $sheet->getStyle('A1:' . $lastColumn . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2C3E50'], // Color azul oscuro
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        
        // Altura de la fila de cabecera
        $sheet->getRowDimension(1)->setRowHeight(30);
        
        // Aplicar bordes a todas las celdas
        $borderStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
                'outline' => [
                    'borderStyle' => Border::BORDER_MEDIUM,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];
        
        // Aplicar bordes a todas las celdas con datos
        $sheet->getStyle('A1:' . $lastColumn . ($sheet->getHighestRow()))->applyFromArray($borderStyle);
        
        // Aplicar alineación a todas las celdas de datos
        $sheet->getStyle('A2:' . $lastColumn . ($sheet->getHighestRow()))->applyFromArray([
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
        ]);
        
        // Aplicar color de fondo alternado a las filas de datos
        for ($row = 2; $row <= $sheet->getHighestRow(); $row++) {
            if ($row % 2 == 0) {
                $sheet->getStyle('A' . $row . ':' . $lastColumn . $row)->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F5F5F5'], // Gris claro
                    ],
                ]);
            }
        }
        
        return $sheet;
    }

    public function title(): string
    {
        return 'Información de la Empresa';
    }
} 