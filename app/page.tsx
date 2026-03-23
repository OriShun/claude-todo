import { Suspense } from 'react';
import { getTodos, getCategories } from '@/lib/db';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import type { TodoFilter, Priority } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ filter?: string; category?: string; priority?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const filter: TodoFilter = {
    status: (params.filter as TodoFilter['status']) || 'all',
    category: params.category || undefined,
    priority: (params.priority as Priority) || undefined,
  };

  const [todos, categories] = await Promise.all([
    getTodos(filter),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TODO</h1>
          <p className="text-sm text-gray-500 mt-1">タスクを管理しましょう</p>
        </div>

        {/* Add form */}
        <div className="mb-4">
          <TodoForm />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <Suspense>
            <FilterBar categories={categories} />
          </Suspense>
        </div>

        {/* List */}
        <TodoList todos={todos} />
      </div>
    </div>
  );
}
