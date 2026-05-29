<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $todos = [
            ['title' => 'Buy groceries', 'description' => 'Milk, eggs, bread, and vegetables.', 'completed' => true],
            ['title' => 'Read a book', 'description' => 'Finish reading Clean Code.', 'completed' => false],
            ['title' => 'Write unit tests', 'description' => 'Cover the Todo service and repository layers.', 'completed' => false],
            ['title' => 'Fix login bug', 'description' => 'Users cannot log in when session expires mid-form.', 'completed' => true],
            ['title' => 'Update documentation', 'description' => null, 'completed' => false],
        ];

        foreach ($todos as $todo) {
            Todo::create($todo);
        }
    }
}
