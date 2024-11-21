import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Activity, Utensils, TrendingUp, TrendingDown, Target, Award, Zap } from 'lucide-react';
import type { DailyLog } from '../../../types';
import type { UserProfile } from '../../../types/profile';
import { calculateWeekSummary } from '../../../utils/weekCalculations';
import { formatWeight } from '../../../utils/weightFormatting';

interface WeekSummarySectionProps {
  weekLogs: DailyLog[];
  prevWeekLogs: DailyLog[];
  profile: UserProfile;
}

export function WeekSummarySection({
  weekLogs,
  prevWeekLogs,
  profile
}: WeekSummarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const summary = calculateWeekSummary(weekLogs, prevWeekLogs, profile);

  // Calculate completion rates
  const daysWithLogs = weekLogs.length;
  const completionRate = (daysWithLogs / 7) * 100;

  // Calculate goal achievement rates
  const calorieGoalAchievement = summary.avgCalories 
    ? (Math.abs(profile.dailyCaloriesTarget - summary.avgCalories) / profile.dailyCaloriesTarget) * 100
    : 0;
  const stepsGoalAchievement = summary.avgSteps
    ? (summary.avgSteps / profile.dailyStepsGoal) * 100
    : 0;

  // Calculate weight change percentage
  const weightChangePercentage = summary.weightChange && summary.avgWeight
    ? ((summary.weightChange / (summary.avgWeight - summary.weightChange)) * 100)
    : null;

  // Calculate average daily caloric balance
  const avgDailyBalance = summary.totalBalance / (daysWithLogs || 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Preview/Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">Week Summary</h3>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[
                  { color: 'bg-blue-500', complete: daysWithLogs >= 1 },
                  { color: 'bg-green-500', complete: daysWithLogs >= 2 },
                  { color: 'bg-yellow-500', complete: daysWithLogs >= 3 },
                  { color: 'bg-orange-500', complete: daysWithLogs >= 4 },
                  { color: 'bg-red-500', complete: daysWithLogs >= 5 },
                  { color: 'bg-purple-500', complete: daysWithLogs >= 6 },
                  { color: 'bg-indigo-500', complete: daysWithLogs >= 7 },
                ].map((day, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full border border-white ${
                      day.complete ? day.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {daysWithLogs} day{daysWithLogs !== 1 ? 's' : ''} logged
              </span>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Weight Progress */}
            {summary.avgWeight && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <div className="text-sm font-medium text-gray-900">Weight Progress</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatWeight(summary.avgWeight)} kg
                  </div>
                  {summary.weightChange && weightChangePercentage && (
                    <div className={`flex items-center gap-2 ${
                      summary.weightChange > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {summary.weightChange > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {weightChangePercentage > 0 ? '+' : ''}
                        {weightChangePercentage.toFixed(2)}% ({summary.weightChange > 0 ? '+' : ''}
                        {formatWeight(summary.weightChange)} kg)
                      </span>
                    </div>
                  )}
                  <div className="h-1 bg-gray-200 rounded-full mt-3">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(
                          ((summary.avgWeight - (profile.targetWeight || 0)) / summary.avgWeight) * 100, 
                          100
                        )}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Daily Averages */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-green-600" />
                <div className="text-sm font-medium text-gray-900">Daily Averages</div>
              </div>
              <div className="space-y-3">
                {summary.avgCalories && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Calories</span>
                      <span>{Math.round(summary.avgCalories).toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-orange-600 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((summary.avgCalories / profile.dailyCaloriesTarget) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
                {summary.avgSteps && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Steps</span>
                      <span>{Math.round(summary.avgSteps).toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-green-600 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((summary.avgSteps / profile.dailyStepsGoal) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Balance Impact */}
            {summary.totalBalance !== 0 && (
              <div className={`col-span-2 bg-gradient-to-br ${
                summary.totalBalance > 0 
                  ? 'from-red-50 to-orange-50 border-red-100' 
                  : 'from-green-50 to-emerald-50 border-green-100'
              } rounded-xl p-4 border`}>
                <div className="flex items-center gap-2 mb-3">
                  {summary.totalBalance > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  )}
                  <div className="text-sm font-medium text-gray-900">Weekly Impact</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className={`text-2xl font-bold ${
                      summary.totalBalance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {summary.totalBalance > 0 ? '+' : ''}
                      {Math.round(summary.totalBalance).toLocaleString()} kcal
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total caloric balance
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      avgDailyBalance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {avgDailyBalance > 0 ? '+' : ''}
                      {Math.round(avgDailyBalance).toLocaleString()} kcal
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Average daily balance
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      summary.totalBalance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {summary.estimatedWeightChange > 0 ? '+' : ''}
                      {summary.estimatedWeightChange.toFixed(2)} kg
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Estimated impact
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div className="text-sm font-medium text-gray-900">Completion</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(completionRate)}%
              </div>
              <div className="text-sm text-blue-700 mt-1">
                Week logged
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-green-600" />
                <div className="text-sm font-medium text-gray-900">Steps Goal</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(stepsGoalAchievement)}%
              </div>
              <div className="text-sm text-green-700 mt-1">
                Achievement rate
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <div className="text-sm font-medium text-gray-900">Calorie Goal</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(100 - calorieGoalAchievement)}%
              </div>
              <div className="text-sm text-orange-700 mt-1">
                Accuracy rate
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}