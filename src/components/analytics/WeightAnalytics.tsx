import React, { useState } from 'react';
import { Scale, TrendingDown, TrendingUp, Info, Calendar } from 'lucide-react';
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

interface WeightAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type TimeRange = '1w' | '1m' | '3m' | 'all';

export function WeightAnalytics({ logs, profile }: WeightAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');

  // Filter logs based on selected time range
  const filterLogsByTimeRange = (logs: DailyLog[], range: TimeRange): DailyLog[] => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (range) {
      case '1w':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return logs;
    }

    return logs.filter(log => new Date(log.date) >= cutoffDate);
  };

  // Get weight logs sorted by date
  const allWeightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const weightLogs = filterLogsByTimeRange(allWeightLogs, timeRange);

  // Calculate trends
  const calculateTrend = () => {
    if (weightLogs.length < 2) return null;

    const firstWeight = weightLogs[0].weight!;
    const lastWeight = weightLogs[weightLogs.length - 1].weight!;
    const weightChange = lastWeight - firstWeight;
    const daysElapsed = (new Date(weightLogs[weightLogs.length - 1].date).getTime() - 
                        new Date(weightLogs[0].date).getTime()) / (1000 * 60 * 60 * 24);
    
    return (weightChange / daysElapsed) * 7;
  };

  const weeklyTrend = calculateTrend();

  // Calculate time to goal
  const calculateTimeToGoal = () => {
    if (!weeklyTrend || !profile.targetWeight || weightLogs.length === 0) return null;

    const currentWeight = weightLogs[weightLogs.length - 1].weight!;
    const remainingWeight = currentWeight - profile.targetWeight;
    
    if (Math.sign(remainingWeight) !== Math.sign(weeklyTrend)) {
      return null; // Current trend is moving away from goal
    }

    const weeksToGoal = Math.abs(remainingWeight / weeklyTrend);
    return weeksToGoal;
  };

  const weeksToGoal = calculateTimeToGoal();

  // Calculate moving average
  const calculateMovingAverage = (days: number) => {
    if (weightLogs.length < days) return null;
    
    const averages = [];
    for (let i = days - 1; i < weightLogs.length; i++) {
      const slice = weightLogs.slice(i - days + 1, i + 1);
      const average = slice.reduce((sum, log) => sum + (log.weight || 0), 0) / days;
      averages.push(average);
    }
    return averages;
  };

  const movingAverage7 = calculateMovingAverage(7);

  // Prepare chart data
  const chartData = {
    labels: weightLogs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight',
        data: weightLogs.map(log => log.weight),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      ...(movingAverage7 ? [{
        label: '7-day Average',
        data: [...Array(6).fill(null), ...movingAverage7],
        borderColor: 'rgb(234, 88, 12)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0
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
          label: (context: any) => `${context.dataset.label}: ${formatWeight(context.raw)} kg`
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
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
            <Scale className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Weight Progress</h2>
            <p className="text-sm text-gray-600">Track your weight changes over time</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          {[
            { value: '1w', label: '1W' },
            { value: '1m', label: '1M' },
            { value: '3m', label: '3M' },
            { value: 'all', label: 'All' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value as TimeRange)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === value
                  ? 'bg-white shadow text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Trend Summary */}
      {weeklyTrend && (
        <div className={`p-4 rounded-lg mb-6 ${
          weeklyTrend < 0 
            ? 'bg-green-50 border border-green-100' 
            : 'bg-red-50 border border-red-100'
        }`}>
          <div className="flex items-center gap-2">
            {weeklyTrend < 0 ? (
              <TrendingDown className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingUp className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${
              weeklyTrend < 0 ? 'text-green-900' : 'text-red-900'
            }`}>
              {Math.abs(weeklyTrend).toFixed(2)} kg per week
            </span>
          </div>
          <p className="text-sm mt-1 text-gray-600">
            Average rate of {weeklyTrend < 0 ? 'loss' : 'gain'} over {weightLogs.length} days
          </p>
          {weeksToGoal && (
            <div className="mt-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-500" />
              <p className="text-sm text-indigo-700">
                At this rate, you'll reach your goal in approximately {Math.ceil(weeksToGoal)} weeks
              </p>
            </div>
          )}
        </div>
      )}

      {/* Weight Chart */}
      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Starting Weight</div>
          <div className="text-xl font-bold text-gray-900">
            {weightLogs.length > 0 ? formatWeight(weightLogs[0].weight!) : '-'} kg
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {weightLogs.length > 0 ? new Date(weightLogs[0].date).toLocaleDateString() : '-'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Current Weight</div>
          <div className="text-xl font-bold text-gray-900">
            {weightLogs.length > 0 ? formatWeight(weightLogs[weightLogs.length - 1].weight!) : '-'} kg
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {weightLogs.length > 0 ? new Date(weightLogs[weightLogs.length - 1].date).toLocaleDateString() : '-'}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Change</div>
          <div className={`text-xl font-bold ${
            weightLogs.length > 1 && weightLogs[weightLogs.length - 1].weight! < weightLogs[0].weight!
              ? 'text-green-600'
              : weightLogs.length > 1 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {weightLogs.length > 1 
              ? `${(weightLogs[weightLogs.length - 1].weight! - weightLogs[0].weight!).toFixed(1)} kg`
              : '-'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Over {weightLogs.length} days
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">7-Day Average</div>
          <div className="text-xl font-bold text-gray-900">
            {movingAverage7 && movingAverage7.length > 0
              ? formatWeight(movingAverage7[movingAverage7.length - 1])
              : '-'} kg
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last 7 days trend
          </div>
        </div>
      </div>
    </div>
  );
}