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
        'canton',
        'distrito',
        'commercial_activity',
        'phone',
        'mobile',
        'is_exporter',
        'authorized',
        'autoeval_ended',
        'estado_eval',
        'authorized_by_super_admin',
        'old_id',
        'fecha_calificacion_evaluador',
        'auto_evaluation_document_path',
        'evaluation_document_path',
        'fecha_inicio_auto_evaluacion',
        'fecha_inicio_evaluacion',
        'puntos_fuertes',
        'justificacion',
        'oportunidades',
        'tiene_multi_sitio',
        'cantidad_multi_sitio',
        'aprobo_evaluacion_multi_sitio'
    ];

    protected $casts = [
        'is_exporter' => 'boolean',
        'autoeval_ended' => 'boolean',
        'fecha_calificacion_evaluador' => 'datetime',
        'fecha_inicio_auto_evaluacion' => 'datetime',
        'fecha_inicio_evaluacion' => 'datetime',
        'puntos_fuertes' => 'string',
        'justificacion' => 'string',
        'oportunidades' => 'string',
        'tiene_multi_sitio' => 'integer',
        'cantidad_multi_sitio' => 'integer',
        'aprobo_evaluacion_multi_sitio' => 'integer'
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

    public function autoEvaluationValorResults()
    {
        return $this->hasMany(AutoEvaluationValorResult::class);
    }

    public function evaluationValueResults()
    {
        return $this->hasMany(EvaluationValueResult::class);
    }

    public function evaluationValueResultReferences()
    {
        return $this->hasMany(EvaluationValueResultReference::class);
    }

    public function indicatorAnswers()
    {
        return $this->hasMany(\App\Models\IndicatorAnswer::class);
    }

    public function indicatorAnswersEvaluation()
    {
        return $this->hasMany(\App\Models\IndicatorAnswerEvaluation::class);
    }

    /**
     * Obtiene el estado formateado para mostrar en la interfaz
     */
    public function getFormattedStateAttribute()
    {
        switch ($this->estado_eval) {
            case 'auto-evaluacion':
                return 'Autoevaluación';
            case 'auto-evaluacion-completed':
                return 'Autoevaluación Completada';
            case 'evaluacion-pendiente':
                return 'Evaluación Pendiente';
            case 'evaluacion':
                return 'Evaluación';
            case 'evaluacion-completada':
                return 'Evaluación Completada';
            case 'evaluado':
                return 'Evaluado';
            case 'evaluacion-calificada':
                return 'Evaluación Calificada';
            case 'evaluacion-desaprobada':
                return 'Evaluación Desaprobada';
            default:
                return 'No aplica';
        }
    }

    public function evaluators()
    {
        return $this->belongsToMany(User::class, 'company_evaluator', 'company_id', 'user_id')
                    ->select(['users.id', 'users.name', 'users.email']);
    }
} 