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
        'provincia',
        'commercial_activity',
        'phone',
        'mobile',
        'is_exporter',
        'authorized'
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

    public function infoAdicional()
    {
        return $this->hasOne(InfoAdicionalEmpresa::class);
    }

    public function autoEvaluationResult()
    {
        return $this->hasOne(AutoEvaluationResult::class);
    }

    public function indicatorAnswers()
    {
        return $this->hasMany(\App\Models\IndicatorAnswer::class);
    }

    public function indicatorAnswersEvaluation()
    {
        return $this->hasMany(\App\Models\IndicatorAnswerEvaluation::class);
    }
} 