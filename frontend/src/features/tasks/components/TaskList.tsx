import React, { useState } from 'react';
import type {Task, TaskStatus, UpdateTaskRequest} from '../types/Task';
import { TaskItem } from './TaskItem.tsx';
import { TaskEditForm } from './TaskEditForm';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[];
  onChangeStatus: (taskId: string,status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, updates: UpdateTaskRequest) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
                                                    tasks,
                                                    onChangeStatus,
                                                    onDelete,
                                                    onEdit,
                                                  }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleEdit = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleSaveEdit = (taskId: string, updates: UpdateTaskRequest) => {
    onEdit(taskId, updates);
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-list__item">
          {editingTaskId === task.id ? (
            <TaskEditForm
              task={task}
              onSave={(updates) => handleSaveEdit(task.id, updates)}
              onCancel={handleCancelEdit}
            />
          ) : (
            <TaskItem
              task={task}
              onStatusChange={onChangeStatus}
              onDelete={() => onDelete(task.id)}
              onEdit={() => handleEdit(task.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
