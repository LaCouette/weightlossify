import React, { useState } from 'react';
import { Activity, TrendingDown, TrendingUp, Calendar, Info, Zap, PieChart, BarChart2 } from 'lucide-react';
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

interface ActivityAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type TimeRange = '1w' | '1m' | '3m' | 'all';
type ViewMode = 'trend' | 'distribution' | 'patterns';

export function ActivityAnalytics({ logs, profile }: ActivityAnalyticsProps) {
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

  // Get steps logs sorted by date
  const allStepsLogs = logs
    .filter(log => typeof log.steps === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const stepsLogs = filterLogsByTimeRange(allStepsLogs, timeRange);

  // Calculate average daily steps
  const averageSteps = stepsLogs.length > 0
    ? Math.round(stepsLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / stepsLogs.length)
    : 0;

  // Calculate goal achievement rate
  const goalAchievementRate = stepsLogs.length > 0
    ? (stepsLogs.filter(log => (log.steps || 0) >= profile.dailyStepsGoal).length / stepsLogs.length) * 100
    : 0;

  // Calculate moving average
  const calculateMovingAverage = (days: number) => {
    if (stepsLogs.length < days) return null;
    
    const averages = [];
    for (let i = days - 1; i < stepsLogs.length; i++) {
      const slice = stepsLogs.slice(i - days + 1, i + 1);
      const average = slice.reduce((sum, log) => sum + (log.steps || 0), 0) / days;
      averages.push(Math.round(average));
    }
    return averages;
  };

  const movingAverage7 = calculateMovingAverage(7);

  // Calculate steps patterns
  const calculatePatterns = () => {
    const ranges = [
      { min: -Infinity, max: profile.dailyStepsGoal * 0.5, label: 'Very Low', color: 'rgba(239, 68, 68, 0.7)' },
      { min: profile.dailyStepsGoal * 0.5, max: profile.dailyStepsGoal * 0.8, label: 'Low', color: 'rgba(249, 115, 22, 0.7)' },
      { min: profile.dailyStepsGoal * 0.8, max: profile.dailyStepsGoal, label: 'Near Goal', color: 'rgba(234, 179, 8, 0.7)' },
      { min: profile.dailyStepsGoal, max: profile.dailyStepsGoal * 1.2, label: 'Goal+', color: 'rgba(34, 197, 94, 0.7)' },
      { min: profile.dailyStepsGoal * 1.2, max: Infinity, label: 'Overachiever', color: 'rgba(34, 197, 94, 0.9)' }
    ];

    const patterns = ranges.map(range => ({
      ...range,
      count: stepsLogs.filter(log => 
        (log.steps || 0) > range.min && (log.steps || 0) <= range.max
      ).length,
      percentage: stepsLogs.length > 0
        ? (stepsLogs.filter(log => 
            (log.steps || 0) > range.min && (log.steps || 0) <= range.max
          ).length / stepsLogs.length) * 100
        : 0
    }));

    return patterns;
  };

  const patterns = calculatePatterns();

  // Calculate weekday patterns
  const calculateWeekdayPatterns = () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays.map(day => {
      const dayLogs = stepsLogs.filter(log => 
        new Date(log.date).getDay() === weekdays.indexOf(day)
      );
      const avgSteps = dayLogs.length > 0
        ? Math.round(dayLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / dayLogs.length)
        : 0;
      return {
        day,
        avgSteps,
        count: dayLogs.length,
        achievement: avgSteps >= profile.dailyStepsGoal ? 'achieved' : 'missed',
        percentage: avgSteps / profile.dailyStepsGoal * 100
      };
    });
  };

  const weekdayPatterns = calculateWeekdayPatterns();

  // Calculate streak information
  const calculateStreaks = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStart: Date | null = null;
    let longestStart: Date | null = null;
    let longestEnd: Date | null = null;

    stepsLogs.forEach((log, index) => {
      const date = new Date(log.date);
      const prevDate = index > 0 ? new Date(stepsLogs[index - 1].date) : null;
      const isConsecutive = prevDate 
        ? (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) === 1 
        : true;

      if ((log.steps || 0) >= profile.dailyStepsGoal) {
        if (!currentStart) currentStart = date;
        if (isConsecutive) {
          currentStreak++;
        } else {
          currentStreak = 1;
          currentStart = date;
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          longestStart = currentStart;
          longestEnd = date;
        }
      } else {
        currentStreak = 0;
        currentStart = null;
      }
    });

    return {
      currentStreak,
      longestStreak,
      longestStart,
      longestEnd
    };
  };

  const streaks = calculateStreaks();

  // Prepare line chart data
  const lineChartData = {
    labels: stepsLogs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Steps',
        data: stepsLogs.map(log => log.steps),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Target',
        data: stepsLogs.map(() => profile.dailyStepsGoal),
        borderColor: 'rgb(99, 102, 241)',
        borderDash: [5, 5],
        tension: 0,
        fill: false
      },
      ...(movingAverage7 ? [{
        label: '7-day Average',
        data: [...Array(6).fill(null), ...movingAverage7],
        borderColor: 'rgb(249, 115, 22)',
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
      label: 'Average Steps',
      data: weekdayPatterns.map(p => p.avgSteps),
      backgroundColor: weekdayPatterns.map(p => 
        p.avgSteps >= profile.dailyStepsGoal
          ? 'rgba(34, 197, 94, 0.7)'
          : p.avgSteps >= profile.dailyStepsGoal * 0.8
          ? 'rgba(234, 179, 8, 0.7)'
          : 'rgba(239, 68, 68, 0.7)'
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
              return `${context.label}: ${value} days (${Math.round((value / stepsLogs.length) * 100)}%)`;
            }
            if (viewMode === 'patterns') {
              const pattern = weekdayPatterns[context.dataIndex];
              return [
                `Average: ${value.toLocaleString()} steps`,
                `${Math.round(pattern.percentage)}% of daily goal`,
                `Based on ${pattern.count} days`
              ];
            }
            return `${context.dataset.label}: ${value.toLocaleString()} steps`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: viewMode === 'distribution' ? 'Number of Days' : 'Steps'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Activity Analysis</h2>
            <p className="text-sm text-gray-600">Track your daily movement and patterns</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('trend')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'trend'
                  ? 'bg-white shadow text-green-600'
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
                  ? 'bg-white shadow text-green-600'
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
                  ? 'bg-white shadow text-green-600'
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
                    ? 'bg-white shadow text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Achievement Summary */}
      <div className="p-4 rounded-lg mb-6 bg-green-50 border border-green-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-900">
            {goalAchievementRate.toFixed(1)}% Goal Achievement Rate
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-600">
          {stepsLogs.filter(log => (log.steps || 0) >= profile.dailyStepsGoal).length} days reached your {profile.dailyStepsGoal.toLocaleString()} steps goal
        </p>
        {streaks.currentStreak > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-500" />
            <p className="text-sm text-indigo-700">
              Current streak: {streaks.currentStreak} day{streaks.currentStreak !== 1 ? 's' : ''} 🔥
            </p>
          </div>
        )}
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
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Activity Level Distribution</h3>
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

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Activity Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {patterns.find(p => p.label === 'Goal+' || p.label === 'Overachiever')?.percentage! >= 70 && (
                <p>Excellent consistency! You're exceeding your step goal most days.</p>
              )}
              {patterns.find(p => p.label === 'Very Low')?.percentage! >= 20 && (
                <p>Consider strategies to increase activity on your low-step days.</p>
              )}
              {patterns.find(p => p.label === 'Near Goal')?.percentage! >= 30 && (
                <p>You're often close to your goal - a small increase could lead to more achievements!</p>
              )}
              {patterns.find(p => p.label === 'Overachiever')?.percentage! >= 20 && (
                <p>Great work on your high-activity days! Consider maintaining this level more consistently.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'patterns' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Weekly Activity Patterns</h3>
            </div>
            <div className="space-y-2">
              {weekdayPatterns.map(pattern => (
                <div key={pattern.day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{pattern.day}</span>
                  <span className={`text-sm font-medium ${
                    pattern.avgSteps >= profile.dailyStepsGoal
                      ? 'text-green-600'
                      : pattern.avgSteps >= profile.dailyStepsGoal * 0.8
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {pattern.avgSteps.toLocaleString()} steps
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Pattern Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {weekdayPatterns.filter(p => p.achievement === 'achieved').length >= 5 && (
                <p>You consistently meet your step goal on most days of the week!</p>
              )}
              {weekdayPatterns.filter(p => p.percentage < 70).length >= 2 && (
                <p>Lower activity detected on {
                  weekdayPatterns
                    .filter(p => p.percentage < 70)
                    .map(p => p.day)
                    .join(', ')
                }.</p>
              )}
              {weekdayPatterns.filter(p => p.percentage >= 120).length >= 1 && (
                <p>You're most active on {
                  weekdayPatterns
                    .filter(p => p.percentage >= 120)
                    .map(p => p.day)
                    .join(', ')
                }!</p>
              )}
              {Math.max(...weekdayPatterns.map(p => p.avgSteps)) - Math.min(...weekdayPatterns.map(p => p.avgSteps)) > profile.dailyStepsGoal * 0.5 && (
                <p>Consider evening out your activity across the week for better consistency.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Average Steps</div>
          <div className="text-xl font-bold text-gray-900">
            {averageSteps.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Daily average
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Longest Streak</div>
          <div className="text-xl font-bold text-gray-900">
            {streaks.longestStreak} days
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Consecutive goal hits
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Most Active Day</div>
          <div className="text-xl font-bold text-gray-900">
            {Math.max(...stepsLogs.map(log => log.steps || 0)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Peak steps
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Goal Achievement</div>
          <div className="text-xl font-bold text-gray-900">
            {goalAchievementRate.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Days reaching goal
          </div>
        </div>
      </div>
    </div>
  );
}