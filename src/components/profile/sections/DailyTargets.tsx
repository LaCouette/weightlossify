import React from 'react';
import { Target, Activity, Scale } from 'lucide-react';
import { UserProfile } from '../../../types/profile';

interface DailyTargetsProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function DailyTargets({ profile, isEditing, onChange }: DailyTargetsProps) {
  // Calculate calorie adjustment based on goal
  const getCalorieAdjustment = () => {
    if (profile.primaryGoal === 'muscle_gain') {
      return `+${Math.round(profile.dailyCaloriesTarget * 0.075)} kcal surplus`;
    }
    if (profile.primaryGoal === 'weight_loss') {
      const deficit = profile.weeklyWeightGoal === '0.35' ? 350 : 600;
      return `-${deficit} kcal deficit`;
    }
    return 'maintenance';
  };

  const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 1000 && numValue <= 100000) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: numValue.toString()
        }
      });
    }
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 1200 && numValue <= 5000) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: numValue.toString()
        }
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Daily Targets</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Steps Target */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">Daily Steps Goal</label>
          </div>
          {isEditing ? (
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="dailyStepsGoal"
                value={profile.dailyStepsGoal?.toLocaleString() || ''}
                onChange={handleStepsChange}
                className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter steps (1,000 - 100,000)"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">steps</span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {profile.dailyStepsGoal?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500 mt-1">steps per day</div>
            </>
          )}
        </div>

        {/* Daily Calories Target */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-4 w-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">Daily Calories Target</label>
          </div>
          {isEditing ? (
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="dailyCaloriesTarget"
                value={profile.dailyCaloriesTarget?.toLocaleString() || ''}
                onChange={handleCaloriesChange}
                className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter calories (1,200 - 5,000)"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">kcal</span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {profile.dailyCaloriesTarget?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-500 mt-1">calories per day</div>
              <div className="text-sm text-orange-600 mt-2">
                ({getCalorieAdjustment()})
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
        <strong>Note:</strong> These targets are calculated based on your goals, activity level, and current metrics. 
        Adjust them if needed based on your progress and energy levels.
      </div>
    </div>
  );
}