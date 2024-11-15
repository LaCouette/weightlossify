import React from 'react';
import { Calculator, Activity, Utensils } from 'lucide-react';

interface ProjectionData {
  remainingDays: number;
  requiredDailyCalories: number | null;
  requiredDailySteps: number | null;
  isCaloriesAchievable: boolean;
  isStepsAchievable: boolean;
}

interface WeekProjectionProps {
  data: ProjectionData;
}

export function WeekProjection({ data }: WeekProjectionProps) {
  if (data.remainingDays === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Calculator className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Targets Projection</h3>
          <p className="text-sm text-gray-600">
            Required daily averages for remaining {data.remainingDays} day{data.remainingDays > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Required Daily Calories */}
        {data.requiredDailyCalories !== null && (
          <div className={`rounded-xl p-4 border ${
            data.isCaloriesAchievable 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
              : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Utensils className={`h-4 w-4 ${
                data.isCaloriesAchievable ? 'text-green-600' : 'text-red-600'
              }`} />
              <div className={`text-sm font-medium ${
                data.isCaloriesAchievable ? 'text-green-900' : 'text-red-900'
              }`}>
                Required Calories
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              data.isCaloriesAchievable ? 'text-green-900' : 'text-red-900'
            }`}>
              {Math.round(data.requiredDailyCalories).toLocaleString()}
            </div>
            <div className={`text-sm mt-1 ${
              data.isCaloriesAchievable ? 'text-green-700' : 'text-red-700'
            }`}>
              per day
            </div>
          </div>
        )}

        {/* Required Daily Steps */}
        {data.requiredDailySteps !== null && (
          <div className={`rounded-xl p-4 border ${
            data.isStepsAchievable 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
              : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className={`h-4 w-4 ${
                data.isStepsAchievable ? 'text-green-600' : 'text-red-600'
              }`} />
              <div className={`text-sm font-medium ${
                data.isStepsAchievable ? 'text-green-900' : 'text-red-900'
              }`}>
                Required Steps
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              data.isStepsAchievable ? 'text-green-900' : 'text-red-900'
            }`}>
              {Math.round(data.requiredDailySteps).toLocaleString()}
            </div>
            <div className={`text-sm mt-1 ${
              data.isStepsAchievable ? 'text-green-700' : 'text-red-700'
            }`}>
              per day
            </div>
          </div>
        )}
      </div>

      {(!data.isCaloriesAchievable || !data.isStepsAchievable) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Note:</strong> Red indicators suggest the target might be challenging to achieve. 
          Consider adjusting your goals or increasing your daily activity.
        </div>
      )}
    </div>
  );
}