<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicatorAnswer extends Model
{
    protected $fillable = [
        'user_id',
        'company_id',
        'indicator_id',
        'answer',
        'is_binding',
        'justification'
    ];

    protected $casts = [
        'answer' => 'string',
        'is_binding' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class);
    }
} 