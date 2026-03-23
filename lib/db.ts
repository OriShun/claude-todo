import Database from 'better-sqlite3';
import path from 'path';
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter } from './types';

const DB_PATH = path.join(process.cwd(), 'todos.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      completed  INTEGER NOT NULL DEFAULT 0,
      priority   TEXT NOT NULL DEFAULT 'medium',
      due_date   TEXT,
      category   TEXT,
      tags       TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

function rowToTodo(row: Record<string, unknown>): Todo {
  return {
    id: row.id as number,
    title: row.title as string,
    completed: (row.completed as number) === 1,
    priority: row.priority as Todo['priority'],
    due_date: (row.due_date as string | null) ?? null,
    category: (row.category as string | null) ?? null,
    tags: JSON.parse((row.tags as string) || '[]'),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function getTodos(filter: TodoFilter = {}): Todo[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.status === 'active') {
    conditions.push('completed = 0');
  } else if (filter.status === 'completed') {
    conditions.push('completed = 1');
  }
  if (filter.category) {
    conditions.push('category = ?');
    params.push(filter.category);
  }
  if (filter.priority) {
    conditions.push('priority = ?');
    params.push(filter.priority);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db
    .prepare(`SELECT * FROM todos ${where} ORDER BY completed ASC, created_at DESC`)
    .all(...params) as Record<string, unknown>[];

  return rows.map(rowToTodo);
}

export function getCategories(): string[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT DISTINCT category FROM todos WHERE category IS NOT NULL AND category != '' ORDER BY category`)
    .all() as { category: string }[];
  return rows.map((r) => r.category);
}

export function createTodo(input: CreateTodoInput): Todo {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO todos (title, priority, due_date, category, tags)
       VALUES (?, ?, ?, ?, ?)
       RETURNING *`
    )
    .get(
      input.title,
      input.priority,
      input.due_date ?? null,
      input.category ?? null,
      JSON.stringify(input.tags ?? [])
    ) as Record<string, unknown>;
  return rowToTodo(result);
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo | null {
  const db = getDb();
  const fields: string[] = [];
  const params: unknown[] = [];

  if (input.title !== undefined) { fields.push('title = ?'); params.push(input.title); }
  if (input.priority !== undefined) { fields.push('priority = ?'); params.push(input.priority); }
  if (input.due_date !== undefined) { fields.push('due_date = ?'); params.push(input.due_date || null); }
  if (input.category !== undefined) { fields.push('category = ?'); params.push(input.category || null); }
  if (input.tags !== undefined) { fields.push('tags = ?'); params.push(JSON.stringify(input.tags)); }
  if (input.completed !== undefined) { fields.push('completed = ?'); params.push(input.completed ? 1 : 0); }

  if (fields.length === 0) return null;

  fields.push('updated_at = datetime(\'now\')');
  params.push(id);

  const row = db
    .prepare(`UPDATE todos SET ${fields.join(', ')} WHERE id = ? RETURNING *`)
    .get(...params) as Record<string, unknown> | undefined;

  return row ? rowToTodo(row) : null;
}

export function toggleTodo(id: number): Todo | null {
  const db = getDb();
  const row = db
    .prepare(
      `UPDATE todos
       SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END,
           updated_at = datetime('now')
       WHERE id = ?
       RETURNING *`
    )
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToTodo(row) : null;
}

export function deleteTodo(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return result.changes > 0;
}
