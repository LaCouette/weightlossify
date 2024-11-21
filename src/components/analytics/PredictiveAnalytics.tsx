import React, { useState } from 'react';
import { Brain, TrendingDown, TrendingUp, Calendar, Info, Target, Scale, Activity, Utensils, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { DailyLog } from '../../types';
import type { UserProfile } from '../../types/profile';
import { formatWeight } from '../../utils/weightFormatting';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PredictiveAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type ProjectionRange = '1m' | '3m' | '6m';

export function PredictiveAnalytics({ logs, profile }: PredictiveAnalyticsProps) {
  const [projectionRange, setProjectionRange] = useState<ProjectionRange>('3m');

  // Get weight logs sorted by date
  const weightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate weekly rate of change
  const calculateWeeklyRate = () => {
    if (weightLogs.length < 2) return null;

    const firstWeight = weightLogs[0].weight!;
    const lastWeight = weightLogs[weightLogs.length - 1].weight!;
    const weightChange = lastWeight - firstWeight;
    const daysElapsed = (new Date(weightLogs[weightLogs.length - 1].date).getTime() - 
                        new Date(weightLogs[0].date).getTime()) / (1000 * 60 * 60 * 24);
    
    return (weightChange / daysElapsed) * 7;
  };

  const weeklyRate = calculateWeeklyRate();

  // Calculate projections
  const calculateProjections = () => {
    if (!weeklyRate || weightLogs.length === 0) return null;

    const currentWeight = weightLogs[weightLogs.length - 1].weight!;
    const monthsToProject = projectionRange === '1m' ? 1 : projectionRange === '3m' ? 3 : 6;
    const weeksToProject = monthsToProject * 4;
    
    const projectedWeights = Array.from({ length: weeksToProject + 1 }, (_, i) => ({
      week: i,
      weight: currentWeight + (weeklyRate * i)
    }));

    return projectedWeights;
  };

  const projections = calculateProjections();

  // Calculate time to goal
  const calculateTimeToGoal = () => {
    if (!weeklyRate || !profile.targetWeight || weightLogs.length === 0) return null;

    const currentWeight = weightLogs[weightLogs.length - 1].weight!;
    const remainingWeight = currentWeight - profile.targetWeight;
    
    if (Math.sign(remainingWeight) !== Math.sign(weeklyRate)) {
      return null; // Current trend is moving away from goal
    }

    const weeksToGoal = Math.abs(remainingWeight / weeklyRate);
    return {
      weeks: weeksToGoal,
      date: new Date(Date.now() + (weeksToGoal * 7 * 24 * 60 * 60 * 1000))
    };
  };

  const timeToGoal = calculateTimeToGoal();

  // Calculate calorie impact
  const calculateCalorieImpact = () => {
    if (!weeklyRate) return null;

    const weeklyCalories = weeklyRate * 7700; // 7700 calories per kg
    return {
      daily: weeklyCalories / 7,
      weekly: weeklyCalories
    };
  };

  const calorieImpact = calculateCalorieImpact();

  // Calculate trend stability
  const calculateTrendStability = () => {
    if (weightLogs.length < 14) return null; // Need at least 2 weeks of data

    const weeklyChanges = [];
    for (let i = 7; i < weightLogs.length; i += 7) {
      const weekStart = weightLogs[i - 7].weight!;
      const weekEnd = weightLogs[i].weight!;
      weeklyChanges.push(weekEnd - weekStart);
    }

    const avgChange = weeklyChanges.reduce((sum, change) => sum + change, 0) / weeklyChanges.length;
    const variance = weeklyChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / weeklyChanges.length;
    
    return {
      variance,
      isStable: variance < 0.25, // Less than 0.25kg variance is considered stable
      consistency: Math.max(0, 100 - (variance * 100)) // Convert to a 0-100 score
    };
  };

  const trendStability = calculateTrendStability();

  // Prepare chart data
  const chartData = {
    labels: projections?.map(p => `Week ${p.week}`) || [],
    datasets: [
      {
        label: 'Projected Weight',
        data: projections?.map(p => p.weight) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      ...(profile.targetWeight ? [{
        label: 'Target Weight',
        data: projections?.map(() => profile.targetWeight) || [],
        borderColor: 'rgb(34, 197, 94)',
        borderDash: [5, 5],
        tension: 0,
        fill: false
      }] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Weight: ${formatWeight(context.raw)} kg`
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
            <Brain className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Predictive Analysis</h2>
            <p className="text-sm text-gray-600">Weight projections based on current trends</p>
          </div>
        </div>

        {/* Projection Range Selector */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          {[
            { value: '1m', label: '1M' },
            { value: '3m', label: '3M' },
            { value: '6m', label: '6M' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setProjectionRange(value as ProjectionRange)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                projectionRange === value
                  ? 'bg-white shadow text-violet-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {weeklyRate ? (
        <>
          {/* Trend Summary */}
          <div className={`p-4 rounded-lg mb-6 ${
            weeklyRate < 0 
              ? 'bg-green-50 border border-green-100' 
              : 'bg-orange-50 border border-orange-100'
          }`}>
            <div className="flex items-center gap-2">
              {weeklyRate < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-orange-600" />
              )}
              <span className={`font-medium ${
                weeklyRate < 0 ? 'text-green-900' : 'text-orange-900'
              }`}>
                Current trend: {Math.abs(weeklyRate).toFixed(2)} kg per week
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-500" />
              <p className="text-sm text-indigo-700">
                This represents a {Math.abs(calorieImpact?.daily || 0).toFixed(0)} calorie {weeklyRate < 0 ? 'deficit' : 'surplus'} per day
              </p>
            </div>
            {timeToGoal && (
              <div className="mt-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" />
                <p className="text-sm text-indigo-700">
                  Estimated goal achievement: {timeToGoal.date.toLocaleDateString()} ({Math.ceil(timeToGoal.weeks)} weeks)
                </p>
              </div>
            )}
          </div>

          {/* Projection Chart */}
          <div className="h-[300px] mb-6">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Trend Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Trend Stability */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-violet-600" />
                <h3 className="font-semibold text-gray-900">Trend Stability</h3>
              </div>
              {trendStability ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consistency Score</span>
                    <span className="text-lg font-semibold text-violet-600">
                      {Math.round(trendStability.consistency)}%
                    </span>
                  </div>
                  <div className="h-2 bg-violet-100 rounded-full">
                    <div 
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${trendStability.consistency}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Your weight trend is {trendStability.isStable ? 'stable' : 'variable'}.{' '}
                    {trendStability.isStable 
                      ? 'This consistency helps make accurate predictions.'
                      : 'More consistency would improve prediction accuracy.'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Need at least 2 weeks of data to analyze trend stability.
                </p>
              )}
            </div>

            {/* Calorie Analysis */}
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="h-5 w-5 text-violet-600" />
                <h3 className="font-semibold text-gray-900">Calorie Impact</h3>
              </div>
              {calorieImpact && (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Daily Impact</div>
                    <div className="text-lg font-semibold text-violet-600">
                      {Math.abs(calorieImpact.daily).toFixed(0)} calories
                    </div>
                    <div className="text-sm text-gray-500">
                      per day {calorieImpact.daily < 0 ? 'deficit' : 'surplus'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Weekly Impact</div>
                    <div className="text-lg font-semibold text-violet-600">
                      {Math.abs(calorieImpact.weekly).toFixed(0)} calories
                    </div>
                    <div className="text-sm text-gray-500">
                      per week {calorieImpact.weekly < 0 ? 'deficit' : 'surplus'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-violet-600" />
              <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {weeklyRate < 0 && Math.abs(weeklyRate) > 1 && (
                <p>Your current rate of weight loss might be too aggressive. Consider increasing calories slightly for more sustainable progress.</p>
              )}
              {weeklyRate > 0 && Math.abs(weeklyRate) > 0.5 && (
                <p>Your current rate of weight gain might be faster than optimal. Consider reducing calories slightly to minimize fat gain.</p>
              )}
              {trendStability && !trendStability.isStable && (
                <p>Your weight fluctuations are higher than ideal. Focus on consistent daily habits for better progress tracking.</p>
              )}
              {timeToGoal && timeToGoal.weeks > 52 && (
                <p>Your current pace might take longer than ideal. Consider adjusting your approach for faster progress while staying healthy.</p>
              )}
              {Math.abs(weeklyRate || 0) < 0.2 && profile.targetWeight && (
                <p>Your current progress is slower than optimal. Review your calorie targets and activity levels to accelerate progress.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Insufficient Data</h3>
              <p className="text-sm text-yellow-700 mt-1">
                At least two weight logs are needed to generate predictions. Continue logging consistently for accurate forecasts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}