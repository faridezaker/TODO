import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import TodoApp from './components/TodoApp';

const root = document.getElementById('app');
if (root) {
    createRoot(root).render(<TodoApp />);
}
