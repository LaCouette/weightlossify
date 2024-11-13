import React from 'react';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';
import type { DailyLog } from '../../types';
import { QuickLogWidget } from '../QuickLogWidget';
import { formatWeight } from '../../utils/weightFormatting';
import { calculateCurrentAverageWeight, calculatePreviousAverageWeight, getWeightChange } from '../../utils/weightCalculations';

interface WeightMetricProps {
  currentWeight: number;
  targetWeight?: number;
  logs: DailyLog[];
  dateRange: 'week' | 'month';
}

export function WeightMetric({ currentWeight, logs }: WeightMetricProps) {
  const weightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate current and previous week's average weights
  const currentWeekAverage = calculateCurrentAverageWeight(logs);
  const previousWeekAverage = calculatePreviousAverageWeight(logs);
  
  // Calculate week-over-week change if both averages exist
  const weekOverWeekChange = currentWeekAverage && previousWeekAverage
    ? getWeightChange(currentWeekAverage, previousWeekAverage)
    : null;

  // Get number of logs this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday
  weekStart.setHours(0, 0, 0, 0);
  
  const weekLogs = weightLogs.filter(log => new Date(log.date) >= weekStart);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Scale className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Weight Progress</h2>
      </div>

      <div className="space-y-6">
        {/* Current Week Average Weight */}
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {formatWeight(currentWeekAverage || currentWeight)} kg
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Current week average ({weekLogs.length} log{weekLogs.length !== 1 ? 's' : ''})
          </div>
        </div>

        {/* Week-over-Week Change */}
        {weekOverWeekChange && (
          <div className={`p-4 rounded-lg ${
            weekOverWeekChange.change > 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                weekOverWeekChange.change > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {weekOverWeekChange.change > 0 ? (
                  <TrendingUp className={`h-5 w-5 ${
                    weekOverWeekChange.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`} />
                ) : (
                  <TrendingDown className={`h-5 w-5 ${
                    weekOverWeekChange.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`} />
                )}
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  weekOverWeekChange.change > 0 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {weekOverWeekChange.change > 0 ? '+' : ''}
                  {weekOverWeekChange.change.toFixed(2)} kg
                  <span className="text-sm font-normal ml-1">
                    ({weekOverWeekChange.change > 0 ? '+' : ''}
                    {weekOverWeekChange.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className={`text-sm ${
                  weekOverWeekChange.change > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  vs last week ({formatWeight(previousWeekAverage!)} kg)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Log Widget */}
        <div className="pt-4 border-t">
          <QuickLogWidget
            icon={Scale}
            label="Log Weight"
            unit="kg"
            step={0.05}
            min={30}
            max={300}
            defaultValue={currentWeight}
            field="weight"
          />
        </div>
      </div>
    </div>
  );
}