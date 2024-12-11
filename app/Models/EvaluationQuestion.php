<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationQuestion extends Model
{
    protected $fillable = ['indicator_id', 'question'];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
} 