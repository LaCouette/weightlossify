import React, { useState } from 'react';
import { Utensils, TrendingDown, TrendingUp, Calendar, Info, Zap, PieChart, BarChart2 } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { DailyLog } from '../../types';
import type { UserProfile } from '../../types/profile';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CalorieAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type TimeRange = '1w' | '1m' | '3m' | 'all';
type ViewMode = 'trend' | 'distribution' | 'patterns';

export function CalorieAnalytics({ logs, profile }: CalorieAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [viewMode, setViewMode] = useState<ViewMode>('trend');

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

  // Get calorie logs sorted by date
  const allCalorieLogs = logs
    .filter(log => typeof log.calories === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const calorieLogs = filterLogsByTimeRange(allCalorieLogs, timeRange);

  // Calculate average daily calories
  const averageCalories = calorieLogs.length > 0
    ? Math.round(calorieLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / calorieLogs.length)
    : 0;

  // Calculate deficit/surplus trend
  const calorieBalance = averageCalories - profile.dailyCaloriesTarget;

  // Calculate moving average
  const calculateMovingAverage = (days: number) => {
    if (calorieLogs.length < days) return null;
    
    const averages = [];
    for (let i = days - 1; i < calorieLogs.length; i++) {
      const slice = calorieLogs.slice(i - days + 1, i + 1);
      const average = slice.reduce((sum, log) => sum + (log.calories || 0), 0) / days;
      averages.push(Math.round(average));
    }
    return averages;
  };

  const movingAverage7 = calculateMovingAverage(7);

  // Calculate calorie patterns
  const calculatePatterns = () => {
    const ranges = [
      { min: -Infinity, max: profile.dailyCaloriesTarget * 0.7, label: 'Very Low', color: 'rgba(34, 197, 94, 0.9)' },
      { min: profile.dailyCaloriesTarget * 0.7, max: profile.dailyCaloriesTarget * 0.9, label: 'Low', color: 'rgba(34, 197, 94, 0.7)' },
      { min: profile.dailyCaloriesTarget * 0.9, max: profile.dailyCaloriesTarget * 1.1, label: 'On Target', color: 'rgba(99, 102, 241, 0.7)' },
      { min: profile.dailyCaloriesTarget * 1.1, max: profile.dailyCaloriesTarget * 1.3, label: 'High', color: 'rgba(249, 115, 22, 0.7)' },
      { min: profile.dailyCaloriesTarget * 1.3, max: Infinity, label: 'Very High', color: 'rgba(249, 115, 22, 0.9)' }
    ];

    const patterns = ranges.map(range => ({
      ...range,
      count: calorieLogs.filter(log => 
        (log.calories || 0) > range.min && (log.calories || 0) <= range.max
      ).length,
      percentage: calorieLogs.length > 0
        ? (calorieLogs.filter(log => 
            (log.calories || 0) > range.min && (log.calories || 0) <= range.max
          ).length / calorieLogs.length) * 100
        : 0
    }));

    return patterns;
  };

  const patterns = calculatePatterns();

  // Calculate weekday patterns
  const calculateWeekdayPatterns = () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays.map(day => {
      const dayLogs = calorieLogs.filter(log => 
        new Date(log.date).getDay() === weekdays.indexOf(day)
      );
      const avgCalories = dayLogs.length > 0
        ? Math.round(dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / dayLogs.length)
        : 0;
      return {
        day,
        avgCalories,
        count: dayLogs.length,
        difference: avgCalories - profile.dailyCaloriesTarget
      };
    });
  };

  const weekdayPatterns = calculateWeekdayPatterns();

  // Prepare line chart data
  const lineChartData = {
    labels: calorieLogs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Calories',
        data: calorieLogs.map(log => log.calories),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Target',
        data: calorieLogs.map(() => profile.dailyCaloriesTarget),
        borderColor: 'rgb(99, 102, 241)',
        borderDash: [5, 5],
        tension: 0,
        fill: false
      },
      ...(movingAverage7 ? [{
        label: '7-day Average',
        data: [...Array(6).fill(null), ...movingAverage7],
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        pointRadius: 0
      }] : [])
    ]
  };

  // Prepare distribution chart data
  const distributionData = {
    labels: patterns.map(p => p.label),
    datasets: [{
      label: 'Days',
      data: patterns.map(p => p.count),
      backgroundColor: patterns.map(p => p.color)
    }]
  };

  // Prepare weekday patterns chart data
  const weekdayData = {
    labels: weekdayPatterns.map(p => p.day),
    datasets: [{
      label: 'Average Calories',
      data: weekdayPatterns.map(p => p.avgCalories),
      backgroundColor: weekdayPatterns.map(p => 
        Math.abs(p.difference) <= profile.dailyCaloriesTarget * 0.1
          ? 'rgba(99, 102, 241, 0.7)'
          : p.difference < 0
          ? 'rgba(34, 197, 94, 0.7)'
          : 'rgba(249, 115, 22, 0.7)'
      )
    }]
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
          label: (context: any) => {
            const value = context.raw;
            if (viewMode === 'distribution') {
              return `${context.label}: ${value} days (${Math.round((value / calorieLogs.length) * 100)}%)`;
            }
            if (viewMode === 'patterns') {
              const pattern = weekdayPatterns[context.dataIndex];
              return [
                `Average: ${value.toLocaleString()} kcal`,
                `Difference from target: ${pattern.difference > 0 ? '+' : ''}${pattern.difference} kcal`,
                `Based on ${pattern.count} days`
              ];
            }
            return `${context.dataset.label}: ${value.toLocaleString()} kcal`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: viewMode === 'distribution' ? 'Number of Days' : 'Calories'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
            <Utensils className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Calorie Analysis</h2>
            <p className="text-sm text-gray-600">Track your calorie intake and patterns</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('trend')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'trend'
                  ? 'bg-white shadow text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Trend</span>
            </button>
            <button
              onClick={() => setViewMode('distribution')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'distribution'
                  ? 'bg-white shadow text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>Distribution</span>
            </button>
            <button
              onClick={() => setViewMode('patterns')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'patterns'
                  ? 'bg-white shadow text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Patterns</span>
            </button>
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
                    ? 'bg-white shadow text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calorie Balance Summary */}
      <div className={`p-4 rounded-lg mb-6 ${
        calorieBalance < 0 
          ? 'bg-green-50 border border-green-100' 
          : 'bg-orange-50 border border-orange-100'
      }`}>
        <div className="flex items-center gap-2">
          {calorieBalance < 0 ? (
            <TrendingDown className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingUp className="h-5 w-5 text-orange-600" />
          )}
          <span className={`font-medium ${
            calorieBalance < 0 ? 'text-green-900' : 'text-orange-900'
          }`}>
            {Math.abs(calorieBalance)} kcal {calorieBalance < 0 ? 'deficit' : 'surplus'} per day
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-600">
          Average over {calorieLogs.length} days
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-500" />
          <p className="text-sm text-indigo-700">
            This {calorieBalance < 0 ? 'deficit' : 'surplus'} could lead to approximately{' '}
            {Math.abs((calorieBalance * 7) / 7700).toFixed(2)}kg {calorieBalance < 0 ? 'loss' : 'gain'} per week
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        {viewMode === 'trend' && <Line data={lineChartData} options={chartOptions} />}
        {viewMode === 'distribution' && <Bar data={distributionData} options={chartOptions} />}
        {viewMode === 'patterns' && <Bar data={weekdayData} options={chartOptions} />}
      </div>

      {/* Pattern Analysis */}
      {viewMode === 'distribution' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-gray-900">Calorie Range Analysis</h3>
            </div>
            <div className="space-y-2">
              {patterns.map(pattern => (
                <div key={pattern.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{pattern.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {pattern.percentage.toFixed(1)}% ({pattern.count} days)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-gray-900">Key Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {patterns.find(p => p.label === 'On Target')?.percentage! >= 70 && (
                <p>Great consistency! You're staying on target most of the time.</p>
              )}
              {patterns.find(p => p.label === 'Very High')?.percentage! >= 20 && (
                <p>Consider strategies to reduce high-calorie days.</p>
              )}
              {patterns.find(p => p.label === 'Very Low')?.percentage! >= 20 && (
                <p>Watch out for very low calorie days to maintain sustainable progress.</p>
              )}
              {patterns.find(p => p.label === 'On Target')?.percentage! < 50 && (
                <p>Focus on consistency to increase your on-target days.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'patterns' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-gray-900">Weekly Patterns</h3>
            </div>
            <div className="space-y-2">
              {weekdayPatterns.map(pattern => (
                <div key={pattern.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{pattern.day}</span>
                  <span className={`text-sm font-medium ${
                    Math.abs(pattern.difference) <= profile.dailyCaloriesTarget * 0.1
                      ? 'text-indigo-600'
                      : pattern.difference < 0
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}>
                    {pattern.difference > 0 ? '+' : ''}{pattern.difference} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-gray-900">Pattern Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {weekdayPatterns.some(p => p.difference > profile.dailyCaloriesTarget * 0.2) && (
                <p>Higher calorie intake detected on {
                  weekdayPatterns
                    .filter(p => p.difference > profile.dailyCaloriesTarget * 0.2)
                    .map(p => p.day)
                    .join(', ')
                }.</p>
              )}
              {weekdayPatterns.some(p => p.difference < -profile.dailyCaloriesTarget * 0.2) && (
                <p>Lower calorie intake observed on {
                  weekdayPatterns
                    .filter(p => p.difference < -profile.dailyCaloriesTarget * 0.2)
                    .map(p => p.day)
                    .join(', ')
                }.</p>
              )}
              {weekdayPatterns.filter(p => Math.abs(p.difference) <= profile.dailyCaloriesTarget * 0.1).length >= 5 && (
                <p>You maintain consistent intake across most weekdays.</p>
              )}
              {Math.max(...weekdayPatterns.map(p => p.difference)) - Math.min(...weekdayPatterns.map(p => p.difference)) > profile.dailyCaloriesTarget * 0.3 && (
                <p>Consider evening out your intake across the week for better consistency.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Average Intake</div>
          <div className="text-xl font-bold text-gray-900">
            {averageCalories.toLocaleString()} kcal
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Daily average
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Target</div>
          <div className="text-xl font-bold text-gray-900">
            {profile.dailyCaloriesTarget.toLocaleString()} kcal
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Daily target
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Highest Day</div>
          <div className="text-xl font-bold text-gray-900">
            {Math.max(...calorieLogs.map(log => log.calories || 0)).toLocaleString()} kcal
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Peak intake
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">On Target Days</div>
          <div className="text-xl font-bold text-gray-900">
            {patterns.find(p => p.label === 'On Target')?.percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Within ±10% of target
          </div>
        </div>
      </div>
    </div>
  );
}