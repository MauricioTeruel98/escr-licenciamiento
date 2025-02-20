<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Certification extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'nombre',
        'fecha_obtencion',
        'fecha_expiracion',
        'indicadores',
        'homologation_id',
        'organismo_certificador'
    ];

    protected $casts = [
        'fecha_obtencion' => 'date',
        'fecha_expiracion' => 'date',
        'indicadores' => 'integer',
        'homologation_id' => 'integer',
    ];

    /**
     * Obtiene la empresa a la que pertenece esta certificación
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Obtiene la certificación disponible asociada
     */
    public function availableCertification()
    {
        return $this->belongsTo(AvailableCertification::class, 'nombre', 'nombre');
    }
}