import React from 'react';
import { Scale, Activity, Utensils, TrendingUp, TrendingDown } from 'lucide-react';
import type { DailyLog } from '../../../../types';
import type { UserProfile } from '../../../../types/profile';
import { formatWeight } from '../../../../utils/weightFormatting';
import { calculateDayMetrics } from '../../../../utils/weekCalculations';

interface DailyLogCardProps {
  date: Date;
  log?: DailyLog;
  profile: UserProfile;
}

export function DailyLogCard({ date, log, profile }: DailyLogCardProps) {
  const isToday = date.toDateString() === new Date().toDateString();
  const metrics = calculateDayMetrics(log, profile);

  return (
    <div className={`border-b border-gray-200 last:border-b-0 p-4 ${
      isToday ? 'bg-indigo-50/30' : ''
    }`}>
      {/* Date Header */}
      <div className={`text-sm font-medium mb-3 ${
        isToday ? 'text-indigo-600' : 'text-gray-900'
      }`}>
        {date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })}
      </div>

      {metrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Weight */}
          {metrics.weight && (
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Scale className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Weight</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatWeight(metrics.weight)} kg
              </div>
            </div>
          )}

          {/* Steps */}
          {metrics.steps && (
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Steps</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {metrics.steps.toLocaleString()}
              </div>
            </div>
          )}

          {/* Calories */}
          {metrics.calories && (
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Utensils className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">Calories</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {metrics.calories.toLocaleString()}
              </div>
            </div>
          )}

          {/* Balance */}
          {metrics.calorieBalance && (
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                {metrics.calorieBalance > 0 ? (
                  <TrendingUp className="h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                )}
                <span className="text-xs text-gray-500">Balance</span>
              </div>
              <div className={`text-sm font-medium ${
                metrics.calorieBalance > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {metrics.calorieBalance > 0 ? '+' : ''}
                {Math.round(metrics.calorieBalance)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-center text-gray-500 py-2">
          No data logged
        </div>
      )}
    </div>
  );
}