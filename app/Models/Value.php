<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Value extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'minimum_score',
        'is_active',
        'deleted',
        'deleted_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'minimum_score' => 'integer',
        'deleted' => 'boolean'
    ];

    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->orderBy('order', 'desc');
    }

    public function requisitos(): HasMany
    {
        return $this->hasMany(Requisitos::class);
    }

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }
} 