<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutoEvaluationResult extends Model
{
    protected $table = 'auto_evaluation_result';

    protected $fillable = [
        'company_id',
        'nota',
        'status',
        'fecha_aprobacion',
        'form_sended'
    ];

    protected $casts = [
        'fecha_aprobacion' => 'datetime',
        'nota' => 'integer'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
} 