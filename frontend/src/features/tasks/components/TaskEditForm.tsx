import React, { useState } from 'react';
import type{ Task, UpdateTaskRequest } from '../types/Task';
import { Button } from '../../../components/common/Button/Button';
import { Check } from 'lucide-react';
import './TaskEditForm.scss';
import {TASK_PRIORITIES, TASK_STATUSES} from "../../../utils/constants.ts";

interface TaskEditFormProps {
  task: Task;
  onSave: (updates: UpdateTaskRequest) => void;
  onCancel: () => void;
}

export const TaskEditForm: React.FC<TaskEditFormProps> = ({
                                                            task,
                                                            onSave,
                                                            onCancel,
                                                          }) => {
  const [formData, setFormData] = useState<UpdateTaskRequest>({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
    });
  };

  return (
    <form className="task-edit-form" onSubmit={handleSubmit}>
      <div className="task-edit-form__field">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Task title..."
          className="task-edit-form__title-input"
          required
        />
      </div>

      <div className="task-edit-form__field">
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description..."
          className="task-edit-form__description-input"
          rows={2}
        />
      </div>

      <div className="task-form__row">
      <div className="task-edit-form__field">
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
          className="task-edit-form__select"
          >
          {
            Object.entries(TASK_STATUSES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))
          }
        </select>
      </div>

      <div className="task-edit-form__row">
        <select
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
          className="task-edit-form__select"
        >
          {Object.entries(TASK_PRIORITIES).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
        </select>
      </div>
      </div>
      <div className="task-edit-form__actions">
        <Button type="submit" size="sm" icon={<Check size={14} />}>
          Save
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
