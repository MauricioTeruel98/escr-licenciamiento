<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfoAdicionalEmpresa extends Model
{
    protected $table = 'info_adicional_empresas';
    
    protected $guarded = [];
    
    protected $casts = [
        'es_exportadora' => 'boolean',
        'recomienda_marca_pais' => 'boolean',
        'fotografias_paths' => 'array',
        'certificaciones_paths' => 'array',
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