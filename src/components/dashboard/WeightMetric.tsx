import React from 'react';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';
import type { DailyLog } from '../../types';
import { QuickLogWidget } from '../QuickLogWidget';
import { formatWeight, roundWeight } from '../../utils/weightFormatting';
import { calculateCurrentAverageWeight, getWeightChange } from '../../utils/weightCalculations';

interface WeightMetricProps {
  currentWeight: number;
  targetWeight?: number;
  logs: DailyLog[];
  dateRange: 'week' | 'month';
}

export function WeightMetric({ currentWeight, targetWeight, logs, dateRange }: WeightMetricProps) {
  const weightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate current week's average weight
  const averageWeight = calculateCurrentAverageWeight(logs) || roundWeight(currentWeight);
  
  // Get oldest log weight for comparison
  const oldestLogWeight = weightLogs.length > 0 
    ? roundWeight(Number(weightLogs[weightLogs.length - 1].weight)) 
    : roundWeight(Number(currentWeight));
  
  // Calculate weight change
  const { change: weightChange, percentage: weightChangePercent } = getWeightChange(averageWeight, oldestLogWeight);

  const progressToTarget = targetWeight
    ? ((currentWeight - targetWeight) / (oldestLogWeight - targetWeight)) * 100
    : 0;

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
        {/* Current Average Weight */}
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {formatWeight(averageWeight)} kg
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Current week average ({weekLogs.length} log{weekLogs.length !== 1 ? 's' : ''})
          </div>
          <div className="flex items-center gap-2 mt-2">
            {weightChange !== 0 && (
              <>
                {weightChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
                <span className={`text-sm font-medium ${
                  weightChange > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {Math.abs(weightChange).toFixed(2)} kg
                  ({Math.abs(weightChangePercent).toFixed(1)}%)
                </span>
                <span className="text-sm text-gray-500">
                  this {dateRange}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Target Progress */}
        {targetWeight && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress to target</span>
              <span>{Math.min(100, Math.max(0, progressToTarget)).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressToTarget))}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Target: {formatWeight(targetWeight)} kg</span>
              <span className="text-gray-500">
                {formatWeight(Math.abs(averageWeight - targetWeight))} kg to go
              </span>
            </div>
          </div>
        )}

        {/* Log Count */}
        <div className="text-sm text-gray-500">
          Based on {weightLogs.length} log{weightLogs.length !== 1 ? 's' : ''} this {dateRange}
        </div>

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