import React, { useState } from 'react';
import type { CreateTaskRequest } from '../types/Task.ts';
import { Plus, X } from 'lucide-react';
import './TaskForm.scss';
import {Button} from "../../../components/common/Button/Button.tsx";
import {TASK_PRIORITIES, TASK_STATUSES} from "../../../utils/constants.ts";

interface TaskFormProps {
  onSubmit: (task: CreateTaskRequest) => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, isOpen }) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form__header">
          <h3>Create New Task</h3>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} type="button">
              <X size={16} />
            </Button>
          )}
        </div>

        <div className="task-form__field">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title..."
            required
          />
        </div>

        <div className="task-form__field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter task description..."
            rows={3}
          />
        </div>

        <div className="task-form__row">
          <div className="task-form__field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
            >
              {Object.entries(TASK_PRIORITIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
                ))}
            </select>
          </div>
          <div className="task-form__field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            >
              {
                Object.entries(TASK_STATUSES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="task-form__actions">
          <Button type="submit" icon={<Plus size={16} />}>
            Create Task
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
