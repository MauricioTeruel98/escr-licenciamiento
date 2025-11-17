<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActions;
class EvaluationQuestion extends Model
{
    use LogsActions;

    protected $fillable = [
        'question',
        'is_binary',
        'deleted',
        'deleted_at'
    ];

    protected $casts = [
        'is_binary' => 'boolean',
        'deleted' => 'boolean'
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }
} 