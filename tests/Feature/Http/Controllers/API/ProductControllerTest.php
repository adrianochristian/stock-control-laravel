<?php

namespace Tests\Feature\Http\Controllers\API;

use App\Models\Product;
use App\Models\User;
use App\Enums\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected User $admin;
    protected User $operator;
    protected User $regularUser;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create users with different roles
        $this->admin = User::factory()->create(['role' => Role::ADMIN]);
        $this->operator = User::factory()->create(['role' => Role::OPERATOR]);
        $this->regularUser = User::factory()->create(['role' => Role::USER]);
        
        // Create a test product
        $this->product = Product::factory()->create([
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'quantity' => 10,
            'category' => 'Test Category',
            'sku' => 'TEST-SKU-123',
        ]);
    }

    #[Test]
    public function admin_can_get_all_products()
    {
        Passport::actingAs($this->admin);
        
        $response = $this->getJson('/api/v1/products');
        
        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.name', 'Test Product');
    }

    #[Test]
    public function regular_user_can_get_all_products()
    {
        Passport::actingAs($this->regularUser);
        
        $response = $this->getJson('/api/v1/products');
        
        $response->assertStatus(200);
    }

    #[Test]
    public function admin_can_get_a_single_product()
    {
        Passport::actingAs($this->admin);
        
        $response = $this->getJson("/api/v1/products/{$this->product->id}");
        
        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'Test Product')
                 ->assertJsonPath('data.sku', 'TEST-SKU-123');
    }

    #[Test]
    public function admin_can_create_a_product()
    {
        Passport::actingAs($this->admin);
        
        $productData = [
            'name' => 'New Product',
            'description' => 'New Description',
            'price' => 200.00,
            'quantity' => 20,
            'category' => 'New Category',
            'sku' => 'NEW-SKU-456',
        ];
        
        $response = $this->postJson('/api/v1/products', $productData);
        
        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'New Product')
                 ->assertJsonPath('data.sku', 'NEW-SKU-456');
                 
        $this->assertDatabaseHas('products', ['sku' => 'NEW-SKU-456']);
    }

    #[Test]
    public function operator_can_update_a_product()
    {
        Passport::actingAs($this->operator);
        
        $updatedData = [
            'name' => 'Updated Product',
            'price' => 150.00,
        ];
        
        $response = $this->patchJson("/api/v1/products/{$this->product->id}", $updatedData);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'Updated Product');
                 
        $this->assertDatabaseHas('products', ['name' => 'Updated Product']);
    }

    #[Test]
    public function regular_user_cannot_update_a_product()
    {
        Passport::actingAs($this->regularUser);
        
        $updatedData = [
            'name' => 'Updated By Regular User',
            'price' => 150.00,
        ];
        
        $response = $this->patchJson("/api/v1/products/{$this->product->id}", $updatedData);
        
        $response->assertStatus(403);
                 
        $this->assertDatabaseMissing('products', ['name' => 'Updated By Regular User']);
    }

    #[Test]
    public function admin_can_delete_a_product()
    {
        Passport::actingAs($this->admin);
        
        $response = $this->deleteJson("/api/v1/products/{$this->product->id}", [
            'product' => $this->product->toArray()
        ]);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('products', ['id' => $this->product->id]);
    }

    #[Test]
    public function create_product_validates_required_fields()
    {
        Passport::actingAs($this->admin);
        
        $response = $this->postJson('/api/v1/products', [
            // Missing required fields
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'price', 'quantity']);
    }

    #[Test]
    public function update_product_validates_fields()
    {
        Passport::actingAs($this->admin);
        
        $response = $this->patchJson("/api/v1/products/{$this->product->id}", [
            'price' => 'not-a-number',
            'quantity' => 'not-an-integer',
        ]);
        
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['price', 'quantity']);
    }
}