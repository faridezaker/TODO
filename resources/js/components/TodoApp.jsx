import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const FILTERS = ['all', 'active', 'done'];

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [pendingDelete, setPendingDelete] = useState(null);

    useEffect(() => { fetchTodos(); }, []);

    async function fetchTodos() {
        try {
            setLoading(true);
            const response = await axios.get('/api/todos');
            setTodos(response.data.data);
        } catch {
            setError('Failed to load todos. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(data) {
        const response = await axios.post('/api/todos', data);
        setTodos(prev => [response.data.data, ...prev]);
    }

    async function handleUpdate(id, data) {
        const response = await axios.put(`/api/todos/${id}`, data);
        setTodos(prev => prev.map(t => t.id === id ? response.data.data : t));
    }

    async function handleToggle(todo) {
        const response = await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed });
        setTodos(prev => prev.map(t => t.id === todo.id ? response.data.data : t));
    }

    function handleDelete(id) {
        if (pendingDelete) {
            clearTimeout(pendingDelete.timeoutId);
            axios.delete(`/api/todos/${pendingDelete.todo.id}`).catch(console.error);
        }
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        setTodos(prev => prev.filter(t => t.id !== id));
        const timeoutId = setTimeout(() => {
            axios.delete(`/api/todos/${id}`).catch(console.error);
            setPendingDelete(null);
        }, 5000);
        setPendingDelete({ todo, timeoutId });
    }

    function handleUndoDelete() {
        if (!pendingDelete) return;
        clearTimeout(pendingDelete.timeoutId);
        const { todo } = pendingDelete;
        setTodos(prev => [...prev, todo].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
        setPendingDelete(null);
    }

    function handleReorder(newPendingIds) {
        setTodos(prev => {
            const done       = prev.filter(t => t.completed);
            const pendingMap = new Map(prev.filter(t => !t.completed).map(t => [t.id, t]));
            const newPending = newPendingIds.map(id => pendingMap.get(id)).filter(Boolean);
            return [...newPending, ...done];
        });
        axios.put('/api/todos/reorder', { ids: newPendingIds }).catch(console.error);
    }

    const completedCount = todos.filter(t => t.completed).length;
    const activeCount    = todos.filter(t => !t.completed).length;
    const progress       = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'done')   return t.completed;
        return true;
    });

    return (
        <>
            {/* Aurora Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div className="aurora-blob animate-drift-a"
                    style={{ width: 'min(65vw,720px)', height: 'min(65vw,720px)', top: '-18%', left: '-12%', opacity: 0.55, background: 'radial-gradient(circle, #c4b5fd, transparent 70%)' }} />
                <div className="aurora-blob animate-drift-b"
                    style={{ width: 'min(55vw,640px)', height: 'min(55vw,640px)', top: '20%', right: '-14%', opacity: 0.45, background: 'radial-gradient(circle, #fbcfe8, transparent 70%)' }} />
                <div className="aurora-blob animate-drift-c"
                    style={{ width: 'min(45vw,520px)', height: 'min(45vw,520px)', bottom: '-10%', left: '25%', opacity: 0.4, background: 'radial-gradient(circle, #bfdbfe, transparent 70%)' }} />
                <div className="aurora-blob animate-drift-d"
                    style={{ width: 'min(38vw,440px)', height: 'min(38vw,440px)', top: '45%', left: '45%', opacity: 0.35, background: 'radial-gradient(circle, #ddd6fe, transparent 70%)' }} />
            </div>
            <div className="dot-grid" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

            {/* Page */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingBottom: '4rem' }}>

                {/* Nav */}
                <nav className="animate-nav-drop" style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 1.5rem', height: 62,
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderBottom: '1px solid rgba(139,92,246,0.12)',
                    marginBottom: '3rem',
                    boxShadow: '0 1px 20px rgba(139,92,246,0.08)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', color: '#fff', flexShrink: 0,
                        }}>✓</div>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2e1065', letterSpacing: '-0.02em' }}>
                            My Todos
                        </span>
                    </div>

                    {todos.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 90, height: 3, borderRadius: 100, background: 'rgba(139,92,246,0.15)', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                                    borderRadius: 100,
                                    transition: 'width 0.5s cubic-bezier(.22,1,.36,1)',
                                }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(46,16,101,0.5)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                                {completedCount}/{todos.length}
                            </span>
                        </div>
                    )}
                </nav>

                {/* Content */}
                <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 1rem' }}>

                    {/* Heading */}
                    <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem,6vw,3rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.1,
                            background: 'linear-gradient(130deg, #7c3aed 0%, #a855f7 52%, #ec4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.5rem',
                        }}>
                            Stay Focused.
                        </h1>
                        <p style={{ color: 'rgba(46,16,101,0.5)', fontSize: '0.9375rem', fontWeight: 400 }}>
                            {todos.length === 0
                                ? 'Add your first task below to get started.'
                                : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
                        </p>
                    </div>

                    {/* Filter tabs */}
                    {todos.length > 0 && (
                        <div className="animate-fade-up" style={{ animationDelay: '0.05s', display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
                            {FILTERS.map(f => {
                                const count = f === 'active' ? activeCount : f === 'done' ? completedCount : todos.length;
                                const isActive = filter === f;
                                return (
                                    <button key={f} onClick={() => setFilter(f)} style={{
                                        padding: '0.38rem 1rem',
                                        borderRadius: 100,
                                        border: isActive ? '1px solid transparent' : '1px solid rgba(139,92,246,0.18)',
                                        background: isActive ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.6)',
                                        color: isActive ? '#fff' : 'rgba(46,16,101,0.55)',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: 'DM Sans, sans-serif',
                                        transition: 'all 0.2s',
                                        boxShadow: isActive ? '0 2px 12px rgba(124,58,237,0.28)' : 'none',
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    }}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                        <span style={{
                                            background: isActive ? 'rgba(255,255,255,0.22)' : 'rgba(139,92,246,0.1)',
                                            borderRadius: 100, padding: '0 0.38rem',
                                            fontSize: '0.72rem', fontWeight: 700,
                                        }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Form card */}
                    <div className="animate-fade-up" style={{ animationDelay: '0.1s', marginBottom: '1.2rem' }}>
                        <GlassCard accentColor="rgba(139,92,246,0.4)">
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '1rem' }}>
                                +  New Task
                            </p>
                            <TodoForm onSubmit={handleCreate} />
                        </GlassCard>
                    </div>

                    {/* List card */}
                    <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <GlassCard accentColor="rgba(168,85,247,0.35)">
                            {loading && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0', gap: '0.75rem' }}>
                                    <div className="animate-spin-smooth"
                                        style={{ width: 22, height: 22, border: '2.5px solid rgba(139,92,246,0.15)', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
                                    <span style={{ color: 'rgba(46,16,101,0.45)', fontSize: '0.875rem' }}>Loading…</span>
                                </div>
                            )}
                            {error && (
                                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                                    <div style={{ fontSize: '1.75rem', marginBottom: '0.6rem', opacity: 0.6 }}>⚠️</div>
                                    <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
                                </div>
                            )}
                            {!loading && !error && (
                                <TodoList
                                    todos={filteredTodos}
                                    onToggle={handleToggle}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                    onReorder={handleReorder}
                                />
                            )}
                        </GlassCard>
                    </div>
                </div>
            </div>
            {/* Delete undo toast */}
            {pendingDelete && (
                <DeleteToast
                    key={pendingDelete.todo.id}
                    todo={pendingDelete.todo}
                    onUndo={handleUndoDelete}
                />
            )}
        </>
    );
}

function DeleteToast({ todo, onUndo }) {
    return (
        <div style={{
            position: 'fixed', bottom: '1.5rem', left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            zIndex: 200, pointerEvents: 'none',
        }}>
            <div className="toast-enter" style={{
                pointerEvents: 'auto',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(139,92,246,0.18)',
                borderRadius: 14,
                boxShadow: '0 8px 32px rgba(139,92,246,0.16)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.75rem 0.7rem 1rem',
                minWidth: 260, maxWidth: 360,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Icon */}
                <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1e1b4b', marginBottom: '0.1rem' }}>
                        Task deleted
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(46,16,101,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {todo.title}
                    </p>
                </div>

                {/* Undo button */}
                <button
                    onClick={onUndo}
                    style={{
                        flexShrink: 0,
                        padding: '0.32rem 0.85rem',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        fontFamily: 'DM Sans, sans-serif',
                        cursor: 'pointer',
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    Undo
                </button>

                {/* 5s drain bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(139,92,246,0.08)' }}>
                    <div className="toast-drain" style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                        borderRadius: 3,
                    }} />
                </div>
            </div>
        </div>
    );
}

function GlassCard({ children, accentColor = 'rgba(139,92,246,0.35)' }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.9)',
            borderRadius: 18,
            padding: '1.5rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(139,92,246,0.08), 0 1px 4px rgba(139,92,246,0.05)',
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                pointerEvents: 'none',
            }} />
            {children}
        </div>
    );
}
