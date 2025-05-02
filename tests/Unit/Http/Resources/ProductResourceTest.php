<?php

namespace Tests\Unit\Http\Resources;

use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use App\ValueObjects\Money;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductResourceTest extends TestCase
{
    use RefreshDatabase;
    
    #[Test]
    public function it_transforms_product_model_to_correct_api_format()
    {
        $now = now();
        
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 10000,                
            'quantity' => 10,
            'category' => 'Test Category',
            'sku' => 'TEST-SKU-123',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $resource = new ProductResource($product);
        
        $resourceArray = $resource->toArray(request());
        
        $this->assertEquals($product->id, $resourceArray['id']);
        $this->assertEquals('Test Product', $resourceArray['name']);
        $this->assertEquals('Test Description', $resourceArray['description']);
        $this->assertEquals(100.00, $resourceArray['price']);
        $this->assertEquals(10, $resourceArray['quantity']);
        $this->assertEquals('Test Category', $resourceArray['category']);
        $this->assertEquals('TEST-SKU-123', $resourceArray['sku']);
        $this->assertEquals($now->format('d/m/Y'), $resourceArray['created_at']->format('d/m/Y'));
        $this->assertEquals($now->format('d/m/Y'), $resourceArray['updated_at']->format('d/m/Y'));
    }
    
    #[Test]
    public function it_handles_null_fields_correctly()
    {
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'description' => null,
            'price' => 10000,
            'quantity' => 10,
            'category' => null,
            'sku' => 'TEST-SKU-123',
        ]);
        
        $resource = new ProductResource($product);

        $resourceArray = $resource->toArray(request());
        
        $this->assertEquals('Test Product', $resourceArray['name']);
        $this->assertNull($resourceArray['description']);
        $this->assertEquals(100.00, $resourceArray['price']);
        $this->assertNull($resourceArray['category']);
    }
}