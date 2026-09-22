export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface AssigneeProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  email: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order_index: number;
  project_id: string;
  assignee_id: string | null;
  deadline: string | null;
  created_at: string;
  assignee?: AssigneeProfile | null;
}

export interface KanbanColumnData {
  id: TaskStatus;
  title: string;
  accentColor: string;
  tasks: TaskItem[];
}
