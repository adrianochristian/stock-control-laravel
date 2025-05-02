<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verificação de autorização usando políticas
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255', 'regex:/^[\p{L}\p{N}\s\-_.,:;()]+$/u'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'quantity' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ];

        // Para atualização parcial (PATCH), tornamos as regras opcionais
        if ($this->isMethod('patch')) {
            $rules = collect($rules)->map(function ($rule) {
                return array_diff($rule, ['required']);
            })->toArray();
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.regex' => 'O nome contém caracteres não permitidos.',
            'price.min' => 'O preço não pode ser negativo.',
            'quantity.min' => 'A quantidade não pode ser negativa.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Remover espaços extras e conversão de tipos para evitar type confusion
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }

        if ($this->has('price')) {
            $this->merge([
                'price' => (float) $this->price,
            ]);
        }

        if ($this->has('quantity')) {
            $this->merge([
                'quantity' => (int) $this->quantity,
            ]);
        }
    }
}
