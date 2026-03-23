'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTodos, getCategories, createTodo, updateTodo, deleteTodo, toggleTodo } from '@/lib/store';
import type { Todo, TodoFilter, Priority, CreateTodoInput, UpdateTodoInput } from '@/lib/types';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import FilterBar from './FilterBar';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all' });
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setTodos(getTodos(filter));
    setCategories(getCategories());
  }, [filter]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) refresh();
  }, [hydrated, refresh]);

  function handleCreate(input: CreateTodoInput) {
    createTodo(input);
    refresh();
  }

  function handleUpdate(id: number, input: UpdateTodoInput) {
    updateTodo(id, input);
    refresh();
  }

  function handleToggle(id: number) {
    toggleTodo(id);
    refresh();
  }

  function handleDelete(id: number) {
    deleteTodo(id);
    refresh();
  }

  function handleFilterChange(next: TodoFilter) {
    setFilter(next);
  }

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TODO</h1>
          <p className="text-sm text-gray-500 mt-1">タスクを管理しましょう</p>
        </div>

        <div className="mb-4">
          <TodoForm onCreate={handleCreate} />
        </div>

        <div className="mb-4">
          <FilterBar
            categories={categories}
            filter={filter}
            onChange={handleFilterChange}
          />
        </div>

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
