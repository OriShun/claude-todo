'use client';

import { useState } from 'react';
import TodoForm from './TodoForm';
import type { Todo, UpdateTodoInput } from '@/lib/types';

const PRIORITY_BADGE: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

const PRIORITY_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, input: UpdateTodoInput) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isOverdue = todo.due_date && todo.due_date < today && !todo.completed;

  if (editing) {
    return (
      <li className="rounded-xl overflow-hidden">
        <TodoForm
          editTodo={todo}
          onUpdate={onUpdate}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 transition-colors ${
          todo.completed
            ? 'bg-blue-600 border-blue-600'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && (
          <svg className="w-full h-full text-white p-0.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}>
          {todo.title}
        </p>

        <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_BADGE[todo.priority]}`}>
            {PRIORITY_LABEL[todo.priority]}
          </span>

          {todo.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {todo.category}
            </span>
          )}

          {todo.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              #{tag}
            </span>
          ))}

          {todo.due_date && (
            <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              {isOverdue ? '期限切れ: ' : '期限: '}{todo.due_date}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          aria-label="編集"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
