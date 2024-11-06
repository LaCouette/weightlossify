import React, { useState, useEffect } from 'react';
import { FormData } from '../../../types/profile';
import { calculateTDEE, calculateBMR, calculateMacros } from '../../../utils/profileCalculations';
import { Activity, Scale } from 'lucide-react';

// Constants
const CALORIES_PER_KG = 7700;
const CALORIES_PER_STEP = 0.045;
const DIET_ADJUSTMENT_RATIO = 0.60;
const ACTIVITY_ADJUSTMENT_RATIO = 0.40;

interface Step5Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step5({ formData, onChange }: Step5Props) {
  const [stepAdjustment, setStepAdjustment] = useState(0);
  const [calorieAdjustment, setCalorieAdjustment] = useState(0);
  const [selectedMacroSplit, setSelectedMacroSplit] = useState<'moderate' | 'low' | 'high'>('moderate');

  // Calculate base values
  const bmr = calculateBMR(
    Number(formData.currentWeight),
    Number(formData.height),
    Number(formData.age),
    formData.gender
  );
  const tdee = calculateTDEE(bmr, formData.activityLevel);
  
  // Determine if weight loss or muscle gain
  const isWeightLoss = formData.primaryGoal === 'weight_loss';
  const isMuscleGain = formData.primaryGoal === 'muscle_gain';
  
  // Calculate daily caloric change needed based on weekly goal
  const weeklyChange = Number(formData.weeklyWeightGoal) || 0;
  const dailyCalorieChange = (weeklyChange * CALORIES_PER_KG) / 7;
  
  // Calculate caloric split between diet and activity
  const dietCalorieAdjustment = dailyCalorieChange * DIET_ADJUSTMENT_RATIO;
  const activityCalorieAdjustment = dailyCalorieChange * ACTIVITY_ADJUSTMENT_RATIO;

  // Calculate baseline steps based on activity level
  const baselineSteps = formData.activityLevel === 'sedentary' ? 5000 :
    formData.activityLevel === 'light' ? 7500 :
    formData.activityLevel === 'moderate' ? 10000 :
    formData.activityLevel === 'very' ? 12500 : 15000;

  // Calculate initial targets
  const initialCalorieTarget = tdee + (isMuscleGain ? Math.abs(dietCalorieAdjustment) : -Math.abs(dietCalorieAdjustment));
  const initialStepGoal = baselineSteps + (activityCalorieAdjustment / CALORIES_PER_STEP);

  // Calculate current targets with user adjustments
  const currentCalorieTarget = initialCalorieTarget + calorieAdjustment;
  const currentStepGoal = Math.max(1000, Math.round(initialStepGoal + stepAdjustment));

  // Calculate macros based on current calorie target
  const macros = calculateMacros(currentCalorieTarget, selectedMacroSplit);

