<?php

namespace App\Services;

use App\Models\Todo;
use App\Repositories\Contracts\TodoRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class TodoService
{
    public function __construct(
        private readonly TodoRepositoryInterface $repository
    ) {}

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage);
    }

    public function findById(int $id): Todo
    {
        return $this->repository->findOrFail($id);
    }

    public function create(array $data): Todo
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): Todo
    {
        $todo = $this->repository->findOrFail($id);

        return $this->repository->update($todo, $data);
    }

    public function delete(int $id): void
    {
        $todo = $this->repository->findOrFail($id);

        $this->repository->delete($todo);
    }

    public function reorder(array $orderedIds): void
    {
        $this->repository->reorder($orderedIds);
    }
}
