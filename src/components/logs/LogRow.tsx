import React from 'react';
import { Edit2, Save, X, Trash2, CheckSquare, Square } from 'lucide-react';
import type { DailyLog } from '../../types';
import { formatWeight, WEIGHT_STEP } from '../../utils/weightFormatting';

interface LogRowProps {
  log: DailyLog;
  isSelected: boolean;
  isEditing: boolean;
  editValues: Partial<DailyLog>;
  onToggleSelect: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditValuesChange: (updates: Partial<DailyLog>) => void;
}

export function LogRow({
  log,
  isSelected,
  isEditing,
  editValues,
  onToggleSelect,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditValuesChange
}: LogRowProps) {
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

  const handleInputChange = (field: keyof Pick<DailyLog, 'weight' | 'bodyFat' | 'calories' | 'steps'>, value: string) => {
    const numValue = value === '' ? null : Number(value);
    onEditValuesChange({
      ...editValues,
      [field]: numValue
    });
  };

  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-indigo-50' : ''}`}>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
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
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
        {formatDate(log.date)}
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {isEditing ? (
          <input
            type="number"
            value={editValues.weight ?? ''}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
            step={WEIGHT_STEP}
          />
        ) : (
          formatWeight(log.weight)
        )}
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {isEditing ? (
          <input
            type="number"
            value={editValues.bodyFat ?? ''}
            onChange={(e) => handleInputChange('bodyFat', e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
            step="0.1"
            min="3"
            max="50"
          />
        ) : (
          log.bodyFat?.toFixed(1) || '-'
        )}
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {isEditing ? (
          <input
            type="number"
            value={editValues.calories ?? ''}
            onChange={(e) => handleInputChange('calories', e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
          />
        ) : (
          log.calories?.toLocaleString() || '-'
        )}
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {isEditing ? (
          <input
            type="number"
            value={editValues.steps ?? ''}
            onChange={(e) => handleInputChange('steps', e.target.value)}
            className="w-20 sm:w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
          />
        ) : (
          log.steps?.toLocaleString() || '-'
        )}
      </td>
      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="text-green-600 hover:text-green-700"
            >
              <Save className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
            <button
              onClick={onCancel}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <Edit2 className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}