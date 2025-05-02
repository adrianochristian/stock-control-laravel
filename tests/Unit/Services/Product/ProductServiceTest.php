<?php

namespace Tests\Unit\Services\Product;

use App\Models\Product;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Services\Product\ProductService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductServiceTest extends TestCase
{
    protected ProductService $productService;
    protected MockInterface $productRepository;
    protected Product $product;
    protected array $productAttributes;

    protected function setUp(): void
    {
        parent::setUp();

        $this->productRepository = Mockery::mock(ProductRepositoryInterface::class);

        $this->productService = new ProductService($this->productRepository);
        
        $this->productAttributes = [
            'id' => 1,
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'quantity' => 10,
            'category' => 'Test Category',
            'sku' => 'TEST-SKU-123',
        ];
        
        $this->product = new Product($this->productAttributes);
    }

    #[Test]
    public function it_gets_all_products()
    {
        // Arrange
        $paginatedProducts = Mockery::mock('Illuminate\Contracts\Pagination\LengthAwarePaginator');
        $paginatedProducts->shouldReceive('items')->andReturn([$this->product]);
        $this->productRepository->shouldReceive('paginate')->once()->andReturn($paginatedProducts);
        
        // Act
        $result = $this->productService->listAll();
        
        // Assert
        $this->assertInstanceOf('Illuminate\Contracts\Pagination\LengthAwarePaginator', $result);
        $items = $result->items();
        $this->assertCount(1, $items);
        $this->assertEquals($this->productAttributes['name'], $items[0]->name);
    }

    #[Test]
    public function it_gets_product_by_id()
    {
        // Arrange
        $id = $this->productAttributes['id'];
        $this->productRepository->shouldReceive('find')->with($id)->once()->andReturn($this->product);
        
        // Act
        $result = $this->productService->findById($id);
        
        // Assert
        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals($this->productAttributes['name'], $result->name);
    }

    #[Test]
    public function it_creates_a_product()
    {
        // Arrange
        $productData = [
            'name' => 'New Product',
            'description' => 'New Description',
            'price' => 200.00,
            'quantity' => 20,
            'category' => 'New Category',
            'sku' => 'NEW-SKU-456',
        ];
        
        $newProduct = new Product($productData);
        $this->productRepository->shouldReceive('create')
            ->with($productData)
            ->once()
            ->andReturn($newProduct);
        
        // Act
        $result = $this->productService->create($productData);
        
        // Assert
        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals($productData['name'], $result->name);
        $this->assertEquals($productData['sku'], $result->sku);
    }

    #[Test]
    public function it_updates_a_product()
    {
        // Arrange
        $product = new Product($this->productAttributes);
        $product->id = $this->productAttributes['id'];
        
        $productData = [
            'name' => 'Updated Product',
            'price' => 15000,
        ];
        
        $updatedProduct = new Product(array_merge(['id' => $product->id], $productData));
        $this->productRepository->shouldReceive('update')
            ->with($product->id, $productData)
            ->once()
            ->andReturn($updatedProduct);
        
        // Act
        $result = $this->productService->update($product, $productData);
        
        // Assert
        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals($productData['name'], $result->name);
        $this->assertEquals($productData['price'], $result->price->getCents());
    }

    #[Test]
    public function it_deletes_a_product()
    {
        // Arrange
        $product = new Product($this->productAttributes);
        $product->id = $this->productAttributes['id'];
        
        $this->productRepository->shouldReceive('delete')
            ->with($product->id)
            ->once()
            ->andReturn(true);
        
        // Act
        $result = $this->productService->delete($product);
        
        // Assert
        $this->assertTrue($result);
    }

    #[Test]
    public function it_gets_product_deteils_by_sky()
    {
        // Arrange
        $sku = $this->productAttributes['sku'];
        $this->productRepository->shouldReceive('findBySku')
            ->with($sku)
            ->once()
            ->andReturn($this->product);
        
        // Act
        $result = $this->productService->getProductDetailsBySku($sku);
        
        // Assert
        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals($sku, $result->sku);
    }

    #[Test]
    public function it_gets_products_by_category()
    {
        // Arrange
        $category = $this->productAttributes['category'];
        $products = new Collection([$this->product]);
        $this->productRepository->shouldReceive('getByCategory')
            ->with($category)
            ->once()
            ->andReturn($products);
        
        // Act
        $result = $this->productService->getProductsByCategory($category);
        
        // Assert
        $this->assertInstanceOf(Collection::class, $result);
        $this->assertCount(1, $result);
        $this->assertEquals($category, $result->first()->category);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}