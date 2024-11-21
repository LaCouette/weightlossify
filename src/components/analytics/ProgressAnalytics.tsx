import React, { useState } from 'react';
import { Target, Award, Zap, Trophy, Calendar, TrendingUp, TrendingDown, Scale, Activity, Utensils } from 'lucide-react';
import type { DailyLog } from '../../types';
import type { UserProfile } from '../../types/profile';
import { formatWeight } from '../../utils/weightFormatting';

interface ProgressAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
}

type TimeRange = '1w' | '1m' | '3m' | 'all';

export function ProgressAnalytics({ logs, profile }: ProgressAnalyticsProps) {
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

  // Get all logs sorted by date
  const allLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const filteredLogs = filterLogsByTimeRange(allLogs, timeRange);

  // Calculate progress towards target weight
  const calculateWeightProgress = () => {
    if (!profile.targetWeight || filteredLogs.length === 0) return null;

    const weightLogs = filteredLogs.filter(log => typeof log.weight === 'number');
    if (weightLogs.length === 0) return null;

    const startWeight = weightLogs[0].weight!;
    const currentWeight = weightLogs[weightLogs.length - 1].weight!;
    const totalToLose = startWeight - profile.targetWeight;
    const lost = startWeight - currentWeight;
    
    return {
      percentage: (lost / totalToLose) * 100,
      remaining: currentWeight - profile.targetWeight,
      totalLost: lost
    };
  };

  const weightProgress = calculateWeightProgress();

  // Calculate streaks
  const calculateStreaks = () => {
    const streaks = {
      weight: { current: 0, longest: 0 },
      calories: { current: 0, longest: 0 },
      steps: { current: 0, longest: 0 }
    };

    let currentStreaks = {
      weight: 0,
      calories: 0,
      steps: 0
    };

    filteredLogs.forEach((log, index) => {
      const prevDate = index > 0 ? new Date(filteredLogs[index - 1].date) : null;
      const date = new Date(log.date);
      const isConsecutive = prevDate 
        ? (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) === 1 
        : true;

      // Weight streak (any log counts)
      if (typeof log.weight === 'number') {
        if (isConsecutive) {
          currentStreaks.weight++;
        } else {
          currentStreaks.weight = 1;
        }
        streaks.weight.longest = Math.max(streaks.weight.longest, currentStreaks.weight);
      } else {
        currentStreaks.weight = 0;
      }

      // Calories streak (within target)
      if (typeof log.calories === 'number' && log.calories <= profile.dailyCaloriesTarget) {
        if (isConsecutive) {
          currentStreaks.calories++;
        } else {
          currentStreaks.calories = 1;
        }
        streaks.calories.longest = Math.max(streaks.calories.longest, currentStreaks.calories);
      } else {
        currentStreaks.calories = 0;
      }

      // Steps streak (meeting goal)
      if (typeof log.steps === 'number' && log.steps >= profile.dailyStepsGoal) {
        if (isConsecutive) {
          currentStreaks.steps++;
        } else {
          currentStreaks.steps = 1;
        }
        streaks.steps.longest = Math.max(streaks.steps.longest, currentStreaks.steps);
      } else {
        currentStreaks.steps = 0;
      }
    });

    // Set current streaks
    streaks.weight.current = currentStreaks.weight;
    streaks.calories.current = currentStreaks.calories;
    streaks.steps.current = currentStreaks.steps;

    return streaks;
  };

  const streaks = calculateStreaks();

  // Calculate goal achievement rates
  const calculateAchievementRates = () => {
    const weightLogs = filteredLogs.filter(log => typeof log.weight === 'number');
    const calorieLogs = filteredLogs.filter(log => typeof log.calories === 'number');
    const stepsLogs = filteredLogs.filter(log => typeof log.steps === 'number');

    return {
      weight: weightLogs.length > 0
        ? ((weightLogs[weightLogs.length - 1].weight! - weightLogs[0].weight!) < 0 ? 100 : 0)
        : 0,
      calories: calorieLogs.length > 0
        ? (calorieLogs.filter(log => (log.calories || 0) <= profile.dailyCaloriesTarget).length / calorieLogs.length) * 100
        : 0,
      steps: stepsLogs.length > 0
        ? (stepsLogs.filter(log => (log.steps || 0) >= profile.dailyStepsGoal).length / stepsLogs.length) * 100
        : 0
    };
  };

  const achievementRates = calculateAchievementRates();

  // Calculate milestones
  const calculateMilestones = () => {
    const milestones = [];
    const weightLogs = filteredLogs.filter(log => typeof log.weight === 'number');
    
    if (weightLogs.length >= 2) {
      const startWeight = weightLogs[0].weight!;
      const currentWeight = weightLogs[weightLogs.length - 1].weight!;
      const totalLoss = startWeight - currentWeight;

      if (totalLoss >= 1) {
        milestones.push({
          type: 'weight',
          value: totalLoss,
          description: `Lost ${totalLoss.toFixed(1)}kg`
        });
      }

      if (totalLoss >= 5) {
        milestones.push({
          type: 'achievement',
          value: 5,
          description: '5kg milestone reached!'
        });
      }

      if (totalLoss >= 10) {
        milestones.push({
          type: 'achievement',
          value: 10,
          description: '10kg milestone reached!'
        });
      }
    }

    const stepsLogs = filteredLogs.filter(log => typeof log.steps === 'number');
    const totalSteps = stepsLogs.reduce((sum, log) => sum + (log.steps || 0), 0);

    if (totalSteps >= 100000) {
      milestones.push({
        type: 'steps',
        value: totalSteps,
        description: `${Math.floor(totalSteps / 1000)}k total steps`
      });
    }

    if (streaks.steps.longest >= 7) {
      milestones.push({
        type: 'streak',
        value: streaks.steps.longest,
        description: `${streaks.steps.longest}-day step streak`
      });
    }

    return milestones;
  };

  const milestones = calculateMilestones();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Progress Overview</h2>
            <p className="text-sm text-gray-600">Track your achievements and milestones</p>
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
                  ? 'bg-white shadow text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weight Progress Card */}
        {weightProgress && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Weight Progress</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Progress to Goal</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.min(100, Math.max(0, weightProgress.percentage)).toFixed(1)}%
                </div>
              </div>
              <div className="h-2 bg-blue-100 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, weightProgress.percentage))}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                {weightProgress.remaining > 0 
                  ? `${formatWeight(weightProgress.remaining)} kg to go`
                  : 'Goal reached! 🎉'}
              </div>
              <div className="text-sm font-medium text-blue-600">
                Total lost: {formatWeight(Math.abs(weightProgress.totalLost))} kg
              </div>
            </div>
          </div>
        )}

        {/* Streaks Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Active Streaks</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Steps Goal</div>
                <div className="text-xl font-bold text-green-600">
                  {streaks.steps.current} days
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best: {streaks.steps.longest}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Calorie Target</div>
                <div className="text-xl font-bold text-green-600">
                  {streaks.calories.current} days
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best: {streaks.calories.longest}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Logging Streak</div>
                <div className="text-xl font-bold text-green-600">
                  {streaks.weight.current} days
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best: {streaks.weight.longest}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Rates Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Goal Achievement</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Steps Goal</span>
                <span className="font-medium text-purple-600">
                  {achievementRates.steps.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-purple-100 rounded-full mt-1">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${achievementRates.steps}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Calorie Target</span>
                <span className="font-medium text-purple-600">
                  {achievementRates.calories.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-purple-100 rounded-full mt-1">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${achievementRates.calories}%` }}
                />
              </div>
            </div>
            {weightProgress && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weight Goal</span>
                  <span className="font-medium text-purple-600">
                    {Math.min(100, Math.max(0, weightProgress.percentage)).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-purple-100 rounded-full mt-1">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, weightProgress.percentage))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      {milestones.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Recent Milestones</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100"
              >
                <div className="flex items-center gap-3">
                  {milestone.type === 'weight' && <Scale className="h-5 w-5 text-yellow-600" />}
                  {milestone.type === 'steps' && <Activity className="h-5 w-5 text-yellow-600" />}
                  {milestone.type === 'streak' && <Zap className="h-5 w-5 text-yellow-600" />}
                  {milestone.type === 'achievement' && <Trophy className="h-5 w-5 text-yellow-600" />}
                  <div>
                    <div className="font-medium text-gray-900">{milestone.description}</div>
                    <div className="text-sm text-gray-600">Keep up the great work! 🎉</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Days</div>
          <div className="text-xl font-bold text-gray-900">
            {filteredLogs.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Days tracked
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Consistency</div>
          <div className="text-xl font-bold text-gray-900">
            {((filteredLogs.length / (timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : filteredLogs.length)) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Logging rate
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Perfect Days</div>
          <div className="text-xl font-bold text-gray-900">
            {filteredLogs.filter(log => 
              (log.steps || 0) >= profile.dailyStepsGoal &&
              (log.calories || 0) <= profile.dailyCaloriesTarget &&
              typeof log.weight === 'number'
            ).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            All goals met
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Milestones</div>
          <div className="text-xl font-bold text-gray-900">
            {milestones.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Achievements earned
          </div>
        </div>
      </div>
    </div>
  );
}