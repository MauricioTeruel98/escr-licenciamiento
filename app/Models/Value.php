<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }
} 