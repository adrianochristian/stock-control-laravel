<?php

namespace App\Models;

use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    use HasFactory;
    
    protected $fillable = [
        'name',
        'description',
        'quantity',
        'price',
        'category',
        'sku',
    ];

    protected $casts = [
        'price' => Money::class,
        'quantity' => 'integer',
    ];
}
