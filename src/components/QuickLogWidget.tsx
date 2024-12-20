import React, { useState, useEffect } from 'react';
import { LucideIcon, AlertCircle, Check, Edit2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLogsStore } from '../stores/logsStore';
import { useWeightStore } from '../stores/weightStore';
import { getTodayLog, formatDateTime } from '../utils/dateUtils';
import { formatWeight, parseWeight, WEIGHT_STEP } from '../utils/weightFormatting';
import type { DailyLog } from '../types';

interface QuickLogWidgetProps {
  icon: LucideIcon;
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  defaultValue: number;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
  onLogAdded?: () => void;
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
  onLogAdded
}: QuickLogWidgetProps) {
  const [value, setValue] = useState<number | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const { logs, addLog, updateLog } = useLogsStore();
  const updateCurrentWeight = useWeightStore(state => state.updateCurrentWeight);
  const todayLog = getTodayLog(logs);

  useEffect(() => {
    if (!isEditing && todayLog?.[field] !== undefined) {
      setValue(todayLog[field]);
    }
  }, [todayLog, field, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const logValue = field === 'weight' && value !== null ? parseWeight(value.toString()) : value;
      if (logValue === null && field === 'weight') {
        throw new Error('Invalid weight value');
      }

      if (todayLog) {
        // Update existing log
        await updateLog(user.uid, todayLog.id, {
          ...todayLog,
          [field]: logValue,
          updatedAt: new Date()
        });
      } else {
        // Create new log
        const newLog: Partial<DailyLog> = {
          [field]: logValue,
          date: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await addLog(user.uid, newLog);
      }

      // Update global weight state if this is a weight log
      if (field === 'weight' && typeof logValue === 'number') {
        updateCurrentWeight(logValue);
      }
      
      setIsEditing(false);
      setError(null);
      onLogAdded?.();
    } catch (err) {
      setError('Failed to save log. Please try again.');
      console.error('Error logging value:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setValue(todayLog?.[field] ?? null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(todayLog?.[field] ?? null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue === '' ? null : Number(inputValue));
  };

  const formatDisplayValue = (val: number | null) => {
    if (val === null) return '-';
    if (field === 'weight') {
      return formatWeight(val);
    }
    return val.toLocaleString();
  };

  const inputStep = field === 'weight' ? WEIGHT_STEP : step;

  const hasLoggedToday = todayLog?.[field] !== undefined && todayLog[field] !== null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
      </div>

      {hasLoggedToday && !isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatDisplayValue(todayLog[field] as number)} {unit}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Logged at {formatDateTime(todayLog.updatedAt || todayLog.createdAt)}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Update Today's {label}</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={value ?? ''}
              onChange={handleInputChange}
              step={inputStep}
              min={min}
              max={max}
              disabled={isLoading}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            />
            <span className="text-sm text-gray-500">{unit}</span>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Log'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}