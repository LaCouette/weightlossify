import React, { useState, useEffect } from 'react';
import { Activity, Scale, Calculator, Target } from 'lucide-react';
import { UserProfile } from '../../../../../types/profile';
import {
  calculateBMR,
  calculateBaseMaintenance,
  calculateNEAT,
  MAX_STEPS,
  CALORIES_PER_STEP
} from '../../../../../utils/calorieCalculations';
import { roundSteps, roundCalories } from '../../../../../utils/roundingRules';

interface CustomTargetAdjustmentProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
}

export function CustomTargetAdjustment({ profile, onChange }: CustomTargetAdjustmentProps) {
  const bmr = calculateBMR(
    profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );
  
  const baseMaintenance = calculateBaseMaintenance(bmr);
  const maxCalories = Math.round(baseMaintenance * 2);
  const minCalories = Math.round(baseMaintenance * 0.5);

  const [values, setValues] = useState({
    targetCalories: baseMaintenance,
    targetSteps: 8000,
    targetWeight: profile.targetWeight || undefined
  });

  useEffect(() => {
    onChange({
      dailyCaloriesTarget: values.targetCalories,
      dailyStepsGoal: values.targetSteps,
      primaryGoal: getGoalFromCalories(values.targetCalories, baseMaintenance),
      targetWeight: values.targetWeight
    });
  }, [values.targetCalories, values.targetSteps, values.targetWeight]);

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const currentChange = values.targetCalories - totalMaintenance;

  const getGoalFromCalories = (calories: number, maintenance: number): 'weight_loss' | 'maintenance' | 'muscle_gain' => {
    const difference = calories - maintenance;
    if (Math.abs(difference) < 100) return 'maintenance';
    return difference > 0 ? 'muscle_gain' : 'weight_loss';
  };

  const getExpectedWeightChange = (calorieChange: number): string => {
    const weeklyChange = (calorieChange * 7) / 7700; // kg per week
    if (Math.abs(weeklyChange) < 0.1) return 'Weight maintenance';
    return `${Math.abs(weeklyChange).toFixed(2)}kg ${weeklyChange > 0 ? 'gain' : 'loss'} per week`;
  };

  const isWeightLoss = currentChange < -100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
            <Calculator className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Custom Plan Builder</h3>
        <p className="text-sm text-gray-600">
          Experiment with different calorie and activity levels to create your perfect plan
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="text-center space-y-2">
          <div className="text-sm font-medium text-indigo-800">Your Maintenance Calories</div>
          <div className="text-3xl font-bold text-indigo-900">{Math.round(totalMaintenance)}</div>
          <div className="text-sm text-indigo-700">
            Base: {Math.round(baseMaintenance)} + Activity: {Math.round(neat)}
          </div>
        </div>
      </div>

      {/* Calories Slider */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-5 w-5 text-orange-600" />
          <h3 className="font-medium text-gray-900">Daily Calorie Target</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(values.targetCalories)}
            </div>
            <div className="text-sm text-gray-500">calories per day</div>
            <div className="text-sm font-medium mt-2" style={{
              color: currentChange > 100 ? '#16a34a' : 
                     currentChange < -100 ? '#dc2626' : 
                     '#4f46e5'
            }}>
              {currentChange > 100 ? `+${Math.round(currentChange)} cal surplus` :
               currentChange < -100 ? `${Math.round(currentChange)} cal deficit` :
               'Maintenance range'}
            </div>
          </div>

          <div className="relative pt-6 pb-2">
            <input
              type="range"
              min={minCalories}
              max={maxCalories}
              value={values.targetCalories}
              onChange={(e) => setValues(prev => ({
                ...prev,
                targetCalories: Number(e.target.value)
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              step="50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{minCalories}</span>
              <span>{maxCalories}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Slider */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-gray-900">Daily Steps Target</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {values.targetSteps.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">steps per day</div>
            <div className="text-sm text-green-600 mt-1">
              (+{Math.round(neat)} kcal from activity)
            </div>
          </div>

          <div className="relative pt-6 pb-2">
            <input
              type="range"
              min={0}
              max={MAX_STEPS}
              value={values.targetSteps}
              onChange={(e) => setValues(prev => ({
                ...prev,
                targetSteps: Number(e.target.value)
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              step="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0</span>
              <span>{MAX_STEPS.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Weight (Optional, only shown for weight loss) */}
      {isWeightLoss && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Target Weight (Optional)</h3>
              <p className="text-sm text-gray-500 mt-1">Set a target weight to track your progress</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                value={values.targetWeight || ''}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  setValues(prev => ({
                    ...prev,
                    targetWeight: value
                  }));
                }}
                placeholder="Enter target weight"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={Math.max(40, profile.currentWeight * 0.5)}
                max={profile.currentWeight - 0.5}
                step="0.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
            </div>
          </div>

          {values.targetWeight && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700">
                Total to lose: {(profile.currentWeight - values.targetWeight).toFixed(1)}kg
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expected Results */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <h4 className="font-semibold text-gray-900 mb-4">Expected Results</h4>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Weekly Change</div>
            <div className="text-lg font-semibold text-gray-900">
              {getExpectedWeightChange(currentChange)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">Recommended For</div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.abs(currentChange) < 100 && 'Maintaining current weight'}
              {currentChange >= 100 && currentChange <= 300 && 'Lean muscle gain'}
              {currentChange > 300 && 'Aggressive muscle gain'}
              {currentChange <= -100 && currentChange >= -500 && 'Moderate weight loss'}
              {currentChange < -500 && 'Aggressive weight loss'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}