<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndicatorHomologation extends Model
{

    protected $table = 'indicator_homologation';
    
    protected $fillable = [
        'indicator_id',
        'homologation_id'
    ];

    public function indicator()
    {
        return $this->belongsTo(Indicator::class);
    }

    public function availableCertification()
    {
        return $this->belongsTo(AvailableCertification::class, 'homologation_id');
    }
} 