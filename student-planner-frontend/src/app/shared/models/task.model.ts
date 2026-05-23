export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  userId: number;
  subjectId?: number;
  subject?: { id: number; name: string; color: string };
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: TaskStatus;
  createdAt?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  subjectId?: number;
  from?: string;
  to?: string;
}
