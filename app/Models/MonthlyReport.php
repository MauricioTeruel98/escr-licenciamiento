<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlyReport extends Model
{
    protected $fillable = [
        'file_name',
        'file_path',
        'month',
        'year',
        'total_companies',
        'report_metadata'
    ];

    protected $casts = [
        'report_metadata' => 'array'
    ];

    public function getFullPathAttribute()
    {
        return storage_path('app/' . $this->file_path);
    }

    public function getDownloadUrlAttribute()
    {
        return route('reports.download', $this->id);
    }
} 