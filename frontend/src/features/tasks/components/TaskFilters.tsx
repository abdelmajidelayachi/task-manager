import React from 'react';
import type {TaskFilterPriority, TaskFilterStatus, TaskSort} from '../types/Task';
import { Search } from 'lucide-react';
import './TaskFilters.scss';

interface TaskFiltersProps {
  currentStatusFilter: TaskFilterStatus;
  currentPriorityFilter: TaskFilterPriority;
  currentSort: TaskSort;
  onFilterStatusChange: (filter: TaskFilterStatus) => void;
  onFilterPriorityChange: (filter: TaskFilterPriority) => void;
  onSortChange: (sort: TaskSort) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
                                                          currentStatusFilter,
                                                          currentPriorityFilter,
                                                          currentSort,
                                                          onFilterPriorityChange,
                                                          onFilterStatusChange,
                                                          onSortChange,
                                                          searchQuery = '',
                                                          onSearchChange,
                                                        }) => {
  const filterStatusOptions: { value: TaskFilterStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  const filterPriorityOptions: { value: TaskFilterPriority; label: string }[] = [
    {value: 'ALL', label: 'All'},
    {value: 'HIGH', label: 'high'},
    {value: 'MEDIUM', label: 'Medium'},
    {value: 'LOW', label: 'Low'}
  ]

  const sortOptions: { value: TaskSort; label: string }[] = [
    { value: 'created', label: 'Date Created' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className="task-filters">
      <div className="task-filters__header">
        <h3 className="task-filters__title">Filter & Sort Tasks</h3>
        <div className="task-filters__controls">
          <div className="task-filters__group">
            <span className="task-filters__label">By Status:</span>
            <div className="task-filters__filter-buttons">
              {filterStatusOptions.map(option => (
                <button
                  key={option.value}
                  className={`task-filters__filter-btn ${
                    currentStatusFilter === option.value ? 'task-filters__filter-btn--active' : ''
                  }`}
                  onClick={() => onFilterStatusChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="task-filters__group">
            <span className="task-filters__label">By Priority:</span>
            <div className="task-filters__filter-buttons">
              {filterPriorityOptions.map(option => (
                <button
                  key={option.value}
                  className={`task-filters__filter-btn ${
                    currentPriorityFilter === option.value ? 'task-filters__filter-btn--active' : ''
                  }`}
                  onClick={() => onFilterPriorityChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="task-filters__group">
            <span className="task-filters__label">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value as TaskSort)}
              className="task-filters__sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {onSearchChange && (
            <div className="task-filters__search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks..."
                className="task-filters__search-input"
              />
              <Search size={16} className="task-filters__search-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
