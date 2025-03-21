<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subcategory extends Model
{
    protected $fillable = [
        'name',
        'description',
        'value_id',
        'is_active',
        'order',
        'deleted',
        'deleted_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
        'deleted' => 'boolean'
    ];

    public function value(): BelongsTo
    {
        return $this->belongsTo(Value::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }
} 