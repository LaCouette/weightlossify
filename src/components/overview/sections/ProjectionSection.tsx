import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Activity, Utensils, Sliders } from 'lucide-react';
import { ProjectionContent } from './projection/ProjectionContent';
import { useProjectionCalculator } from '../../../hooks/useProjectionCalculator';
import { usePlannedDaysStore } from '../../../stores/plannedDaysStore';
import type { DailyLog } from '../../../types';
import type { UserProfile } from '../../../types/profile';

interface ProjectionSectionProps {
  weekLogs: DailyLog[];
  profile: UserProfile;
  weekStart: Date;
  selectedWeekOffset: number;
}

export function ProjectionSection({ 
  weekLogs, 
  profile, 
  weekStart,
  selectedWeekOffset
}: ProjectionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [adjustmentPercentage, setAdjustmentPercentage] = useState(0);
  const { plannedDays } = usePlannedDaysStore();

  // Calculate current totals
  const currentTotals = {
    calories: weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
    steps: weekLogs.reduce((sum, log) => sum + (log.steps || 0), 0)
  };

  const { calculateRemainingTargets } = useProjectionCalculator(
    profile.dailyCaloriesTarget * 7,
    profile.dailyStepsGoal * 7,
    currentTotals
  );

  // Get future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(weekStart);
  endOfWeek.setDate(weekStart.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const futureDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).filter(date => date >= today);

  const remainingTargets = calculateRemainingTargets(plannedDays, futureDates);

  // Only show for current week
  if (selectedWeekOffset !== 0) {
    return null;
  }

  // Calculate adjusted targets based on slider percentage
  const getAdjustedValue = (value: number) => {
    const adjustment = value * (adjustmentPercentage / 100);
    return Math.round(value + adjustment);
  };

  const adjustedCalories = remainingTargets?.calories 
    ? Math.round(getAdjustedValue(remainingTargets.calories) / 50) * 50 // Round to nearest 50
    : null;

  const adjustedSteps = remainingTargets?.steps 
    ? Math.round(getAdjustedValue(remainingTargets.steps) / 100) * 100 // Round to nearest 100
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Daily Targets Section - Always Visible */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Adjusted Daily Goals</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {isExpanded ? 'Hide Planner' : 'Show Planner'}
          </button>
        </div>

        {/* Target Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calories Target */}
          {adjustedCalories && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-4 w-4 text-orange-600" />
                <div className="text-sm font-medium text-gray-900">Daily Calories</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {adjustedCalories.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                for next {remainingTargets.unplannedCalorieDays} day{remainingTargets.unplannedCalorieDays !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Steps Target */}
          {adjustedSteps && (
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div className="text-sm font-medium text-gray-900">Daily Steps</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {adjustedSteps.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                for next {remainingTargets.unplannedStepDays} day{remainingTargets.unplannedStepDays !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Adjustment Slider */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-600" />
            <div className="text-sm font-medium text-gray-900">Adjust Targets</div>
          </div>

          <div className="relative pt-6 pb-2">
            <div className="relative h-4">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full shadow-inner" />
              <input
                type="range"
                min="-20"
                max="20"
                value={adjustmentPercentage}
                onChange={(e) => setAdjustmentPercentage(Number(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
                style={{
                  '--thumb-size': '2rem',
                  '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)'
                } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>-20%</span>
              <button
                onClick={() => setAdjustmentPercentage(0)}
                className={`text-sm font-medium ${
                  adjustmentPercentage === 0 ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Reset
              </button>
              <span>+20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Planner Section - Expandable */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <ProjectionContent
            weekLogs={weekLogs}
            profile={profile}
            weekStart={weekStart}
          />
        </div>
      )}
    </div>
  );
}