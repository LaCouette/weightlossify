import React from 'react';
import { Scale, TrendingDown, TrendingUp, Info } from 'lucide-react';
import type { DailyLog } from '../../types';
import { QuickLogWidget } from '../QuickLogWidget';
import { formatWeight } from '../../utils/weightFormatting';
import { calculateCurrentAverageWeight, calculatePreviousAverageWeight, getWeightChange } from '../../utils/weightCalculations';
import { useUserStore } from '../../stores/userStore';

interface WeightMetricProps {
  currentWeight: number;
  targetWeight?: number;
  logs: DailyLog[];
  dateRange: 'week' | 'month';
}

export function WeightMetric({ currentWeight, logs, dateRange }: WeightMetricProps) {
  const { profile } = useUserStore();
  const isWeightLoss = profile?.primaryGoal === 'weight_loss' || 
    (profile?.dailyCaloriesTarget && profile?.dailyCaloriesTarget < (profile?.bmr * 1.2));
  const isMuscleGain = profile?.primaryGoal === 'muscle_gain' || 
    (profile?.dailyCaloriesTarget && profile?.dailyCaloriesTarget > (profile?.bmr * 1.2));

  const weightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMonthComparison = () => {
    if (weightLogs.length < 2) return null;

    // Get first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get first weight log of the month by sorting chronologically
    const monthLogs = weightLogs
      .filter(log => new Date(log.date) >= firstDayOfMonth)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const firstLog = monthLogs[0];
    if (!firstLog) return null;

    // Get current week's average weight
    const currentWeekAvg = calculateCurrentAverageWeight(logs);
    if (!currentWeekAvg) return null;

    return getWeightChange(currentWeekAvg, firstLog.weight!);
  };

  // Calculate current and previous week's average weights for week view
  const currentWeekAverage = calculateCurrentAverageWeight(logs);
  const previousWeekAverage = calculatePreviousAverageWeight(logs);
  
  // Calculate week-over-week change if both averages exist
  const weekOverWeekChange = currentWeekAverage && previousWeekAverage
    ? getWeightChange(currentWeekAverage, previousWeekAverage)
    : null;

  // Get month-over-month change
  const monthChange = dateRange === 'month' ? getMonthComparison() : null;

  // Get number of logs for the current period
  const periodStart = new Date();
  if (dateRange === 'week') {
    periodStart.setDate(periodStart.getDate() - periodStart.getDay() + 1); // Monday
  } else {
    periodStart.setDate(1); // First day of month
  }
  periodStart.setHours(0, 0, 0, 0);
  
  const periodLogs = weightLogs.filter(log => new Date(log.date) >= periodStart);

  // Display weight is either the current week's average or the latest weight
  const displayWeight = dateRange === 'week' 
    ? (currentWeekAverage || currentWeight)
    : (currentWeekAverage || weightLogs[0]?.weight || currentWeight);

  // Get first log of the month for comparison text
  const firstLogOfMonth = weightLogs
    .filter(log => new Date(log.date) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Scale className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Weight Progress</h2>
      </div>

      <div className="flex-1 space-y-6">
        {/* Current Period Average/Latest Weight */}
        <div>
          <div className="text-3xl font-bold text-gray-900">
            {formatWeight(displayWeight)} kg
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {dateRange === 'week' ? 'Current week average' : 'Current week average'} ({periodLogs.length} log{periodLogs.length !== 1 ? 's' : ''})
          </div>
        </div>

        {/* Period Change */}
        {((dateRange === 'week' && weekOverWeekChange) || 
          (dateRange === 'month' && monthChange)) && (
          <div className={`p-4 rounded-lg ${
            (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
              ? (isMuscleGain ? 'bg-green-50' : 'bg-red-50')
              : (isMuscleGain ? 'bg-red-50' : 'bg-green-50')
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
                  ? (isMuscleGain ? 'bg-green-100' : 'bg-red-100')
                  : (isMuscleGain ? 'bg-red-100' : 'bg-green-100')
              }`}>
                {(weekOverWeekChange?.change || monthChange?.change || 0) > 0 ? (
                  <TrendingUp className={`h-5 w-5 ${
                    (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
                      ? (isMuscleGain ? 'text-green-600' : 'text-red-600')
                      : (isMuscleGain ? 'text-red-600' : 'text-green-600')
                  }`} />
                ) : (
                  <TrendingDown className={`h-5 w-5 ${
                    (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
                      ? (isMuscleGain ? 'text-green-600' : 'text-red-600')
                      : (isMuscleGain ? 'text-red-600' : 'text-green-600')
                  }`} />
                )}
              </div>
              <div>
                <div className={`text-lg font-semibold ${
                  (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
                    ? (isMuscleGain ? 'text-green-700' : 'text-red-700')
                    : (isMuscleGain ? 'text-red-700' : 'text-green-700')
                }`}>
                  {(weekOverWeekChange?.percentage || monthChange?.percentage || 0) > 0 ? '+' : ''}
                  {(weekOverWeekChange?.percentage || monthChange?.percentage || 0).toFixed(1)}%
                  <span className="text-sm font-normal ml-1">
                    ({(weekOverWeekChange?.change || monthChange?.change || 0) > 0 ? '+' : ''}
                    {formatWeight(weekOverWeekChange?.change || monthChange?.change || 0)} kg)
                  </span>
                </div>
                <div className={`text-sm ${
                  (weekOverWeekChange?.change || monthChange?.change || 0) > 0 
                    ? (isMuscleGain ? 'text-green-600' : 'text-red-600')
                    : (isMuscleGain ? 'text-red-600' : 'text-green-600')
                }`}>
                  vs {dateRange === 'week' ? 'last week' : 'start of month'} (
                  {dateRange === 'week' 
                    ? formatWeight(previousWeekAverage!) 
                    : formatWeight(firstLogOfMonth?.weight!)} kg)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight Loss Tips */}
        {isWeightLoss && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg mt-0.5">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">
                  Healthy Weight Loss Target
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  0.5-1% of body weight per {dateRange === 'week' ? 'week' : '4 weeks'}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  This range helps preserve muscle mass while maintaining sustainable progress
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Muscle Gain Tips */}
        {isMuscleGain && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 rounded-lg mt-0.5">
                <Info className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">
                  Ideal Weekly Gain for Muscle Growth
                </div>
                <div className="text-sm text-green-700 mt-1">
                  0.25-0.5% of body weight per {dateRange === 'week' ? 'week' : '4 weeks'}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  This range supports lean muscle gains with minimal fat accumulation
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        
      {/* Quick Log Widget */}
      <div className="pt-4 mt-6 border-t">
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
  );
}