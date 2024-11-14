import React from 'react';
import { Activity, Utensils, AlertTriangle } from 'lucide-react';

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
        <Activity className="h-4 w-4 text-indigo-500" />
        <h4 className="font-medium text-gray-900">Adjusted Daily Targets</h4>
      </div>

      {remainingTargets.calorieDeficitAdjustment && (
        <div className="info-box mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Steps target adjusted to compensate for calorie deficit</p>
              <p className="mt-1">Added {remainingTargets.calorieDeficitAdjustment.additionalSteps.toLocaleString()} steps per day to match the calorie deficit.</p>
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
              <span className="metric-title">Required Calories</span>
            </div>
            <div className="mt-4">
              <div className="metric-value">
                {Math.round(remainingTargets.calories).toLocaleString()}
              </div>
              <div className="metric-subtitle">
                per day for {remainingTargets.unplannedCalorieDays} day{remainingTargets.unplannedCalorieDays > 1 ? 's' : ''}
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
              <span className="metric-title">Required Steps</span>
            </div>
            <div className="mt-4">
              <div className="metric-value">
                {Math.round(remainingTargets.steps).toLocaleString()}
              </div>
              <div className="metric-subtitle">
                per day for {remainingTargets.unplannedStepDays} day{remainingTargets.unplannedStepDays > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}