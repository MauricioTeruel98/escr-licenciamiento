<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AvailableCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    /**
     * Obtiene todas las certificaciones de empresas que usan este tipo
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class, 'nombre', 'nombre');
    }
}