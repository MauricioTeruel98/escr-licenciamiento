<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_id',
        'name',
        'website',
        'sector',
        'city',
        'commercial_activity',
        'phone',
        'mobile',
        'is_exporter'
    ];

    protected $casts = [
        'is_exporter' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Obtiene las certificaciones de la empresa
     */
    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    public function autoEvaluationStatus(): string
    {
        // Obtener el resultado más reciente de auto-evaluación
        $lastResult = $this->hasOne(AutoEvaluationResult::class)
            ->latest()
            ->first();

        if (!$lastResult) {
            return 'en_proceso';
        }

        return $lastResult->status ?? 'en_proceso';
    }

    // Agregar la relación con AutoEvaluationResult
    public function autoEvaluationResults()
    {
        return $this->hasMany(AutoEvaluationResult::class);
    }
} 