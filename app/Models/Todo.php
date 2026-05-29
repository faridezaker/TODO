<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['title', 'description', 'completed', 'priority', 'due_date', 'order'];

    protected $casts = [
        'completed' => 'boolean',
        'due_date'  => 'date',
    ];
}
