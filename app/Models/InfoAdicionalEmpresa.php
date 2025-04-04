<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfoAdicionalEmpresa extends Model
{
    protected $table = 'info_adicional_empresas';

    protected $fillable = [
        'company_id',
        'nombre_comercial',
        'nombre_legal',
        'descripcion_es',
        'descripcion_en',
        'anio_fundacion',
        'sitio_web',
        'facebook',
        'linkedin',
        'instagram',
        'otra_red_social',
        'sector',
        'tamano_empresa',
        'cantidad_hombres',
        'cantidad_mujeres',
        'cantidad_otros',
        'cantidad_total',
        'telefono_1',
        'telefono_2',
        'es_exportadora',
        'paises_exportacion',
        'direccion_empresa',
        'provincia',
        'canton',
        'distrito',
        'cedula_juridica',
        'actividad_comercial',
        'producto_servicio',
        'rango_exportaciones',
        'planes_expansion',
        'razon_licenciamiento_es',
        'razon_licenciamiento_en',
        'proceso_licenciamiento',
        'recomienda_marca_pais',
        'observaciones',
        'contacto_notificacion_nombre',
        'contacto_notificacion_email',
        'contacto_notificacion_puesto',
        'contacto_notificacion_cedula',
        'contacto_notificacion_telefono',
        'contacto_notificacion_celular',
        'asignado_proceso_nombre',
        'asignado_proceso_email',
        'asignado_proceso_puesto',
        'asignado_proceso_cedula',
        'asignado_proceso_telefono',
        'asignado_proceso_celular',
        'mercadeo_nombre',
        'mercadeo_email',
        'mercadeo_puesto',
        'mercadeo_telefono',
        'mercadeo_celular',
        'micrositio_nombre',
        'micrositio_email',
        'micrositio_puesto',
        'micrositio_telefono',
        'micrositio_celular',
        'vocero_nombre',
        'vocero_email',
        'vocero_puesto',
        'vocero_telefono',
        'vocero_celular',
        'representante_nombre',
        'representante_email',
        'representante_puesto',
        'representante_cedula',
        'representante_telefono',
        'representante_celular',
        'productos',
        'logo_path',
        'fotografias_paths',
        'certificaciones_paths',
        'puntos_fuertes',
        'justificacion',
        'oportunidades',
        'tiene_multi_sitio',
        'cantidad_multi_sitio',
        'aprobo_evaluacion_multi_sitio'
    ];

    protected $casts = [
        'es_exportadora' => 'boolean',
        'recomienda_marca_pais' => 'boolean',
        'fotografias_paths' => 'array',
        'certificaciones_paths' => 'array',
        'puntos_fuertes' => 'string',
        'justificacion' => 'string',
        'oportunidades' => 'string',
        'tiene_multi_sitio' => 'integer',
        'cantidad_multi_sitio' => 'integer',
        'aprobo_evaluacion_multi_sitio' => 'integer'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function productos()
    {
        return $this->hasMany(CompanyProducts::class);
    }
}
