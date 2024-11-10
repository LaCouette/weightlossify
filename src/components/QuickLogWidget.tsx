import React, { useState, useEffect } from 'react';
import { LucideIcon, AlertCircle, Check, RotateCcw, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLogsStore } from '../stores/logsStore';
import { formatTime, getTomorrowDate, isToday } from '../utils/dateCalculations';
import type { DailyLog } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user } = useAuthStore();
  const { addLog, updateLog, getTodayLog, logs } = useLogsStore();
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const existingLog = getTodayLog(field);
    setTodayLog(existingLog);
    if (existingLog) {
      setValue(existingLog[field] as number);
    } else {
      setValue(defaultValue);
    }
  }, [field, getTodayLog, logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (value < min || value > max) {
      setError(`Value must be between ${min} and ${max}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (todayLog && isEditing) {
        await updateLog(user.uid, todayLog.id, { [field]: value });
        setShowSuccess(true);
      } else if (!todayLog) {
        await addLog(user.uid, { [field]: value });
        setShowSuccess(true);
      }

      onLogAdded?.();
      setIsEditing(false);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save log';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (todayLog) {
      setValue(todayLog[field] as number);
    } else {
      setValue(defaultValue);
    }
    setIsEditing(false);
    setError(null);
  };

  const tomorrow = getTomorrowDate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setValue(newValue);
              setError(null);
            }}
            step={step}
            min={min}
            max={max}
            disabled={isLoading || (todayLog && !isEditing)}
            className={`block w-full rounded-md shadow-sm text-lg
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
              disabled:bg-gray-50 disabled:text-gray-500 transition-all
              ${todayLog && !isEditing ? 'border-green-200' : 'border-gray-300'}`}
          />
          <span className="text-sm text-gray-500 min-w-[3rem]">{unit}</span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-2 text-red-600"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-2 text-green-600"
            >
              <Check className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">Successfully saved!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {todayLog && !isEditing ? (
          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-700">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Today's log complete</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm text-green-700 hover:text-green-800 flex items-center space-x-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Update</span>
              </button>
            </div>
            <div className="text-sm text-green-600">
              Last updated: {formatTime(todayLog.updatedAt || todayLog.createdAt)}
            </div>
            <div className="text-sm text-green-600">
              Next log available {formatTime(tomorrow)}
            </div>
          </div>
        ) : (
          <div className="flex space-x-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 
                  rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white 
                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-indigo-500 disabled:opacity-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || value < min || value > max}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Log' : 'Log for Today'}
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}