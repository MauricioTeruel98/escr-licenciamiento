<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_id',
        'name',
        'website',
        'sector',
        'city',
        'commercial_activity',
        'phone',
        'mobile',
        'is_exporter'
    ];

    protected $casts = [
        'is_exporter' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
} 