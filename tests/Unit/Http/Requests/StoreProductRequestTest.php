<?php

namespace Tests\Unit\Http\Requests;

use App\Http\Requests\StoreProductRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class StoreProductRequestTest extends TestCase
{
    use RefreshDatabase;

    private array $validData;
    private array $rules;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->rules = (new StoreProductRequest())->rules();
        $this->validData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 100.00,
            'quantity' => 10,
            'category' => 'Test Category',
            'sku' => 'TEST-SKU-123',
        ];
    }

    #[Test]
    public function it_passes_with_valid_data()
    {
        $validator = Validator::make($this->validData, $this->rules);
        
        $this->assertTrue($validator->passes());
    }

    #[Test]
    #[DataProvider('requiredFieldsProvider')]
    public function it_requires_fields($field)
    {
        $data = $this->validData;
        unset($data[$field]);
        
        $validator = Validator::make($data, $this->rules);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey($field, $validator->errors()->toArray());
    }

    public static function requiredFieldsProvider()
    {
        return [
            'name is required' => ['name'],
            'price is required' => ['price'],
            'quantity is required' => ['quantity']
        ];
    }

    #[Test]
    #[DataProvider('invalidDataTypesProvider')]
    public function it_validates_data_types($field, $value, $expectedError)
    {
        $data = $this->validData;
        $data[$field] = $value;
        
        $validator = Validator::make($data, $this->rules);
        
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey($field, $validator->errors()->toArray());
    }

    public static function invalidDataTypesProvider()
    {
        return [
            'price must be numeric' => ['price', 'not-a-number', 'numeric'],
            'price must be at least zero' => ['price', -10.00, 'min'],
            'quantity must be an integer' => ['quantity', 'not-an-integer', 'integer'],
            'quantity must be at least zero' => ['quantity', -5, 'min'],
        ];
    }

    #[Test]
    public function it_allows_optional_fields_to_be_null()
    {
        $data = array_merge($this->validData, [
            'description' => null,
            'category' => null,
            'sku' => null,
        ]);
        
        $validator = Validator::make($data, $this->rules);
        
        $this->assertTrue($validator->passes());
    }
}
