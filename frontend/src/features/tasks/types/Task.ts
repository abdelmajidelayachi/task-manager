export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING'|'IN_PROGRESS'|'COMPLETED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: 'PENDING'|'IN_PROGRESS'|'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
}

//filter by the status of the task
export type TaskFilterStatus = 'ALL'|'PENDING'| 'IN_PROGRESS' | 'COMPLETED';
// filter by the priority of the task
export type TaskFilterPriority = 'ALL'|'LOW'|'MEDIUM'|'HIGH';
export type TaskSort = 'created' | 'dueDate' | 'priority' | 'title';
export type TaskStatus = 'PENDING'|'IN_PROGRESS'|'COMPLETED';
