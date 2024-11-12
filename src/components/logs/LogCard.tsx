import React from 'react';
import { Edit2, Save, X, Trash2, CheckSquare, Square, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { DailyLog } from '../../types';
import { SortConfig, SortField } from './LogsTableHeader';

interface LogCardProps {
  log: DailyLog;
  isSelected: boolean;
  isEditing: boolean;
  editValues: Partial<DailyLog>;
  sortConfig: SortConfig;
  onToggleSelect: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditValueChange: (field: keyof DailyLog, value: number) => void;
  onSort: (field: SortField) => void;
}

export function LogCard({
  log,
  isSelected,
  isEditing,
  editValues,
  sortConfig,
  onToggleSelect,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditValueChange,
  onSort
}: LogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const renderSortButton = (field: SortField, label: string) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-sm text-gray-500"
    >
      {label}
      {getSortIcon(field)}
    </button>
  );

  return (
    <div className={`p-4 ${isSelected ? 'bg-indigo-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={onToggleSelect}
          className="text-gray-400 hover:text-indigo-600"
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </button>
        <div className="flex-1 ml-3">
          <div className="flex items-center justify-between">
            {renderSortButton('date', 'Date')}
            <span className="text-sm text-gray-900">{formatDate(log.date)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Weight */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderSortButton('weight', 'Weight')}
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editValues.weight || ''}
              onChange={(e) => onEditValueChange('weight', Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
              step="0.1"
            />
          ) : (
            <span className="text-sm font-medium">
              {log.weight?.toFixed(1) || '-'} kg
            </span>
          )}
        </div>

        {/* Calories */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderSortButton('calories', 'Calories')}
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editValues.calories || ''}
              onChange={(e) => onEditValueChange('calories', Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <span className="text-sm font-medium">
              {log.calories?.toLocaleString() || '-'} kcal
            </span>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderSortButton('steps', 'Steps')}
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editValues.steps || ''}
              onChange={(e) => onEditValueChange('steps', Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
            />
          ) : (
            <span className="text-sm font-medium">
              {log.steps?.toLocaleString() || '-'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}