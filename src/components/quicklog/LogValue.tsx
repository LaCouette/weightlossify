import React from 'react';
import { Edit2 } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';
import { formatWeight } from '../../utils/weightFormatting';
import type { DailyLog } from '../../types';

interface LogValueProps {
  log: DailyLog;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
  unit: string;
  onEdit: () => void;
}

export function LogValue({ log, field, unit, onEdit }: LogValueProps) {
  const formatDisplayValue = (val: number | null) => {
    if (val === null) return '-';
    if (field === 'weight') {
      return formatWeight(val);
    }
    return val.toLocaleString();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <div className="text-2xl font-bold text-gray-900">
          {formatDisplayValue(log[field] as number)} {unit}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Logged at {formatDateTime(log.updatedAt || log.createdAt)}
        </div>
        {field === 'weight' && log.bodyFat && (
          <div className="text-sm text-indigo-600 mt-1">
            Body Fat: {log.bodyFat}%
          </div>
        )}
        {field === 'calories' && log.macros && (
          <div className="text-sm text-indigo-600 mt-1">
            P: {log.macros.proteins}g / F: {log.macros.fats}g / C: {log.macros.carbs}g
          </div>
        )}
        {field === 'steps' && log.distance && (
          <div className="text-sm text-indigo-600 mt-1">
            Distance: {log.distance} km
          </div>
        )}
      </div>
      <button
        onClick={onEdit}
        className="mt-3 w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Edit2 className="h-4 w-4" />
        <span>Update</span>
      </button>
    </div>
  );
}