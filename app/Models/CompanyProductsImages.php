<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyProductsImages extends Model
{
    use HasFactory;

    protected $table = 'products_images';

    protected $fillable = [
        'company_product_id',
        'image_path',
    ];

    public function companyProduct()
    {
        return $this->belongsTo(CompanyProducts::class, 'company_product_id');
    }
}