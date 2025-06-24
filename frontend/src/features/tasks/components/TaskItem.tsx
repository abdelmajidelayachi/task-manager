import React, { useState, useRef, useEffect } from 'react';
import type { Task, TaskStatus } from '../types/Task';
import {
  Edit2,
  Trash2,
  Circle,
  CheckCircle,
  ChevronDown,
  PlayCircle
} from 'lucide-react';
import { capitalizeFirst } from '../../../utils/formatters';
import { PRIORITY_COLORS, TASK_STATUS_CONFIG } from '../../../utils/constants';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
                                                    task,
                                                    onStatusChange,
                                                    onDelete,
                                                    onEdit,
                                                  }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorityColor = PRIORITY_COLORS[task.priority];
  const statusConfig = TASK_STATUS_CONFIG[task.status];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = ( newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus);
    setIsDropdownOpen(false);
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return <Circle size={14} />;
      case 'IN_PROGRESS':
        return <PlayCircle size={14} />;
      case 'COMPLETED':
        return <CheckCircle size={14} />;
      default:
        return <Circle size={14} />;
    }
  };

  const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'PENDING', label: 'To Do', icon: <Circle size={14} /> },
    { value: 'IN_PROGRESS', label: 'In Progress', icon: <PlayCircle size={14} /> },
    { value: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={14} /> },
  ];

  return (
    <div className={`task-item task-item--${task.status}`}>
      <div className="task-item__status-section">
        <div className="task-item__status-dropdown" ref={dropdownRef}>
          <button
            className={`task-item__status-button task-item__status-button--${task.status} ${
              isDropdownOpen ? 'task-item__status-button--open' : ''
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label={`Change status from ${task.status}`}
          >
            <span className="task-item__status-icon">
              {getStatusIcon(task.status)}
            </span>
            {statusConfig.label}
            <ChevronDown size={12} className="task-item__dropdown-arrow" />
          </button>

          {isDropdownOpen && (
            <div className="task-item__status-menu">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`task-item__status-option ${
                    task.status === option.value ? 'task-item__status-option--active' : ''
                  }`}
                  onClick={() => handleStatusChange(option.value)}
                >
                  <span className="task-item__option-icon">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-item__content">
        <div className="task-item__header">
          <div className="task-item__title-section">
            <h3 className="task-item__title">{task.title}</h3>
          </div>
          <div
            className="task-item__priority"
            style={{
              backgroundColor: `${priorityColor}20`,
              color: priorityColor,
              borderColor: `${priorityColor}40`
            }}
          >
            {capitalizeFirst(task.priority)}
          </div>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}

        <div className="task-item__actions">
          <button
            className="task-item__action-btn task-item__action-btn--edit"
            onClick={onEdit}
            aria-label="Edit task"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="task-item__action-btn task-item__action-btn--delete"
            onClick={onDelete}
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
