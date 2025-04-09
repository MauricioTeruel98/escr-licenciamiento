<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluationValueResultReference extends Model
{
    protected $table = 'evaluation_value_result_reference';

    protected $fillable = [
        'company_id',
        'value_id',
        'value_completed',
        'fecha_completado',
        'progress'
    ];

    protected $casts = [
        'fecha_completado' => 'datetime',
        'value_completed' => 'boolean',
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
} 