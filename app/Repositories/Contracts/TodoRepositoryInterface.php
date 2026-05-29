<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Todo;
use Illuminate\Pagination\LengthAwarePaginator;

interface TodoRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findOrFail(int $id): Todo;

    public function create(array $data): Todo;

    public function update(Todo $todo, array $data): Todo;

    public function delete(Todo $todo): void;

    public function reorder(array $orderedIds): void;
}
