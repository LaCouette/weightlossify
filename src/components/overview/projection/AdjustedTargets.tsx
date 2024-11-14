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
      <h4 className="font-medium text-gray-900 mb-3">
        Adjusted Daily Targets
      </h4>

      {remainingTargets.calorieDeficitAdjustment && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Steps target adjusted to compensate for calorie deficit</p>
            <p className="mt-1">Added {remainingTargets.calorieDeficitAdjustment.additionalSteps.toLocaleString()} steps per day to match the calorie deficit.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {remainingTargets.calories !== null && remainingTargets.unplannedCalorieDays > 0 && (
          <div className={`rounded-xl p-4 border ${
            remainingTargets.calories <= projectionData.requiredDailyCalories! * 1.5
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
              : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-gray-600" />
              <div className="text-sm font-medium text-gray-900">Required Calories</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(remainingTargets.calories).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              per day for {remainingTargets.unplannedCalorieDays} day{remainingTargets.unplannedCalorieDays > 1 ? 's' : ''}
            </div>
          </div>
        )}

        {remainingTargets.steps !== null && remainingTargets.unplannedStepDays > 0 && (
          <div className={`rounded-xl p-4 border ${
            !remainingTargets.calorieDeficitAdjustment && remainingTargets.steps <= projectionData.requiredDailySteps! * 1.5
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-gray-600" />
              <div className="text-sm font-medium text-gray-900">Required Steps</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(remainingTargets.steps).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              per day for {remainingTargets.unplannedStepDays} day{remainingTargets.unplannedStepDays > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}