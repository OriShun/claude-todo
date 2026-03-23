'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Priority } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
] as const;

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'すべての優先度' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

interface FilterBarProps {
  categories: string[];
}

export default function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get('filter') ?? 'all';
  const currentCategory = searchParams.get('category') ?? '';
  const currentPriority = (searchParams.get('priority') ?? '') as Priority | '';

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Status */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update('filter', opt.value === 'all' ? '' : opt.value)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              currentStatus === opt.value
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
        value={currentPriority}
        onChange={(e) => update('priority', e.target.value)}
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
          value={currentCategory}
          onChange={(e) => update('category', e.target.value)}
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
