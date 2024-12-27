<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}