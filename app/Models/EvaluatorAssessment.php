<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluatorAssessment extends Model
{
    protected $fillable = [
        'company_id',
        'user_id',
        'evaluation_question_id',
        'indicator_id',
        'approved',
        'comment'
    ];

    protected $casts = [
        'approved' => 'boolean',
    ];
    
    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class);
    }
    
    public function evaluationQuestion(): BelongsTo
    {
        return $this->belongsTo(EvaluationQuestion::class);
    }
    
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}