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

    // Método helper para obtener el nombre legible del tipo
    public function getTipoNombreAttribute()
    {
        return self::TIPOS[$this->tipo] ?? $this->tipo;
    }

    // Método helper para obtener el nombre legible de la categoría
    public function getCategoriaNombreAttribute()
    {
        return self::CATEGORIAS[$this->categoria] ?? $this->categoria;
    }
}