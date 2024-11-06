import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLogsStore } from '../stores/logsStore';
import type { DailyLog } from '../types';

interface QuickLogWidgetProps {
  icon: LucideIcon;
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  defaultValue: number;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps' | 'sleep'>;
}

export function QuickLogWidget({
  icon: Icon,
  label,
  unit,
  step,
  min,
  max,
  defaultValue,
  field,
}: QuickLogWidgetProps) {
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const addLog = useLogsStore(state => state.addLog);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const logData: Partial<DailyLog> = {
        [field]: value,
      };

      if (field === 'sleep') {
        logData.sleep = {
          duration: value,
          quality: 3, // Default quality
        };
      }

      await addLog(user.uid, logData as DailyLog);
      setError(null);
    } catch (err) {
      setError('Failed to save log. Please try again.');
      console.error('Error logging value:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            step={step}
            min={min}
            max={max}
            disabled={isLoading}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
          />
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Log'}
        </button>
      </form>
    </div>
  );
}