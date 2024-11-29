<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subcategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'value_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }
} 