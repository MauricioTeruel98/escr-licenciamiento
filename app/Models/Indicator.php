<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Indicator extends Model
{
    protected $fillable = [
        'name',
        'binding',
        'self_evaluation_question',
        'value_id',
        'subcategory_id',
        'requisito_id',
        'evaluation_questions',
        'guide',
        'is_active',
        'is_binary',
        'deleted',
        'deleted_at'
    ];

    protected $guarded = ['homologation_id'];

    protected $casts = [
        'binding' => 'boolean',
        'is_active' => 'boolean',
        'evaluation_questions' => 'array',
        'is_binary' => 'boolean',
        'deleted' => 'boolean'
    ];

    /**
     * Scope global para filtrar indicadores basados en la fecha de inicio de auto-evaluación
     */
    /*protected static function booted()
    {
        static::addGlobalScope('auto_evaluation_date', function ($query) {
            $company = Auth::user()?->company;
            if ($company && $company->fecha_inicio_auto_evaluacion) {
                $query->where(function ($q) use ($company) {
                    $q->whereNull('created_at')
                        ->orWhere('created_at', '<=', $company->fecha_inicio_auto_evaluacion);
                });
            }
        });
    }*/

    public function homologation(): BelongsTo
    {
        return $this->belongsTo(AvailableCertification::class, 'homologation_id');
    }

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function requisito(): BelongsTo
    {
        return $this->belongsTo(Requisitos::class);
    }

    public function getFormattedQuestionsAttribute(): array
    {
        return is_array($this->evaluation_questions) 
            ? $this->evaluation_questions 
            : json_decode($this->evaluation_questions, true) ?? [];
    }

    public function homologations(): BelongsToMany
    {
        return $this->belongsToMany(AvailableCertification::class, 'indicator_homologation', 'indicator_id', 'homologation_id');
    }

    public function evaluationQuestions()
    {
        return $this->hasMany(EvaluationQuestion::class)->where('deleted', false);
    }

    public function indicatorAnswers()
    {
        return $this->hasMany(IndicatorAnswer::class);
    }
} 