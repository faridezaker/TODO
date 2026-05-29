<?php

namespace App\Http\Requests\Todo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'completed'   => ['sometimes', 'boolean'],
            'priority'    => ['sometimes', 'in:low,medium,high'],
            'due_date'    => ['sometimes', 'nullable', 'date'],
        ];
    }
}
