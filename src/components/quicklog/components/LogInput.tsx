import React from 'react';
import type { DailyLog } from '../../../types';

interface LogInputProps {
  value: number | null;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
  unit: string;
  step: number;
  min: number;
  max: number;
  isLoading: boolean;
  onChange: (value: number | null) => void;
}

export function LogInput({
  value,
  field,
  unit,
  step,
  min,
  max,
  isLoading,
  onChange
}: LogInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        step={step}
        min={min}
        max={max}
        disabled={isLoading}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
        placeholder={`Enter ${field}`}
      />
      <span className="text-sm text-gray-500 flex-shrink-0">{unit}</span>
    </div>
  );
}