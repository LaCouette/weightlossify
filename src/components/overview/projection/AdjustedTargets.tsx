import React from 'react';
import { Activity, Utensils, AlertTriangle, Target } from 'lucide-react';

interface RemainingTargets {
  calories: number | null;
  steps: number | null;
  unplannedCalorieDays: number;
  unplannedStepDays: number;
  calorieDeficitAdjustment?: {
    additionalSteps: number;
    totalSteps: number;
    days: number;
  } | null;
}

interface ProjectionData {
  requiredDailyCalories: number | null;
  requiredDailySteps: number | null;
}

interface AdjustedTargetsProps {
  remainingTargets: RemainingTargets;
  projectionData: ProjectionData;
}

export function AdjustedTargets({ remainingTargets, projectionData }: AdjustedTargetsProps) {
  if (!remainingTargets || (remainingTargets.unplannedCalorieDays <= 0 && remainingTargets.unplannedStepDays <= 0)) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-indigo-500" />
        <h4 className="font-medium text-gray-900">Adjusted Daily Goals</h4>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Based on your plans, here are your adjusted daily targets to stay on track with your weekly goals:
      </p>

      {remainingTargets.calorieDeficitAdjustment && (
        <div className="info-box mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Automatic Steps Adjustment</p>
              <p className="mt-1 text-sm">
                To compensate for the calorie deficit, we've added {remainingTargets.calorieDeficitAdjustment.additionalSteps.toLocaleString()} steps 
                to your daily target. This helps maintain your energy balance through increased activity.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {remainingTargets.calories !== null && remainingTargets.unplannedCalorieDays > 0 && (
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">
                <Utensils className="h-5 w-5 text-orange-600" />
              </div>
              <span className="metric-title">Target Daily Calories</span>
            </div>
            <div className="mt-4">
              <div className="metric-value">
                {Math.round(remainingTargets.calories).toLocaleString()}
              </div>
              <div className="metric-subtitle">
                average for next {remainingTargets.unplannedCalorieDays} day{remainingTargets.unplannedCalorieDays > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Stay close to this target to meet your weekly calorie goal
              </div>
            </div>
          </div>
        )}

        {remainingTargets.steps !== null && remainingTargets.unplannedStepDays > 0 && (
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <span className="metric-title">Target Daily Steps</span>
            </div>
            <div className="mt-4">
              <div className="metric-value">
                {Math.round(remainingTargets.steps).toLocaleString()}
              </div>
              <div className="metric-subtitle">
                average for next {remainingTargets.unplannedStepDays} day{remainingTargets.unplannedStepDays > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Aim for this daily target to achieve your activity goals
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}