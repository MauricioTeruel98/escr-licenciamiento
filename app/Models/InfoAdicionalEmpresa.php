<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InfoAdicionalEmpresa extends Model
{
    protected $guarded = [];
    
    protected $casts = [
        'contactos' => 'array',
        'productos' => 'array',
        'es_exportadora' => 'boolean',
        'recomienda_marca_pais' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
} 