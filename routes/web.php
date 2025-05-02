<?php

use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', fn () => Inertia::render('login'))->name('login');
Route::get('/', fn () => redirect()->route('products.index'));

Route::prefix('products')->group(function () {
    Route::get('/', fn () => Inertia::render('products'))->name('products.index');
    Route::get('/create', fn () => Inertia::render('create-product'))->name('products.create');

    Route::get('/edit/{product}', function (Product $product) {
        return Inertia::render('edit-product', [
            'product' => ProductResource::make($product),
        ]);
    })->name('products.edit');
});
