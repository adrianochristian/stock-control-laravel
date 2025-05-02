<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Repositories\Product\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Collection;

class ProductService implements ProductServiceInterface
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function listAll(array $filters = [], int $perPage = 3): LengthAwarePaginator
    {
        return $this->productRepository->paginate($filters, $perPage);
    }

    public function findById(int $id): Product
    {
        $product = $this->productRepository->find($id);

        if (! $product) {
            throw new HttpResponseException(response()->json([
                'message' => 'Produto não encontrado.',
            ], 404));
        }

        return $product;
    }

    public function create(array $data): Product
    {
        return $this->productRepository->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        return $this->productRepository->update($product->id, $data);
    }

    public function delete(Product $product): bool
    {
        return $this->productRepository->delete($product->id);
    }

    public function getProductDetailsBySku(string $sku): ?Product
    {
        return $this->productRepository->findBySku($sku);
    }

    public function getProductsByCategory(string $category): Collection
    {
        return $this->productRepository->getByCategory($category);
    }
}
