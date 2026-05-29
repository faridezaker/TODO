<?php

namespace App\Repositories;

use App\Models\Todo;
use App\Repositories\Contracts\TodoRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class TodoRepository implements TodoRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Todo::orderBy('order')->paginate($perPage);
    }

    public function findOrFail(int $id): Todo
    {
        return Todo::findOrFail($id);
    }

    public function create(array $data): Todo
    {
        Todo::query()->increment('order');
        return Todo::create(array_merge($data, ['order' => 0]))->refresh();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $position => $id) {
            Todo::where('id', $id)->update(['order' => $position]);
        }
    }

    public function update(Todo $todo, array $data): Todo
    {
        $todo->update($data);

        return $todo->refresh();
    }

    public function delete(Todo $todo): void
    {
        $todo->delete();
    }
}
