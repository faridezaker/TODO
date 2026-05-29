<?php

namespace App\Http\Requests\Todo;

use Illuminate\Foundation\Http\FormRequest;

class StoreTodoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'completed'   => ['sometimes', 'boolean'],
            'priority'    => ['sometimes', 'in:low,medium,high'],
            'due_date'    => ['sometimes', 'nullable', 'date'],
        ];
    }
}