  // Update form data when values change
  useEffect(() => {
    onChange({
      target: {
        name: 'dailyCalorieTarget',
        value: currentCalorieTarget.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: {
        name: 'dailyStepGoal',
        value: currentStepGoal.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [currentCalorieTarget, currentStepGoal]);

  const handleStepAdjustment = (newStepGoal: number) => {
    const stepDiff = newStepGoal - initialStepGoal;
    setStepAdjustment(stepDiff);

    // Calculate calorie impact
    const calorieChange = stepDiff * CALORIES_PER_STEP;
    
    if (isWeightLoss) {
      // For weight loss: more steps = can eat more while maintaining deficit
      setCalorieAdjustment(calorieChange);
    } else if (isMuscleGain) {
      // For muscle gain: more steps = need more calories to maintain surplus
      setCalorieAdjustment(calorieChange);
    }
  };

  const handleCalorieAdjustment = (newCalorieTarget: number) => {
    const calorieDiff = newCalorieTarget - initialCalorieTarget;
    setCalorieAdjustment(calorieDiff);

    // Calculate required step adjustment
    const requiredStepChange = calorieDiff / CALORIES_PER_STEP;
    setStepAdjustment(requiredStepChange);
  };

  const handleMacroSplitChange = (split: 'moderate' | 'low' | 'high') => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectedMacroSplit(split);
  };

  return (
    <div className="space-y-8">
      {/* Daily Goals Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Daily Goals</h3>
        
        {/* Fixed Calorie Deficit/Surplus Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
          <p className="text-lg font-medium text-gray-900">
            Target {isWeightLoss ? 'Deficit' : 'Surplus'}:{' '}
            <span className="font-bold text-indigo-600">
              {Math.abs(Math.round(dailyCalorieChange))} calories per day
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Expected weight {isWeightLoss ? 'loss' : 'gain'}: {Math.abs(weeklyChange)} kg per week
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p>Diet adjustment: {Math.abs(Math.round(dietCalorieAdjustment))} calories</p>
            <p>Activity adjustment: {Math.abs(Math.round(activityCalorieAdjustment))} calories</p>
          </div>
        </div>

        {/* Targets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Daily Calorie Target */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              <h4 className="text-lg font-semibold text-gray-900">Your Daily Calorie Target</h4>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-bold text-indigo-600">
                {Math.round(currentCalorieTarget)}
              </p>
              <p className="text-xl text-indigo-600">calories</p>
            </div>
          </div>

          {/* Daily Steps Goal */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h4 className="text-lg font-semibold text-gray-900">Your Daily Steps Goal</h4>
            </div>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-bold text-indigo-600">
                {currentStepGoal.toLocaleString()}
              </p>
              <p className="text-xl text-indigo-600">steps</p>
            </div>
          </div>
        </div>

        {/* TDEE Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700">Maintenance Calories (TDEE):</p>
            <p className="text-xl font-semibold text-gray-900">{Math.round(tdee)} calories</p>
          </div>
          <p className="text-sm text-gray-600">
            This is your Total Daily Energy Expenditure - the amount of calories you need to maintain your current weight.
          </p>
        </div>

        <div className="space-y-6">
          {/* Calorie Target Adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjust Daily Calorie Target
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={isWeightLoss ? initialCalorieTarget - 500 : tdee}
                max={isWeightLoss ? tdee : initialCalorieTarget + 500}
                value={currentCalorieTarget}
                onChange={(e) => handleCalorieAdjustment(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-medium text-gray-900 min-w-[100px]">
                {Math.round(currentCalorieTarget)} kcal
              </span>
            </div>
          </div>

          {/* Step Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjust Daily Step Goal
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={Math.max(1000, initialStepGoal - 5000)}
                max={initialStepGoal + 20000}
                value={currentStepGoal}
                onChange={(e) => handleStepAdjustment(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-medium text-gray-900 min-w-[100px]">
                {currentStepGoal.toLocaleString()} steps
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Split Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Macro Split</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            {[
              { value: 'moderate', label: 'Moderate Carb (30/35/35)' },
              { value: 'low', label: 'Low Carb (40/40/20)' },
              { value: 'high', label: 'High Carb (30/20/50)' }
            ].map((option) => (
              <button
                key={option.value}
                type="button" // Add type="button" to prevent form submission
                onClick={handleMacroSplitChange(option.value as 'moderate' | 'low' | 'high')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                  selectedMacroSplit === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Protein</p>
              <p className="text-xl font-bold text-gray-900">{macros.protein}g</p>
              <p className="text-sm text-gray-500">
                {Math.round((macros.protein * 4 / currentCalorieTarget) * 100)}% of calories
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Fats</p>
              <p className="text-xl font-bold text-gray-900">{macros.fats}g</p>
              <p className="text-sm text-gray-500">
                {Math.round((macros.fats * 9 / currentCalorieTarget) * 100)}% of calories
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Carbs</p>
              <p className="text-xl font-bold text-gray-900">{macros.carbs}g</p>
              <p className="text-sm text-gray-500">
                {Math.round((macros.carbs * 4 / currentCalorieTarget) * 100)}% of calories
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}