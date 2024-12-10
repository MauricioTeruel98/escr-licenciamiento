<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoEvaluationSubcategoryResult extends Model
{
    protected $table = 'auto_evaluation_subcategory_result';

    protected $fillable = [
        'company_id',
        'value_id',
        'subcategory_id',
        'nota',
        'fecha_evaluacion'
    ];

    protected $casts = [
        'fecha_evaluacion' => 'datetime',
        'nota' => 'integer'
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