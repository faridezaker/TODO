import React, { useState, useRef, useEffect } from 'react';

const PRIORITY_CONFIG = {
    high:   { label: 'High',   bg: 'rgba(220,38,38,0.08)',  color: '#b91c1c', border: 'rgba(220,38,38,0.2)'  },
    medium: { label: 'Medium', bg: 'rgba(217,119,6,0.08)',  color: '#b45309', border: 'rgba(217,119,6,0.2)'  },
    low:    { label: 'Low',    bg: 'rgba(22,163,74,0.08)',  color: '#15803d', border: 'rgba(22,163,74,0.2)'  },
};

const editFieldStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(139,92,246,0.22)',
    borderRadius: 8,
    padding: '0.42rem 0.7rem',
    color: '#1e1b4b',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.18s, box-shadow 0.18s',
};

function formatDate(str) {
    return new Date(str + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDueDateStatus(dueDateStr) {
    if (!dueDateStr) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due   = new Date(dueDateStr + 'T00:00:00');
    const diff  = Math.floor((due - today) / 86400000);
    if (diff < 0)  return { label: `Overdue · ${formatDate(dueDateStr)}`, color: '#dc2626', isOverdue: true };
    if (diff === 0) return { label: 'Due today',                           color: '#d97706', isOverdue: false };
    if (diff === 1) return { label: 'Due tomorrow',                        color: '#d97706', isOverdue: false };
    return          { label: `Due ${formatDate(dueDateStr)}`,              color: 'rgba(46,16,101,0.4)', isOverdue: false };
}

function onFieldFocus(e) {
    e.target.style.borderColor = 'rgba(139,92,246,0.5)';
    e.target.style.boxShadow   = '0 0 0 3px rgba(139,92,246,0.08)';
}
function onFieldBlur(e) {
    e.target.style.borderColor = 'rgba(139,92,246,0.22)';
    e.target.style.boxShadow   = 'none';
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete, dragHandleProps }) {
    const [deleting, setDeleting]       = useState(false);
    const [toggling, setToggling]       = useState(false);
    const [hovered, setHovered]         = useState(false);
    const [confirming, setConfirming]   = useState(false);
    const [editing, setEditing]         = useState(false);
    const [editTitle, setEditTitle]     = useState('');
    const [editDesc, setEditDesc]       = useState('');
    const [editPriority, setEditPriority] = useState('medium');
    const [editDueDate, setEditDueDate] = useState('');
    const [saving, setSaving]           = useState(false);
    const titleInputRef = useRef(null);

    useEffect(() => {
        if (editing) titleInputRef.current?.focus();
    }, [editing]);

    function startEdit() {
        setEditTitle(todo.title);
        setEditDesc(todo.description ?? '');
        setEditPriority(todo.priority ?? 'medium');
        setEditDueDate(todo.due_date ?? '');
        setConfirming(false);
        setEditing(true);
    }

    function cancelEdit() { setEditing(false); }

    async function saveEdit() {
        if (!editTitle.trim()) return;
        setSaving(true);
        try {
            await onUpdate(todo.id, {
                title:       editTitle.trim(),
                description: editDesc.trim() || null,
                priority:    editPriority,
                due_date:    editDueDate || null,
            });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    }

    function handleEditKeyDown(e) {
        if (e.key === 'Escape') cancelEdit();
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEdit();
    }

    async function handleToggle() {
        setToggling(true);
        try { await onToggle(todo); }
        finally { setToggling(false); }
    }

    async function handleDelete() {
        setDeleting(true);
        setConfirming(false);
        try { await onDelete(todo.id); }
        finally { setDeleting(false); }
    }

    const isComplete    = todo.completed;
    const priority      = PRIORITY_CONFIG[todo.priority] ?? PRIORITY_CONFIG.medium;
    const dueDateStatus = getDueDateStatus(todo.due_date);
    const isOverdue     = !isComplete && dueDateStatus?.isOverdue;

    let borderColor, bgColor;
    if (editing) {
        borderColor = 'rgba(139,92,246,0.35)';
        bgColor     = 'rgba(255,255,255,0.85)';
    } else if (isComplete) {
        borderColor = 'rgba(139,92,246,0.08)';
        bgColor     = 'rgba(255,255,255,0.35)';
    } else if (isOverdue) {
        borderColor = hovered ? 'rgba(220,38,38,0.3)' : 'rgba(220,38,38,0.18)';
        bgColor     = hovered ? 'rgba(220,38,38,0.06)' : 'rgba(254,242,242,0.7)';
    } else {
        borderColor = hovered ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.15)';
        bgColor     = hovered ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.6)';
    }

    const hasMetaRow = !isComplete && !editing && (todo.priority || dueDateStatus);

    return (
        <div
            className={editing ? '' : 'todo-enter'}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                alignItems: editing ? 'flex-start' : 'flex-start',
                gap: '0.75rem',
                padding: '0.9rem 1rem',
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                background: bgColor,
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                transform: hovered && !isComplete && !editing ? 'translateY(-1px)' : '',
                boxShadow: hovered && !isComplete && !editing ? '0 4px 16px rgba(139,92,246,0.1)' : editing ? '0 4px 20px rgba(139,92,246,0.12)' : '',
            }}
        >
            {/* Drag handle */}
            {dragHandleProps && !isComplete && !editing && (
                <div
                    {...dragHandleProps}
                    style={{
                        flexShrink: 0, marginTop: 3,
                        cursor: 'grab', color: 'rgba(139,92,246,0.25)',
                        opacity: hovered ? 1 : 0.2,
                        transition: 'opacity 0.18s',
                        display: 'flex', alignItems: 'center',
                        touchAction: 'none',
                    }}
                    title="Drag to reorder"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9"  cy="6"  r="1.5"/><circle cx="15" cy="6"  r="1.5"/>
                        <circle cx="9"  cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                        <circle cx="9"  cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                    </svg>
                </div>
            )}

            {/* Checkbox */}
            <button
                onClick={handleToggle}
                disabled={toggling || editing}
                title={isComplete ? 'Mark as pending' : 'Mark as complete'}
                style={{
                    flexShrink: 0, marginTop: 2,
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${isComplete ? 'transparent' : 'rgba(139,92,246,0.45)'}`,
                    background: isComplete ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: toggling || editing ? 'not-allowed' : 'pointer',
                    padding: 0,
                    opacity: editing ? 0.4 : 1,
                    transition: 'background 0.25s, border-color 0.25s, transform 0.15s, opacity 0.2s',
                }}
                onMouseEnter={e => { if (!isComplete && !toggling && !editing) e.currentTarget.style.borderColor = '#7c3aed'; }}
                onMouseLeave={e => { if (!isComplete) e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'; }}
                onMouseDown={e => { if (!editing) e.currentTarget.style.transform = 'scale(0.88)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
                {toggling && (
                    <div className="animate-spin-smooth"
                        style={{ width: 10, height: 10, border: '1.5px solid rgba(139,92,246,0.2)', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
                )}
                {isComplete && !toggling && (
                    <svg className="check-pop" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {/* Content — display or inline edit */}
            {editing ? (
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }} onKeyDown={handleEditKeyDown}>
                    <input
                        ref={titleInputRef}
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onFocus={onFieldFocus}
                        onBlur={onFieldBlur}
                        placeholder="Task title"
                        style={editFieldStyle}
                    />
                    <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        onFocus={onFieldFocus}
                        onBlur={onFieldBlur}
                        placeholder="Note… (optional)"
                        rows={2}
                        style={{ ...editFieldStyle, resize: 'none', lineHeight: 1.5 }}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <select
                            value={editPriority}
                            onChange={e => setEditPriority(e.target.value)}
                            onFocus={onFieldFocus}
                            onBlur={onFieldBlur}
                            style={{ ...editFieldStyle, flex: 1, cursor: 'pointer' }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <input
                            type="date"
                            value={editDueDate}
                            onChange={e => setEditDueDate(e.target.value)}
                            onFocus={onFieldFocus}
                            onBlur={onFieldBlur}
                            style={{ ...editFieldStyle, flex: 1, colorScheme: 'light' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <button
                            onClick={saveEdit}
                            disabled={saving || !editTitle.trim()}
                            style={{
                                padding: '0.32rem 0.9rem', borderRadius: 7, border: 'none',
                                background: saving || !editTitle.trim()
                                    ? 'rgba(139,92,246,0.35)'
                                    : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                                color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                                fontFamily: 'DM Sans, sans-serif',
                                cursor: saving || !editTitle.trim() ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                transition: 'opacity 0.15s',
                            }}
                        >
                            {saving && (
                                <span className="animate-spin-smooth" style={{ display: 'inline-block', width: 11, height: 11, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                            )}
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            onClick={cancelEdit}
                            style={{
                                padding: '0.32rem 0.8rem', borderRadius: 7,
                                background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)',
                                color: 'rgba(46,16,101,0.6)', fontSize: '0.8rem', fontWeight: 600,
                                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(46,16,101,0.3)', alignSelf: 'center', marginLeft: 'auto' }}>
                            Ctrl+Enter to save · Esc to cancel
                        </span>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                        onClick={() => { if (!isComplete) startEdit(); }}
                        title={isComplete ? '' : 'Click to edit'}
                        style={{
                            fontWeight: 500,
                            fontSize: '0.9375rem',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                            color: isComplete ? 'rgba(30,27,75,0.3)' : '#1e1b4b',
                            textDecoration: isComplete ? 'line-through' : 'none',
                            textDecorationColor: 'rgba(30,27,75,0.2)',
                            transition: 'color 0.25s',
                            cursor: isComplete ? 'default' : 'text',
                            marginBottom: (todo.description || hasMetaRow) ? '0.25rem' : 0,
                        }}
                    >
                        {todo.title}
                    </p>

                    {todo.description && (
                        <p style={{
                            fontSize: '0.8125rem',
                            marginBottom: hasMetaRow ? '0.3rem' : 0,
                            wordBreak: 'break-word',
                            lineHeight: 1.55,
                            color: isComplete ? 'rgba(30,27,75,0.22)' : 'rgba(30,27,75,0.5)',
                            transition: 'color 0.25s',
                        }}>
                            {todo.description}
                        </p>
                    )}

                    {hasMetaRow && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {todo.priority && (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                                    padding: '0.15rem 0.5rem', borderRadius: 100,
                                    background: priority.bg, color: priority.color,
                                    border: `1px solid ${priority.border}`,
                                }}>
                                    {priority.label}
                                </span>
                            )}
                            {dueDateStatus && (
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: 500, color: dueDateStatus.color,
                                    display: 'flex', alignItems: 'center', gap: '0.22rem',
                                }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    {dueDateStatus.label}
                                </span>
                            )}
                        </div>
                    )}

                    {isComplete && dueDateStatus && (
                        <span style={{ fontSize: '0.72rem', color: 'rgba(30,27,75,0.28)' }}>
                            {dueDateStatus.label}
                        </span>
                    )}
                </div>
            )}

            {/* Action icons / inline delete confirm */}
            {!editing && (
                confirming ? (
                    <div className="animate-slide-in" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(46,16,101,0.5)', whiteSpace: 'nowrap' }}>Delete?</span>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{
                                padding: '0.22rem 0.65rem', borderRadius: 7,
                                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)',
                                color: '#b91c1c', fontSize: '0.78rem', fontWeight: 600,
                                fontFamily: 'DM Sans, sans-serif', cursor: deleting ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.18)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
                        >
                            {deleting
                                ? <div className="animate-spin-smooth" style={{ width: 11, height: 11, border: '1.5px solid rgba(220,38,38,0.2)', borderTopColor: '#dc2626', borderRadius: '50%' }} />
                                : 'Yes'}
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            style={{
                                padding: '0.22rem 0.65rem', borderRadius: 7,
                                background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)',
                                color: 'rgba(46,16,101,0.6)', fontSize: '0.78rem', fontWeight: 600,
                                fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.13)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.07)'; }}
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                        {!isComplete && (
                            <IconButton onClick={startEdit} title="Edit" hoverBg="rgba(139,92,246,0.1)" hoverColor="#7c3aed">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </IconButton>
                        )}
                        <IconButton onClick={() => setConfirming(true)} title="Delete" hoverBg="rgba(220,38,38,0.08)" hoverColor="#dc2626">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </IconButton>
                    </div>
                )
            )}
        </div>
    );
}

function IconButton({ children, onClick, disabled, title, hoverBg, hoverColor }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            style={{
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none', borderRadius: 8,
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: 'rgba(46,16,101,0.55)',
                opacity: disabled ? 0.5 : 1,
                padding: 0,
                transition: 'background 0.18s, color 0.18s',
            }}
            onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor; }}}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(46,16,101,0.35)'; }}
        >
            {children}
        </button>
    );
}
