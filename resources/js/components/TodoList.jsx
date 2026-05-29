import React from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoItem from './TodoItem';

function SortableTodoItem({ todo, onToggle, onUpdate, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.45 : 1,
                zIndex: isDragging ? 10 : 'auto',
                position: 'relative',
            }}
        >
            <TodoItem
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

export default function TodoList({ todos, onToggle, onUpdate, onDelete, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    if (todos.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.9rem', opacity: 0.3 }}>☑</div>
                <p style={{ color: 'rgba(46,16,101,0.45)', fontSize: '0.9375rem', fontWeight: 500, marginBottom: '0.3rem' }}>
                    No tasks here
                </p>
                <p style={{ color: 'rgba(46,16,101,0.3)', fontSize: '0.8125rem' }}>
                    Add one above to get started
                </p>
            </div>
        );
    }

    const pending = todos.filter(t => !t.completed);
    const done    = todos.filter(t => t.completed);

    function handleDragEnd({ active, over }) {
        if (!over || active.id === over.id) return;
        const oldIndex = pending.findIndex(t => t.id === active.id);
        const newIndex = pending.findIndex(t => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = arrayMove(pending, oldIndex, newIndex);
        onReorder(reordered.map(t => t.id));
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pending.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {pending.map(todo => (
                        <SortableTodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={onToggle}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {done.length > 0 && (
                <>
                    {pending.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.12)' }} />
                            <span style={{
                                fontSize: '0.68rem', fontWeight: 700,
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                color: 'rgba(46,16,101,0.35)',
                            }}>
                                Completed · {done.length}
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(139,92,246,0.12)' }} />
                        </div>
                    )}
                    {done.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
                    ))}
                </>
            )}
        </div>
    );
}
