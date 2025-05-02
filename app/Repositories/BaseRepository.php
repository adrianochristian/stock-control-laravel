<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findBy(string $column, $value): ?Model
    {
        return $this->model->where($column, $value)->first();
    }

    public function findByWith(string $column, $value, array $relations): ?Model
    {
        return $this->model->with($relations)->where($column, $value)->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): ?Model
    {
        $record = $this->find($id);

        if ($record) {
            $record->update($data);

            return $record;
        }

        return null;
    }

    public function delete(int $id): bool
    {
        $record = $this->find($id);
        
        if ($record) {
            return (bool) $record->delete();
        }

        return false;
    }
}
