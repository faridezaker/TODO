<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\ReorderTodosRequest;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Services\TodoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TodoController extends Controller
{
    public function __construct(
        private readonly TodoService $service
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return TodoResource::collection($this->service->paginate());
    }

    public function store(StoreTodoRequest $request): TodoResource
    {
        $todo = $this->service->create($request->validated());

        return new TodoResource($todo);
    }

    public function show(int $id): TodoResource
    {
        return new TodoResource($this->service->findById($id));
    }

    public function update(UpdateTodoRequest $request, int $id): TodoResource
    {
        return new TodoResource($this->service->update($id, $request->validated()));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return response()->json(null, 204);
    }

    public function reorder(ReorderTodosRequest $request): JsonResponse
    {
        $this->service->reorder($request->validated()['ids']);

        return response()->json(null, 204);
    }
}
