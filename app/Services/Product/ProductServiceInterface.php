<?php

namespace App\Services\Product;

use App\Models\Product;
use Illuminate\Support\Collection;

interface ProductServiceInterface
{
    public function getProductDetailsBySku(string $sku): ?Product;

    public function getProductsByCategory(string $category): Collection;
}