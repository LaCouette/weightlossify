import React from 'react';
import { Scale, Activity, Utensils, TrendingUp, TrendingDown, Zap, Clock, X } from 'lucide-react';
import type { DailyLog } from '../../../../types';
import type { UserProfile } from '../../../../types/profile';
import { formatWeight } from '../../../../utils/weightFormatting';
import { calculateDayMetrics } from '../../../../utils/weekCalculations';
import { calculateGFlux } from '../../../../utils/gfluxCalculations';
import { usePlannedDaysStore } from '../../../../stores/plannedDaysStore';

interface DailyLogCardProps {
  date: Date;
  log?: DailyLog;
  profile: UserProfile;
}

export function DailyLogCard({ date, log, profile }: DailyLogCardProps) {
  const { plannedDays, updatePlannedDay, removePlannedDay } = usePlannedDaysStore();
  const isToday = date.toDateString() === new Date().toDateString();
  const metrics = calculateDayMetrics(log, profile);

  // Find planned values for this day
  const plannedDayIndex = plannedDays.findIndex(day => 
    day.date.toDateString() === date.toDateString()
  );
  const plannedDay = plannedDayIndex !== -1 ? plannedDays[plannedDayIndex] : undefined;

  // Calculate G-Flux if we have both calories and steps
  const gFlux = metrics?.calories && metrics?.steps 
    ? calculateGFlux(metrics.calories, metrics.steps)
    : null;

  // Get G-Flux color based on value
  const getGFluxColor = (value: number) => {
    if (value < 2000) return 'text-red-600 bg-red-50';
    if (value < 3000) return 'text-yellow-600 bg-yellow-50';
    if (value < 4000) return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  // Handle removing planned values
  const handleRemovePlannedValue = (type: 'calories' | 'steps') => {
    if (plannedDayIndex === -1) return;
    
    const updatedDay = { ...plannedDays[plannedDayIndex] };
    if (type === 'calories') {
      delete updatedDay.calories;
    } else {
      delete updatedDay.steps;
    }

    // If no values left, remove the entire planned day
    if (!updatedDay.calories && !updatedDay.steps) {
      removePlannedDay(plannedDayIndex);
    } else {
      updatePlannedDay(plannedDayIndex, updatedDay);
    }
  };

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

      {metrics || plannedDay ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Weight */}
          {metrics?.weight && (
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
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Steps</span>
            </div>
            <div className="space-y-1">
              {metrics?.steps && (
                <div className="text-sm font-medium text-gray-900">
                  {metrics.steps.toLocaleString()}
                </div>
              )}
              {plannedDay?.steps && !metrics?.steps && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-1 text-xs text-indigo-600">
                    <Clock className="h-3 w-3" />
                    <span>Planned: {plannedDay.steps.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePlannedValue('steps')}
                    className="text-gray-400 hover:text-red-500 p-0.5 rounded hover:bg-red-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Calories */}
          <div className="bg-gray-100 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Utensils className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Calories</span>
            </div>
            <div className="space-y-1">
              {metrics?.calories && (
                <div className="text-sm font-medium text-gray-900">
                  {metrics.calories.toLocaleString()}
                </div>
              )}
              {plannedDay?.calories && !metrics?.calories && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-1 text-xs text-indigo-600">
                    <Clock className="h-3 w-3" />
                    <span>Planned: {plannedDay.calories.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePlannedValue('calories')}
                    className="text-gray-400 hover:text-red-500 p-0.5 rounded hover:bg-red-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Balance */}
          {metrics?.calorieBalance && (
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

          {/* G-Flux */}
          {gFlux && (
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">G-Flux</span>
              </div>
              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium ${getGFluxColor(gFlux)}`}>
                {gFlux.toLocaleString()}
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