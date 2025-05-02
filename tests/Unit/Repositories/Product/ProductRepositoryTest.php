<?php

namespace Tests\Unit\Repositories\Product;

use App\Models\Product;
use App\Repositories\Product\ProductRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private ProductRepository $productRepository;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->product = Product::factory()->create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'quantity' => 10,
            'category' => 'Test Category',
            'sku' => 'TEST-SKU-123',
        ]);
        
        $this->productRepository = new ProductRepository(new Product());
    }

    #[Test]
    public function it_can_find_a_product_by_sku()
    {
        $foundProduct = $this->productRepository->findBySku($this->product->sku);
        
        $this->assertInstanceOf(Product::class, $foundProduct);
        $this->assertEquals($this->product->id, $foundProduct->id);
        $this->assertEquals('TEST-SKU-123', $foundProduct->sku);
    }

    #[Test]
    public function it_returns_null_when_no_product_exists_with_given_sku()
    {
        $foundProduct = $this->productRepository->findBySku('NON-EXISTENT-SKU');
        
        $this->assertNull($foundProduct);
    }

    #[Test]
    public function it_can_get_products_by_category()
    {
        Product::factory()->create([
            'category' => 'Test Category',
        ]);
        
        $products = $this->productRepository->getByCategory('Test Category');
        
        $this->assertCount(2, $products);
        $this->assertEquals('Test Category', $products->first()->category);
    }

    #[Test]
    public function it_returns_empty_collection_when_no_products_exist_in_given_category()
    {
        $products = $this->productRepository->getByCategory('Non-Existent Category');
        
        $this->assertCount(0, $products);
        $this->assertEmpty($products);
    }

    #[Test]
    public function it_can_create_a_product()
    {
        $productData = [
            'name' => 'New Product',
            'description' => 'New Description',
            'price' => 20000,
            'quantity' => 20,
            'category' => 'New Category',
            'sku' => 'NEW-SKU-456',
        ];
        
        $createdProduct = $this->productRepository->create($productData);
        
        $this->assertInstanceOf(Product::class, $createdProduct);
        $this->assertEquals('New Product', $createdProduct->name);
        $this->assertEquals('New Description', $createdProduct->description);
        $this->assertEquals(200.00, $createdProduct->price->getAmount());
        $this->assertEquals(20, $createdProduct->quantity);
        $this->assertEquals('New Category', $createdProduct->category);
        $this->assertEquals('NEW-SKU-456', $createdProduct->sku);
        $this->assertDatabaseHas('products', ['sku' => 'NEW-SKU-456']);
    }

    #[Test]
    public function it_can_update_a_product()
    {
        $updatedData = [
            'name' => 'Updated Product',
            'price' => 15000,
        ];
        
        $updatedProduct = $this->productRepository->update($this->product->id, $updatedData);
        
        $this->assertInstanceOf(Product::class, $updatedProduct);
        $this->assertEquals('Updated Product', $updatedProduct->name);
        $this->assertEquals(150.00, $updatedProduct->price->getAmount());
        $this->assertDatabaseHas('products', ['name' => 'Updated Product']);
    }

    #[Test]
    public function it_can_delete_a_product()
    {
        $result = $this->productRepository->delete($this->product->id);
        
        $this->assertTrue($result);
        $this->assertDatabaseMissing('products', ['id' => $this->product->id]);
    }
}