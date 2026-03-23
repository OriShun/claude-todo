export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  category: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TodoFilter {
  status?: 'all' | 'active' | 'completed';
  category?: string;
  priority?: Priority;
}

export interface CreateTodoInput {
  title: string;
  priority: Priority;
  due_date?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  completed?: boolean;
}
