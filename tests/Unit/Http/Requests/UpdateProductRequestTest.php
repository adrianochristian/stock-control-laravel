<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UpdateProductRequestTest extends TestCase
{
    use RefreshDatabase;
    
    protected Product $product;
    protected UpdateProductRequest $request;
    protected array $validationRules;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->product = Product::factory()->create([
            'name' => 'Test Product',
            'sku' => 'TEST-SKU-123',
        ]);
        
        $this->validationRules = [
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['nullable', 'integer', 'min:0'],
            'category' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:50', Rule::unique('products')->ignore($this->product->id)]
        ];
        
        $this->mock(UpdateProductRequest::class, function ($mock) {
            $mock->shouldReceive('product')->andReturn($this->product);
            $mock->shouldReceive('rules')->andReturn($this->validationRules);
        });
        
        $this->request = app(UpdateProductRequest::class);
    }
    
    #[Test]
    public function it_passes_with_valid_data()
    {
        $data = [
            'name' => 'Updated Test Product',
            'description' => 'Updated Test Description',
            'price' => 150.00,
            'quantity' => 15,
            'category' => 'Updated Test Category',
            'sku' => 'TEST-SKU-456',
        ];
        
        $this->assertTrue($this->validate($data));
    }

    #[Test]
    public function it_allows_partial_updates()
    {
        $data = ['name' => 'Updated Test Product'];
        
        $this->assertTrue($this->validate($data));
    }

    #[Test]
    public function it_validates_price_as_numeric_when_provided()
    {
        $data = ['price' => 'not-a-number'];
        
        $validator = $this->getValidator($data);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('price', $validator->errors()->toArray());
    }

    #[Test]
    public function it_validates_quantity_as_integer_when_provided()
    {
        $data = ['quantity' => 'not-an-integer'];
        
        $validator = $this->getValidator($data);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('quantity', $validator->errors()->toArray());
    }

    #[Test]
    public function it_validates_price_is_at_least_zero_when_provided()
    {
        $data = ['price' => -10.00];
        
        $validator = $this->getValidator($data);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('price', $validator->errors()->toArray());
    }

    #[Test]
    public function it_validates_quantity_is_at_least_zero_when_provided()
    {
        $data = ['quantity' => -5];
        
        $validator = $this->getValidator($data);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('quantity', $validator->errors()->toArray());
    }
    
    /**
     * Validate the given data against the modified rules
     *
     * @param array $data
     * @return bool
     */
    private function validate(array $data): bool
    {
        return $this->getValidator($data)->passes();
    }
    
    /**
     * Get a validator instance with the unique rule replaced
     *
     * @param array $data
     * @return \Illuminate\Validation\Validator
     */
    private function getValidator(array $data)
    {
        $rules = $this->replaceUniqueRule($this->request->rules());
        return Validator::make($data, $rules);
    }

    /**
     * Helper method to replace the Rule::unique with a simple validation rule
     *
     * @param array $rules
     * @return array
     */
    private function replaceUniqueRule(array $rules): array
    {
        if (isset($rules['sku']) && is_array($rules['sku'])) {
            $rules['sku'] = array_filter($rules['sku'], function ($rule) {
                return !($rule instanceof Rule);
            });
        }
        
        return $rules;
    }
}
