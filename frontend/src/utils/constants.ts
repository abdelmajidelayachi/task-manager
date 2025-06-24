export const TASK_PRIORITIES = {
  LOW: 'Low priority' as const,
  MEDIUM: 'Medium priority' as const,
  HIGH: 'High priority' as const,
} as const;

export const TASK_STATUSES = {
  PENDING: 'To Do' as const,
  IN_PROGRESS: 'In Progress' as const,
  COMPLETED: 'Completed' as const,
}

export const TASK_SORT_OPTIONS = {
  CREATED: 'created' as const,
  STATUS: 'STATUS' as const,
  PRIORITY: 'priority' as const,
  TITLE: 'title' as const,
} as const;

export const TASK_STATUS_CONFIG = {
  'PENDING': {
    label: 'To Do',
    color: '#6b7280',
    bgColor: '#f3f4f6',
  },
  'IN_PROGRESS': {
    label: 'In Progress',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  'COMPLETED': {
    label: 'Completed',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
} as const;


export const PRIORITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
} as const;


