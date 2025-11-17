<?php

namespace App\Exports;

use App\Models\User;
use App\Models\Company;
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

class UsersCompaniesReport implements FromQuery, WithHeadings, WithMapping, WithTitle, WithStyles, ShouldAutoSize
{
    use Exportable;

    protected $inicio;
    protected $fin;

    public function __construct($inicio = null, $fin = null)
    {
        $this->inicio = $inicio;
        $this->fin = $fin;
    }

    public function query()
    {
        $query = User::query()
            ->with([
                'company',
                'company.infoAdicional'
            ])
            ->where('role', '!=', 'super_admin'); // Excluir super admin

        // Si se pasan fechas, filtrar por el rango
        if ($this->inicio && $this->fin) {
            $query->whereBetween('created_at', [$this->inicio, $this->fin]);
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'ID Usuario',
            'Fecha Registro',
            'Nombre',
            'Apellidos',
            'Cédula',
            'Email',
            'Teléfono',
            'Empresa - Estado',
            'Empresa - Nombre',
            'Empresa - Sector',
            'Empresa - Provincia',
            'Empresa - Cantón',
            'Empresa - Régimen',
            'Empresa - Cédula Jurídica',
            'Empresa - Email Notificaciones',
            'Empresa - Dirección Exacta',
            'Empresa - Actividad Lucrativa',
            'Empresa - Teléfono',
            'Empresa - Teléfono Secundario',
            'Empresa - Gerente General',
            'Empresa - Representante Legal',
            'Empresa - Sitio Web',
            'Empresa - Exporta'
        ];
    }

    public function map($user): array
    {
        $company = $user->company;
        $infoAdicional = $company ? $company->infoAdicional : null;

        // Determinar el estado de la empresa
        $empresaEstado = 'Nueva';
        if ($company) {
            switch ($company->estado_eval) {
                case 'auto-evaluacion':
                    $empresaEstado = 'En Autoevaluación';
                    break;
                case 'auto-evaluacion-completed':
                    $empresaEstado = 'Autoevaluación Completada';
                    break;
                case 'evaluacion':
                    $empresaEstado = 'En Evaluación';
                    break;
                case 'evaluacion-completed':
                    $empresaEstado = 'Evaluación Completada';
                    break;
                case 'certificada':
                    $empresaEstado = 'Certificada';
                    break;
                default:
                    $empresaEstado = 'Nueva';
                    break;
            }
        }

        // Determinar si exporta
        $exporta = 'no';
        if ($company && $company->is_exporter) {
            $exporta = 'si';
        } elseif ($infoAdicional && $infoAdicional->es_exportadora) {
            $exporta = 'si';
        }

        return [
            $user->id,
            $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : '',
            $user->name ?? '',
            $user->lastname ?? '',
            $user->cedula ?? $user->id_number ?? '',
            $user->email ?? '',
            $user->phone ?? '',
            $empresaEstado,
            $company ? $company->name : '',
            $company ? $company->sector : ($infoAdicional ? $infoAdicional->sector : ''),
            $company ? $company->provincia : ($infoAdicional ? $infoAdicional->provincia : ''),
            $company ? $company->canton : ($infoAdicional ? $infoAdicional->canton : ''),
            '', // Régimen - no hay campo específico
            $company ? $company->legal_id : ($infoAdicional ? $infoAdicional->cedula_juridica : ''),
            $infoAdicional ? $infoAdicional->contacto_notificacion_email : '',
            $infoAdicional ? $infoAdicional->direccion_empresa : '',
            $company ? $company->commercial_activity : ($infoAdicional ? $infoAdicional->actividad_comercial : ''),
            $company ? $company->phone : ($infoAdicional ? $infoAdicional->telefono_1 : ''),
            $infoAdicional ? $infoAdicional->telefono_2 : '', // Teléfono Secundario
            $infoAdicional ? $infoAdicional->asignado_proceso_nombre : '', // Gerente General
            $infoAdicional ? $infoAdicional->representante_nombre : '',
            $company ? $company->website : ($infoAdicional ? $infoAdicional->sitio_web : ''),
            $exporta
        ];
    }

    public function title(): string
    {
        return 'Reporte de Usuarios y Empresas';
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
