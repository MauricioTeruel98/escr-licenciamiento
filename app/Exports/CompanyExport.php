<?php

namespace App\Exports;

use App\Models\Company;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Illuminate\Support\Collection;

class CompanyExport implements FromCollection, WithHeadings, WithMapping, WithTitle
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
            'Nombre Comercial',
            'Nombre Legal',
            'Email',
            'Teléfono',
            'Dirección',
            'Ciudad',
            'Estado',
            'País',
            'Código Postal',
            'Sitio Web',
            'Descripción (ES)',
            'Descripción (EN)',
            'Año de Fundación',
            'Facebook',
            'LinkedIn',
            'Instagram',
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
            $infoAdicional ? $infoAdicional->nombre_comercial : '',
            $infoAdicional ? $infoAdicional->nombre_legal : '',
            $company->email,
            $company->phone,
            $company->address,
            $company->city,
            $company->state,
            $company->country,
            $company->postal_code,
            $infoAdicional ? $infoAdicional->sitio_web : '',
            $infoAdicional ? $infoAdicional->descripcion_es : '',
            $infoAdicional ? $infoAdicional->descripcion_en : '',
            $infoAdicional ? $infoAdicional->anio_fundacion : '',
            $infoAdicional ? $infoAdicional->facebook : '',
            $infoAdicional ? $infoAdicional->linkedin : '',
            $infoAdicional ? $infoAdicional->instagram : '',
            $company->created_at->format('d/m/Y'),
            $company->updated_at->format('d/m/Y'),
        ];
    }

    public function title(): string
    {
        return 'Información de la Empresa';
    }
} 