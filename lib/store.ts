import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter } from './types';

const STORAGE_KEY = 'claude-todo-items';

function load(): Todo[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let _nextId: number | null = null;
function nextId(): number {
  if (_nextId === null) {
    const todos = load();
    _nextId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  }
  return _nextId++;
}

export function getTodos(filter: TodoFilter = {}): Todo[] {
  let todos = load();

  if (filter.status === 'active') todos = todos.filter((t) => !t.completed);
  else if (filter.status === 'completed') todos = todos.filter((t) => t.completed);
  if (filter.category) todos = todos.filter((t) => t.category === filter.category);
  if (filter.priority) todos = todos.filter((t) => t.priority === filter.priority);

  return todos.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.created_at.localeCompare(a.created_at);
  });
}

export function getCategories(): string[] {
  const todos = load();
  const cats = [...new Set(todos.map((t) => t.category).filter(Boolean) as string[])];
  return cats.sort();
}

export function createTodo(input: CreateTodoInput): Todo {
  const todos = load();
  const now = new Date().toISOString();
  const todo: Todo = {
    id: nextId(),
    title: input.title,
    completed: false,
    priority: input.priority,
    due_date: input.due_date ?? null,
    category: input.category ?? null,
    tags: input.tags ?? [],
    created_at: now,
    updated_at: now,
  };
  save([todo, ...todos]);
  return todo;
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo | null {
  const todos = load();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updated: Todo = {
    ...todos[idx],
    ...input,
    due_date: input.due_date !== undefined ? (input.due_date || null) : todos[idx].due_date,
    category: input.category !== undefined ? (input.category || null) : todos[idx].category,
    tags: input.tags ?? todos[idx].tags,
    updated_at: new Date().toISOString(),
  };
  todos[idx] = updated;
  save(todos);
  return updated;
}

export function toggleTodo(id: number): Todo | null {
  const todos = load();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], completed: !todos[idx].completed, updated_at: new Date().toISOString() };
  save(todos);
  return todos[idx];
}

export function deleteTodo(id: number): boolean {
  const todos = load();
  const filtered = todos.filter((t) => t.id !== id);
  if (filtered.length === todos.length) return false;
  save(filtered);
  return true;
}
