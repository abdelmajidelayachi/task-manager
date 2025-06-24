import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterStatus, TaskFilterPriority, TaskSort, TaskStatus } from '../types/Task';
import { handleAsync } from "../../../services/errorHandler";
import {apiClient} from "../../../services/apiClient.ts"; // Ensure correct path if needed

// The base URL for task-related API endpoints relative to apiClient's base URL
const TASKS_API_PREFIX = '/v1/tasks';

// localStorage keys for preferences of the user
const STORAGE_KEYS = {
  FILTER_STATUS: 'task_filter_status',
  FILTER_PRIORITY: 'task_filter_priority',
  SORT: 'task_sort',
} as const;

export const taskService = {
  // API operations
  getTasks: async (): Promise<Task[]> => {
    const result = await handleAsync(async () => {
      // Use apiClient.get with the specific tasks endpoint
      const response = await apiClient.get<Task[]>(TASKS_API_PREFIX);
      return response.data;
    }, 'getTasks');

    // Add a warning if the API call failed (result is null due to handleAsync)
    if (result === null) {
      console.warn('getTasks: API call failed or returned null, returning empty array. Check console for error details from errorHandler.');
    }
    return result || [];
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const result = await handleAsync(async () => {
      // Use apiClient.post for creating a task
      const response = await apiClient.post<Task>(TASKS_API_PREFIX, taskData);
      return response.data;
    }, 'createTask');
    if (!result) {
      throw new Error("Failed to create task: result was null.");
    }
    return result;
  },

  updateTask: async (taskId: string, updates: UpdateTaskRequest): Promise<Task> => {
    const result = await handleAsync(async () => {
      // Use apiClient.put for updating a task by ID
      const response = await apiClient.put<Task>(`${TASKS_API_PREFIX}/${taskId}`, updates);
      return response.data;
    }, 'updateTask');
    if (!result) {
      throw new Error("Failed to update task: result was null.");
    }
    return result;
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus) => {
    const result = await handleAsync(async () => {
      // Use apiClient.patch for updating task status.
      // Note: If your backend PATCH endpoint expects a body for status updates,
      // ensure you pass an object with the status, e.g., `{ status: status }`.
      // The current implementation passes an empty object `{}` which is fine if
      // the backend only relies on the query parameter.
      const response = await apiClient.patch<Task>(`${TASKS_API_PREFIX}/${taskId}/status?status=${status}`, {});
      return response.data;
    }, 'updateTaskStatus');
    if (!result) {
      throw new Error("Failed to update task status: result was null.");
    }
    return result;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await handleAsync(async () => {
      // Use apiClient.delete for deleting a task by ID
      await apiClient.delete(`${TASKS_API_PREFIX}/${taskId}`);
    }, 'deleteTask');
  },

  // Local storage operations for filters and sort
  saveFilterStatus: (filterStatus: TaskFilterStatus): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILTER_STATUS, filterStatus);
    } catch (error) {
      console.warn('Failed to save filter status to localStorage:', error);
    }
  },

  getFilterStatus: (): TaskFilterStatus | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILTER_STATUS);
      return saved as TaskFilterStatus || null;
    } catch (error) {
      console.warn('Failed to get filter status from localStorage:', error);
      return null;
    }
  },

  saveFilterPriority: (filterPriority: TaskFilterPriority): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILTER_PRIORITY, filterPriority);
    } catch (error) {
      console.warn('Failed to save filter priority to localStorage:', error);
    }
  },

  getFilterPriority: (): TaskFilterPriority | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILTER_PRIORITY);
      return saved as TaskFilterPriority || null;
    } catch (error) {
      console.warn('Failed to get filter priority from localStorage:', error);
      return null;
    }
  },

  saveSort: (sort: TaskSort): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SORT, sort);
    } catch (error) {
      console.warn('Failed to save sort to localStorage:', error);
    }
  },

  getSort: (): TaskSort | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SORT);
      return saved as TaskSort || null;
    } catch (error) {
      console.warn('Failed to get sort from localStorage:', error);
      return null;
    }
  },
};
