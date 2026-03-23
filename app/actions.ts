'use server';

import { revalidatePath } from 'next/cache';
import { createTodo, updateTodo, deleteTodo, toggleTodo } from '@/lib/db';
import type { Priority } from '@/lib/types';

export async function actionCreateTodo(formData: FormData) {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return;

  const priority = (formData.get('priority') as Priority | null) ?? 'medium';
  const due_date = (formData.get('due_date') as string | null) || undefined;
  const category = (formData.get('category') as string | null)?.trim() || undefined;
  const tagsRaw = (formData.get('tags') as string | null) ?? '';
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  createTodo({ title, priority, due_date, category, tags });
  revalidatePath('/');
}

export async function actionUpdateTodo(id: number, formData: FormData) {
  const title = (formData.get('title') as string | null)?.trim();
  if (!title) return;

  const priority = (formData.get('priority') as Priority | null) ?? 'medium';
  const due_date = (formData.get('due_date') as string | null) || undefined;
  const category = (formData.get('category') as string | null)?.trim() || undefined;
  const tagsRaw = (formData.get('tags') as string | null) ?? '';
  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  updateTodo(id, { title, priority, due_date, category, tags });
  revalidatePath('/');
}

export async function actionToggleTodo(id: number) {
  toggleTodo(id);
  revalidatePath('/');
}

export async function actionDeleteTodo(id: number) {
  deleteTodo(id);
  revalidatePath('/');
}
