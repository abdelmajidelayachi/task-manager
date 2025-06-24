import React, { useState } from 'react';
import { MainLayout } from '../components/layouts/MainLayout';
import { TaskList } from '../features/tasks/components';
import { TaskForm } from '../features/tasks/components';
import { TaskFilters } from '../features/tasks/components';
import { Button } from '../components/common/Button/Button';
import type {
  CreateTaskRequest,
  TaskFilterStatus,
  TaskFilterPriority,
  TaskSort,
  TaskStatus
} from '../features/tasks/types/Task';
import { Plus } from 'lucide-react';
import './TasksPage.scss';
import {useTasks} from "../features/tasks/context/TaskContext.tsx";

export const TasksPage: React.FC = () => {
  const {
    filteredTasks,
    filterStatus,
    filterPriority,
    sort,
    loading,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilterStatus,
    setFilterPriority,
    setSort,
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      const newTask = await createTask(taskData);
      if (newTask) {
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleChangeStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusFilterChange = (newFilter: TaskFilterStatus) => {
    setFilterStatus(newFilter);
  };

  const handlePriorityFilterChange = (newFilter: TaskFilterPriority) => {
    setFilterPriority(newFilter);
  };

  const handleSortChange = (newSort: TaskSort) => {
    setSort(newSort);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="tasks-page">
          <div className="tasks-page__loading">
            Loading tasks...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <div className="tasks-page">
          <div className="tasks-page__header">
            <div className="tasks-page__title-section">
              <h2 className="tasks-page__subtitle">Manage Your Tasks</h2>
              <p className="tasks-page__description">
                Stay organized and productive with your personal task manager
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Plus size={20} />}
              onClick={() => setIsFormOpen(true)}
            >
              Add Task
            </Button>
          </div>

          <div className="tasks-page__controls">
            <TaskFilters
              currentStatusFilter={filterStatus}
              currentPriorityFilter={filterPriority}
              currentSort={sort}
              onFilterStatusChange={handleStatusFilterChange}
              onFilterPriorityChange={handlePriorityFilterChange}
              onSortChange={handleSortChange}
            />
          </div>

          <div className="tasks-page__content">
            <TaskList
              tasks={filteredTasks}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDeleteTask}
              onEdit={updateTask}
            />
          </div>

          <TaskForm
            isOpen={isFormOpen}
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
    </MainLayout>
  );
};
