import React from 'react';
import { AlertCircle } from 'lucide-react';
import { WEIGHT_STEP } from '../../utils/weightFormatting';
import type { DailyLog } from '../../types';

interface LogFormProps {
  value: number | null;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
  unit: string;
  step: number;
  min: number;
  max: number;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  onChange: (value: number | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function LogForm({
  value,
  field,
  unit,
  step,
  min,
  max,
  isLoading,
  error,
  isEditing,
  onChange,
  onSubmit,
  onCancel
}: LogFormProps) {
  const inputStep = field === 'weight' ? WEIGHT_STEP : step;

  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            step={inputStep}
            min={min}
            max={max}
            disabled={isLoading}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            placeholder={`Enter ${field}`}
          />
          <span className="text-sm text-gray-500 flex-shrink-0">{unit}</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Log'}
        </button>
      </div>
    </form>
  );
}