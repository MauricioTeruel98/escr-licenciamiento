<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyProducts extends Model
{
    use HasFactory;

    protected $table = 'company_products';

    protected $fillable = [
        'company_id',
        'info_adicional_empresa_id',
        'nombre',
        'descripcion',
        'imagen'
    ];

    public function infoAdicional()
    {
        return $this->belongsTo(InfoAdicionalEmpresa::class, 'info_adicional_empresa_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}