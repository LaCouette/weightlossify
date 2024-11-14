import React from 'react';
import { Scale, Activity, Utensils, TrendingUp, TrendingDown } from 'lucide-react';
import { formatWeight } from '../../utils/weightFormatting';
import { formatDateTime } from '../../utils/dateUtils';

interface DayMetrics {
  weight?: number;
  steps?: number;
  calories?: number;
  calorieBalance: number;
  updatedAt: Date;
}

interface DailyMetricCardProps {
  date: Date;
  metrics: DayMetrics | null;
}

export function DailyMetricCard({ date, metrics }: DailyMetricCardProps) {
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm border ${
        isToday ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : 'text-gray-600'}`}>
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
        {metrics && (
          <div className="text-xs text-gray-500">
            Last updated: {formatDateTime(metrics.updatedAt)}
          </div>
        )}
      </div>

      {metrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Scale className="h-4 w-4" />
              <span className="text-xs">Weight</span>
            </div>
            <div className="text-sm font-medium">
              {formatWeight(metrics.weight)} kg
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Steps</span>
            </div>
            <div className="text-sm font-medium">
              {metrics.steps?.toLocaleString() || '-'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Utensils className="h-4 w-4" />
              <span className="text-xs">Calories</span>
            </div>
            <div className="text-sm font-medium">
              {metrics.calories?.toLocaleString() || '-'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              {metrics.calorieBalance > 0 ? (
                <TrendingUp className="h-4 w-4 text-orange-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className="text-xs">Balance</span>
            </div>
            <div className={`text-sm font-medium ${
              metrics.calorieBalance > 0 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {metrics.calorieBalance > 0 ? '+' : ''}
              {Math.round(metrics.calorieBalance)}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center py-2">
          No data logged
        </div>
      )}
    </div>
  );
}