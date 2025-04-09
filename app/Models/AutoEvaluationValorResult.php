<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoEvaluationValorResult extends Model
{
    protected $table = 'auto_evaluation_valor_result';

    protected $fillable = [
        'company_id',
        'value_id',
        'nota',
        'fecha_evaluacion',
        'progress'
    ];

    protected $casts = [
        'fecha_evaluacion' => 'datetime',
        'nota' => 'integer',
        'progress' => 'integer'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }
} 