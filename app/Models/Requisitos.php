<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Requisitos extends Model
{
    protected $fillable = [
        'name',
        'description',
        'value_id',
        'subcategory_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }
} 