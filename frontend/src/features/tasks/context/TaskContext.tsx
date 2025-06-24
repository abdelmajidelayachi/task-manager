import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { CreateTaskRequest, Task, TaskFilterPriority, TaskFilterStatus, TaskSort, UpdateTaskRequest, TaskStatus } from '../types/Task';
import { taskService } from '../services/taskService';
import {handleAsync} from "../../../services/errorHandler.ts";
import {filterStatusTasks, filterPriorityTasks, sortTasks} from "../../../utils/helpers.ts"; // Ensure correct import paths

/**
 * Defines the shape of the context value provided by TaskContext.
 * This includes all task-related state and functions for manipulation.
 */
interface TaskContextType {
  tasks: Task[]; // All tasks loaded from the backend
  filteredTasks: Task[]; // Tasks after applying filters, sort, and search
  filterStatus: TaskFilterStatus; // Current status filter
  filterPriority: TaskFilterPriority; // Current priority filter
  sort: TaskSort; // Current sort order
  searchQuery: string; // Current search query string
  loading: boolean; // Indicates if tasks are currently being loaded
  createTask: (taskData: CreateTaskRequest) => Promise<Task | null>; // Function to create a new task
  updateTask: (taskId: string, updates: UpdateTaskRequest) => Promise<Task | null>; // Function to update an existing task
  deleteTask: (taskId: string) => Promise<void>; // Function to delete a task
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task | null>; // Function to update a task's status
  setFilterStatus: (newFilter: TaskFilterStatus) => void; // Function to set the status filter
  setFilterPriority: (newFilter: TaskFilterPriority) => void; // Function to set the priority filter
  setSort: (newSort: TaskSort) => void; // Function to set the sort order
  setSearchQuery: (query: string) => void; // Function to set the search query
}

// Create the TaskContext with an undefined default value
const TaskContext = createContext<TaskContextType | undefined>(undefined);

/**
 * Props interface for TaskProvider.
 */
interface TaskProviderProps {
  children: ReactNode;
}

/**
 * TaskProvider component.
 * This component manages the state for tasks, filters, sorting, and search queries.
 */
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // State variables for tasks and UI controls
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>('ALL');
  const [filterPriority, setFilterPriority] = useState<TaskFilterPriority>('ALL');
  const [sort, setSort] = useState<TaskSort>('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch

  // Effect to load tasks
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const fetchedTasks = await handleAsync(taskService.getTasks, 'TaskContext.loadTasks');
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      }
      setLoading(false);
    };

    loadTasks();
  }, []);

  // Effect to load saved filter and sort preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      // Retrieve preferences using taskService's localStorage methods
      const savedFilterStatus = taskService.getFilterStatus();
      const savedFilterPriority = taskService.getFilterPriority();
      const savedSort = taskService.getSort();

      // Apply saved preferences if they exist
      if (savedFilterStatus) setFilterStatus(savedFilterStatus);
      if (savedFilterPriority) setFilterPriority(savedFilterPriority);
      if (savedSort) setSort(savedSort);
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    taskService.saveFilterStatus(filterStatus);
  }, [filterStatus]); // Runs when filterStatus changes

  useEffect(() => {
    taskService.saveFilterPriority(filterPriority);
  }, [filterPriority]); // Runs when filterPriority changes

  useEffect(() => {
    taskService.saveSort(sort);
  }, [sort]); // Runs when sort order changes

  /**
   * Memoized computation for filtered and sorted tasks.
   */
  const filteredTasks = useMemo(() => {
    let filtered = filterStatusTasks(tasks, filterStatus); // Apply status filter
    filtered = filterPriorityTasks(filtered, filterPriority); // Apply priority filter

    // Apply search filter if a query is present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) || // Search in title
          task.description?.toLowerCase().includes(query) // Search in description
      );
    }

    return sortTasks(filtered, sort); // Apply sorting
  }, [tasks, filterStatus, filterPriority, sort, searchQuery]); // Dependencies for memoization


  /**
   * Memoized function to create a new task.
   */
  const createTask = useCallback(
    async (taskData: CreateTaskRequest): Promise<Task | null> => {
      const newTask = await handleAsync(() => taskService.createTask(taskData), 'TaskContext.createTask');
      if (newTask) {
        // Use functional update to ensure we're working with the latest state
        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      }
      return null;
    },
    [] // Empty dependency array because `setTasks` is stable (React guarantees)
  );

  /**
   * Memoized function to update an existing task.
   */
  const updateTask = useCallback(
    async (taskId: string, updates: UpdateTaskRequest): Promise<Task | null> => {
      const updatedTask = await handleAsync(() => taskService.updateTask(taskId, updates), 'TaskContext.updateTask');
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      }
      return null;
    },
    [] // Empty dependency array
  );

  /**
   * Memoized function to delete a task.
   */
  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      const success = await handleAsync(() => taskService.deleteTask(taskId), 'TaskContext.deleteTask');
      if (success !== null) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    },
    []
  );

  /**
   * Memoized function to update a task's status.
   */
  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus): Promise<Task | null> => {
      const updatedTask = await handleAsync(() => taskService.updateTaskStatus(taskId, status), 'TaskContext.updateTaskStatus');
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      }
      return null;
    },
    []
  );

  /**
   * Memoized value of the context to be provided.
   */
  const contextValue = useMemo(
    () => ({
      tasks,
      filteredTasks,
      filterStatus,
      filterPriority,
      sort,
      searchQuery,
      loading,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      setFilterStatus,
      setFilterPriority,
      setSort,
      setSearchQuery,
    }),
    [
      tasks,
      filteredTasks,
      filterStatus,
      filterPriority,
      sort,
      searchQuery,
      loading,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      setFilterStatus,
      setFilterPriority,
      setSort,
      setSearchQuery,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

/**
 * This hook simplifies consuming the TaskContext. Components can call `useTasks()`
 */
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
