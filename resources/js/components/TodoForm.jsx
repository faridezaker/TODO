import React, { useState, useRef, useEffect } from 'react';

const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 10,
    padding: '0.7rem 1rem',
    color: '#1e1b4b',
    fontSize: '0.9375rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function TodoForm({ initial = null, onSubmit, onCancel }) {
    const [title, setTitle]             = useState(initial?.title ?? '');
    const [description, setDescription] = useState(initial?.description ?? '');
    const [priority, setPriority]       = useState(initial?.priority ?? 'medium');
    const [dueDate, setDueDate]         = useState(initial?.due_date ?? '');
    const [submitting, setSubmitting]   = useState(false);
    const [errors, setErrors]           = useState({});
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    function onFocus(e) {
        e.target.style.borderColor = 'rgba(139,92,246,0.55)';
        e.target.style.boxShadow   = '0 0 0 3px rgba(139,92,246,0.1)';
    }
    function onBlur(e) {
        e.target.style.borderColor = 'rgba(139,92,246,0.2)';
        e.target.style.boxShadow   = 'none';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        if (!title.trim()) { setErrors({ title: 'Title is required.' }); return; }
        try {
            setSubmitting(true);
            await onSubmit({
                title:       title.trim(),
                description: description.trim() || null,
                priority,
                due_date:    dueDate || null,
            });
            if (!initial) { setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); }
        } catch (err) {
            console.error('Todo submit error:', err?.response?.status, err?.response?.data, err?.message);
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
                const flat = {};
                Object.entries(serverErrors).forEach(([k, v]) => { flat[k] = v[0]; });
                setErrors(flat);
            } else if (err?.response?.data?.message) {
                setErrors({ general: err.response.data.message });
            } else {
                setErrors({ general: `Something went wrong (${err?.response?.status ?? 'network error'}). Please try again.` });
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {errors.general && (
                <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '0.55rem 0.9rem', marginBottom: '0.85rem' }}>
                    <p style={{ color: '#dc2626', fontSize: '0.8125rem' }}>{errors.general}</p>
                </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: '0.7rem' }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    autoComplete="off"
                    style={{ ...inputBase, borderColor: errors.title ? 'rgba(220,38,38,0.4)' : 'rgba(139,92,246,0.2)' }}
                />
                {errors.title && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.3rem', paddingLeft: '0.2rem' }}>{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '0.7rem' }}>
                <textarea
                    placeholder="Add a note… (optional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    rows={2}
                    style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
                />
            </div>

            {/* Priority + Due date */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(46,16,101,0.45)', marginBottom: '0.3rem' }}>
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        style={{ ...inputBase, cursor: 'pointer' }}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(46,16,101,0.45)', marginBottom: '0.3rem' }}>
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        style={{ ...inputBase, colorScheme: 'light' }}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
                <SubmitButton submitting={submitting} isEdit={!!initial} />
                {onCancel && <CancelButton onClick={onCancel} />}
            </div>
        </form>
    );
}

function SubmitButton({ submitting, isEdit }) {
    return (
        <button
            type="submit"
            disabled={submitting}
            className="btn-shimmer"
            style={{
                flex: 1,
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 48%, #ec4899 100%)',
                opacity: submitting ? 0.7 : 1,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '0.72rem 1.2rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'transform 0.15s, box-shadow 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.38)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = submitting ? '' : 'translateY(-1px)'; }}
        >
            {submitting ? (
                <>
                    <span className="animate-spin-smooth"
                        style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                    Saving…
                </>
            ) : (
                isEdit ? 'Update Task' : 'Add Task'
            )}
        </button>
    );
}

function CancelButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                padding: '0.72rem 1.2rem',
                background: 'rgba(139,92,246,0.06)',
                border: '1px solid rgba(139,92,246,0.18)',
                borderRadius: 10,
                color: 'rgba(46,16,101,0.55)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.18s, color 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.color = '#2e1065'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.color = 'rgba(46,16,101,0.55)'; }}
        >
            Cancel
        </button>
    );
}
