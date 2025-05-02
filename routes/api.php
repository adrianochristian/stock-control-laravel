<?php

use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/login', LoginController::class);
        Route::post('/register', RegisterController::class);
    });

    Route::middleware(['auth:api'])->group(function () {
        Route::prefix('user')->controller(UserController::class)->middleware('throttle:60,1')->group(function () {
            Route::get('/{user}', 'show')->name('user.show');
            Route::get('/me/info', 'me')->name('user.me');
        });

        Route::prefix('products')->controller(ProductController::class)->middleware('throttle:60,1')->group(function () {
            Route::get('/', 'index')->name('products.index');
            Route::post('/', 'store')->name('products.store');
            Route::get('/{product}', 'show')->name('products.show');
            Route::match(['put', 'patch'],'/{product}', 'update')->name('products.update');
            Route::delete('/{product}', 'destroy')->name('products.destroy');
        });
    });
});

