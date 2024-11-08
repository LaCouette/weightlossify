import React, { useState } from 'react';
import { FormData } from '../../../types/profile';
import { Target, Activity, Scale } from 'lucide-react';
import { MaintenanceCard } from './MaintenanceCard';
import {
  calculateBMR,
  calculateBaseMaintenance,
  calculateNEAT,
  calculateRequiredSteps,
  calculateTargetCalories,
  getInitialRecommendation,
  MAX_STEPS,
  CALORIES_PER_STEP
} from '../../../utils/calorieCalculations';

interface Step5Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step5({ formData, onChange }: Step5Props) {
  const isGain = formData.primaryGoal === 'muscle_gain';
  const isMaintenance = formData.primaryGoal === 'maintenance';
  
  const bmr = calculateBMR(
    Number(formData.currentWeight),
    Number(formData.height),
    Number(formData.age),
    formData.gender,
    Number(formData.bodyFat)
  );
  
  const baseMaintenance = calculateBaseMaintenance(bmr);
  
  // Calculate target change based on selected goal
  const targetChange = (() => {
    if (isMaintenance) {
      return 0; // No deficit/surplus for maintenance
    }
    if (isGain) {
      // Calculate 7.5% surplus for muscle gain
      return Math.round(baseMaintenance * 0.075);
    }
    // Use exact deficit from selected plan in Step3
    return formData.weeklyWeightGoal === '0.35' ? -350 : // moderate loss
           formData.weeklyWeightGoal === '0.6' ? -600 : // aggressive loss
           0; // default to maintenance
  })();

  const maxCalories = Math.round(baseMaintenance * (isGain ? 1.7 : isMaintenance ? 1.3 : 1.5));
  const minCalories = Math.round(baseMaintenance * (isGain ? 1.1 : isMaintenance ? 0.9 : 0.5));

  // Get initial balanced recommendation
  const initialReco = getInitialRecommendation(baseMaintenance, targetChange, isGain);

  const [activeSlider, setActiveSlider] = useState<'calories' | 'steps' | null>(null);
  const [values, setValues] = useState({
    targetCalories: initialReco.calories,
    targetSteps: initialReco.steps
  });

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const currentChange = values.targetCalories - totalMaintenance;

  const handleCaloriesChange = (newCalories: number) => {
    // Clamp calories within bounds
    const clampedCalories = Math.min(Math.max(newCalories, minCalories), maxCalories);
    
    // Calculate required steps for these calories
    const requiredSteps = calculateRequiredSteps(
      clampedCalories,
      baseMaintenance,
      targetChange
    );

    // Clamp steps within bounds
    const clampedSteps = Math.min(Math.max(requiredSteps, 0), MAX_STEPS);

    // If steps would be out of bounds, recalculate calories
    if (requiredSteps !== clampedSteps) {
      const newNeat = calculateNEAT(clampedSteps);
      const newTotalMaintenance = baseMaintenance + newNeat;
      const recalculatedCalories = calculateTargetCalories(newTotalMaintenance, targetChange);
      
      setValues({
        targetCalories: Math.min(Math.max(recalculatedCalories, minCalories), maxCalories),
        targetSteps: clampedSteps
      });
    } else {
      setValues({
        targetCalories: clampedCalories,
        targetSteps: clampedSteps
      });
    }
  };

  const handleStepsChange = (newSteps: number) => {
    // Clamp steps within bounds
    const clampedSteps = Math.min(Math.max(newSteps, 0), MAX_STEPS);
    
    // Calculate calories for these steps
    const newNeat = calculateNEAT(clampedSteps);
    const newTotalMaintenance = baseMaintenance + newNeat;
    const newCalories = calculateTargetCalories(newTotalMaintenance, targetChange);

    // Clamp calories within bounds
    const clampedCalories = Math.min(Math.max(newCalories, minCalories), maxCalories);

    // If calories would be out of bounds, recalculate steps
    if (newCalories !== clampedCalories) {
      const requiredSteps = calculateRequiredSteps(
        clampedCalories,
        baseMaintenance,
        targetChange
      );
      
      setValues({
        targetCalories: clampedCalories,
        targetSteps: Math.min(Math.max(requiredSteps, 0), MAX_STEPS)
      });
    } else {
      setValues({
        targetCalories: clampedCalories,
        targetSteps: clampedSteps
      });
    }
  };

  React.useEffect(() => {
    onChange({
      target: { name: 'dailyCalorieTarget', value: values.targetCalories.toString() }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { name: 'dailyStepGoal', value: values.targetSteps.toString() }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [values.targetCalories, values.targetSteps]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Plan</h2>
        {!isMaintenance && (
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
              Target {isGain ? 'Surplus' : 'Deficit'}: {Math.abs(targetChange)} calories/day
            </span>
          </div>
        )}
      </div>

      <MaintenanceCard
        baseMaintenance={baseMaintenance}
        neat={neat}
        total={totalMaintenance}
      />

      {/* Calories Slider */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Scale className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-900">Daily Calorie Target</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(values.targetCalories)}
            </div>
            <div className="text-sm text-gray-500">calories per day</div>
          </div>

          <div 
            className="relative pt-6 pb-2"
            onTouchStart={() => setActiveSlider('calories')}
            onTouchEnd={() => setActiveSlider(null)}
          >
            <input
              type="range"
              min={minCalories}
              max={maxCalories}
              value={values.targetCalories}
              onChange={(e) => handleCaloriesChange(Number(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600 ${
                activeSlider === 'calories' ? 'ring-2 ring-orange-500' : ''
              }`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{minCalories}</span>
              <span>{maxCalories}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Slider */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900">Daily Steps Target</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {values.targetSteps.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">steps per day</div>
          </div>

          <div 
            className="relative pt-6 pb-2"
            onTouchStart={() => setActiveSlider('steps')}
            onTouchEnd={() => setActiveSlider(null)}
          >
            <input
              type="range"
              min={0}
              max={MAX_STEPS}
              value={values.targetSteps}
              onChange={(e) => handleStepsChange(Number(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 ${
                activeSlider === 'steps' ? 'ring-2 ring-green-500' : ''
              }`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0</span>
              <span>{MAX_STEPS.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="text-center space-y-2">
          <div className="font-medium text-gray-900">Daily Target Summary</div>
          {isMaintenance ? (
            <>
              <div className="text-2xl font-bold text-purple-600">
                Maintenance Mode
              </div>
              <div className="text-sm text-gray-600">
                Focus on maintaining your current weight while improving body composition through proper nutrition and exercise.
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-purple-600">
                {Math.abs(currentChange)} cal {isGain ? 'surplus' : 'deficit'}
              </div>
              <div className="text-sm text-gray-600">
                Following these targets should result in approximately {(Math.abs(currentChange) * 7 / 7700).toFixed(2)}kg of {isGain ? 'weight gain' : 'weight loss'} per week
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}