'use client';

import { useRef, useState } from 'react';
import type { Todo, Priority, CreateTodoInput, UpdateTodoInput } from '@/lib/types';

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

interface TodoFormProps {
  onCreate?: (input: CreateTodoInput) => void;
  editTodo?: Todo;
  onUpdate?: (id: number, input: UpdateTodoInput) => void;
  onCancel?: () => void;
}

export default function TodoForm({ onCreate, editTodo, onUpdate, onCancel }: TodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [expanded, setExpanded] = useState(!!editTodo);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get('title') as string).trim();
    if (!title) return;

    const priority = (fd.get('priority') as Priority) ?? 'medium';
    const due_date = (fd.get('due_date') as string) || undefined;
    const category = (fd.get('category') as string).trim() || undefined;
    const tagsRaw = fd.get('tags') as string;
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

    if (editTodo) {
      onUpdate?.(editTodo.id, { title, priority, due_date, category, tags });
      onCancel?.();
    } else {
      onCreate?.({ title, priority, due_date, category, tags });
      formRef.current?.reset();
      setExpanded(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div className="flex gap-2">
        <input
          name="title"
          defaultValue={editTodo?.title}
          required
          placeholder="タスクを入力..."
          onFocus={() => setExpanded(true)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
        />
        {!editTodo && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            追加
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">優先度</label>
            <select
              name="priority"
              defaultValue={editTodo?.priority ?? 'medium'}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">期限日</label>
            <input
              name="due_date"
              type="date"
              defaultValue={editTodo?.due_date ?? ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">カテゴリ</label>
            <input
              name="category"
              type="text"
              defaultValue={editTodo?.category ?? ''}
              placeholder="仕事, 個人..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs text-gray-500 mb-1">タグ (カンマ区切り)</label>
            <input
              name="tags"
              type="text"
              defaultValue={editTodo?.tags.join(', ') ?? ''}
              placeholder="急ぎ, 重要..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-3 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setExpanded(false); onCancel?.(); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {editTodo ? '更新' : '追加'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
