<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AvailableCertification extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
        'tipo',
        'categoria'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public const TIPOS = [
        'INTE' => 'INTE',
        'ISO' => 'ISO',
        'IEC' => 'IEC',
        'OTRO' => 'Otro'
    ];

    public const CATEGORIAS = [
        'EXCELENCIA' => 'Excepcional',
        'INNOVACION' => 'Innovación',
        'PROGRESO_SOCIAL' => 'Progreso Social',
        'SOSTENIBILIDAD' => 'Sostenibilidad',
        'VINCULACION' => 'Vinculación'
    ];

    public function certifications()
    {
        return $this->hasMany(Certification::class, 'nombre', 'nombre');
    }
}