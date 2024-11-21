import React, { useState } from 'react';
import { LineChart, Calendar, Clock, Sun, Moon, TrendingUp, TrendingDown, Activity, Utensils, Scale } from 'lucide-react';
import type { DailyLog } from '../../types';
import type { UserProfile } from '../../types/profile';
import { analyzeCalories } from '../../utils/analytics/calorieAnalysis';
import { analyzeActivity } from '../../utils/analytics/activityAnalysis';
import { analyzeTrend } from '../../utils/analytics/trendAnalysis';

interface PatternAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type TimeRange = '1w' | '1m' | '3m' | 'all';

export function PatternAnalytics({ logs, profile }: PatternAnalyticsProps) {
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

  const filteredLogs = filterLogsByTimeRange(logs, timeRange);

  // Get analysis results
  const calorieAnalysis = analyzeCalories(filteredLogs, profile.dailyCaloriesTarget);
  const activityAnalysis = analyzeActivity(filteredLogs, profile.dailyStepsGoal);
  const trendAnalysis = analyzeTrend(filteredLogs);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
            <LineChart className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pattern Analysis</h2>
            <p className="text-sm text-gray-600">Discover trends in your habits and behavior</p>
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
                  ? 'bg-white shadow text-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weekday vs Weekend Analysis */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium text-gray-900">Weekly Patterns</h3>
          </div>
          
          <div className="space-y-6">
            {/* Calories Pattern */}
            {calorieAnalysis && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Calorie Intake</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Weekdays</div>
                    <div className="text-lg font-semibold text-amber-600">
                      {Math.round(calorieAnalysis.patterns.weekday)} kcal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">Weekends</div>
                    <div className="text-lg font-semibold text-amber-600">
                      {Math.round(calorieAnalysis.patterns.weekend)} kcal
                    </div>
                  </div>
                </div>
                {Math.abs(calorieAnalysis.patterns.difference) > 200 && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                    {calorieAnalysis.patterns.difference > 0 
                      ? '⚠️ Weekend calories tend to be higher'
                      : '📊 Weekday calories tend to be higher'}
                  </div>
                )}
              </div>
            )}

            {/* Activity Pattern */}
            {activityAnalysis && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Step Count</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Weekdays</div>
                    <div className="text-lg font-semibold text-amber-600">
                      {Math.round(activityAnalysis.patterns.weekday).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">Weekends</div>
                    <div className="text-lg font-semibold text-amber-600">
                      {Math.round(activityAnalysis.patterns.weekend).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                  Most active: {activityAnalysis.patterns.mostActiveDay}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trend Stability */}
        {trendAnalysis && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <h3 className="font-medium text-gray-900">Trend Stability</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Consistency Score</div>
                <div className="text-2xl font-bold text-amber-600">
                  {Math.round(trendAnalysis.consistency)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Confidence</span>
                  <span className={`font-medium ${
                    trendAnalysis.confidence === 'high' 
                      ? 'text-green-600' 
                      : trendAnalysis.confidence === 'medium'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}>
                    {trendAnalysis.confidence.charAt(0).toUpperCase() + trendAnalysis.confidence.slice(1)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      trendAnalysis.confidence === 'high'
                        ? 'bg-green-500'
                        : trendAnalysis.confidence === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${
                      trendAnalysis.confidence === 'high'
                        ? 100
                        : trendAnalysis.confidence === 'medium'
                        ? 66
                        : 33
                    }%` }}
                  />
                </div>
              </div>

              {trendAnalysis.plateauPeriods.length > 0 && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                  {trendAnalysis.plateauPeriods.length} plateau period{trendAnalysis.plateauPeriods.length !== 1 ? 's' : ''} detected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adherence Analysis */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium text-gray-900">Goal Adherence</h3>
          </div>
          
          <div className="space-y-4">
            {/* Calorie Goal */}
            {calorieAnalysis && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calorie Target</span>
                  <span className="font-medium text-amber-600">
                    {calorieAnalysis.adherenceRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${calorieAnalysis.adherenceRate}%` }}
                  />
                </div>
              </div>
            )}

            {/* Steps Goal */}
            {activityAnalysis && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Steps Goal</span>
                  <span className="font-medium text-amber-600">
                    {activityAnalysis.goalAchievementRate.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${activityAnalysis.goalAchievementRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5 text-amber-600" />
          <h3 className="font-medium text-gray-900">Key Insights</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {calorieAnalysis?.insights.map((insight, index) => (
            <div 
              key={`calorie-${index}`}
              className={`p-3 rounded-lg ${
                insight.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : insight.type === 'warning'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <p className="text-sm">{insight.message}</p>
              </div>
            </div>
          ))}

          {activityAnalysis?.insights.map((insight, index) => (
            <div 
              key={`activity-${index}`}
              className={`p-3 rounded-lg ${
                insight.type === 'success' 
                  ? 'bg-green-50 text-green-700' 
                  : insight.type === 'warning'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <p className="text-sm">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}