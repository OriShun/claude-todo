'use client';

import type { TodoFilter, Priority } from '@/lib/types';

const STATUS_OPTIONS: { value: TodoFilter['status']; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
];

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'すべての優先度' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

interface FilterBarProps {
  categories: string[];
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export default function FilterBar({ categories, filter, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Status */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filter, status: opt.value })}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              filter.status === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Priority */}
      <select
        value={filter.priority ?? ''}
        onChange={(e) =>
          onChange({ ...filter, priority: (e.target.value as Priority) || undefined })
        }
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Category */}
      {categories.length > 0 && (
        <select
          value={filter.category ?? ''}
          onChange={(e) => onChange({ ...filter, category: e.target.value || undefined })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべてのカテゴリ</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
