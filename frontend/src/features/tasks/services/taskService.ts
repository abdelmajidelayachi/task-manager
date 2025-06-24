import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterStatus, TaskFilterPriority, TaskSort, TaskStatus } from '../types/Task';
import { handleAsync } from "../../../services/errorHandler.ts";

const API_BASE_URL = 'http://localhost:8088/api/v1/tasks';

const taskApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      const response = await taskApi.get<Task[]>('');
      return response.data;
    }, 'getTasks');
    return result || [];
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const result = await handleAsync(async () => {
      const response = await taskApi.post<Task>('', taskData);
      return response.data;
    }, 'createTask');
    if (!result) {
      throw new Error("Failed to create task: result was null.");
    }
    return result;
  },

  updateTask: async (taskId: string, updates: UpdateTaskRequest): Promise<Task> => {
    const result = await handleAsync(async () => {
      const response = await taskApi.put<Task>(`/${taskId}`, updates);
      return response.data;
    }, 'updateTask');
    if (!result) {
      throw new Error("Failed to update task: result was null.");
    }
    return result;
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus) => {
    const result = await handleAsync(async () => {
      const response = await taskApi.patch<Task>(`/${taskId}/status?status=${status}`);
      return response.data;
    }, 'updateTaskStatus');
    if (!result) {
      throw new Error("Failed to update task status: result was null.");
    }
    return result;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await handleAsync(async () => {
      await taskApi.delete(`/${taskId}`);
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
