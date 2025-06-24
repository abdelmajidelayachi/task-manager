import type { Task, TaskFilterStatus, TaskFilterPriority, TaskSort } from '../features/tasks/types/Task';

export const sortTasks = (tasks: Task[], sortBy: TaskSort): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
};

export const filterStatusTasks = (tasks: Task[], filter: TaskFilterStatus): Task[] => {
  if(filter === 'ALL') return tasks;
   return tasks.filter(task => task.status === filter);
};

export const filterPriorityTasks = (tasks : Task[], filter : TaskFilterPriority) : Task[] => {
  if(filter === 'ALL') return tasks;
  return tasks.filter(task => task.priority === filter);
}
