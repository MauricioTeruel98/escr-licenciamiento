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
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'minimum_score' => 'integer'
    ];

    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->orderBy('order', 'desc');
    }

    public function requisitos(): HasMany
    {
        return $this->hasMany(Requisitos::class);
    }
} 