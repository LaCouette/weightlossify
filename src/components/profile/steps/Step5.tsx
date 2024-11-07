import React, { useState } from 'react';
import { FormData } from '../../../types/profile';
import { Target, Activity, Scale } from 'lucide-react';
import { MaintenanceCard } from './MaintenanceCard';
import {
  calculateBMR,
  calculateBaseMaintenance,
  calculateNEAT,
  calculateDailySurplusOrDeficit,
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
  
  const bmr = calculateBMR(
    Number(formData.currentWeight),
    Number(formData.height),
    Number(formData.age),
    formData.gender,
    Number(formData.bodyFat)
  );
  
  const baseMaintenance = calculateBaseMaintenance(bmr);
  const targetChange = calculateDailySurplusOrDeficit(Number(formData.weeklyWeightGoal), isGain);
  const maxCalories = Math.round(baseMaintenance * (isGain ? 1.7 : 1.5));
  const minCalories = Math.round(baseMaintenance * (isGain ? 1.1 : 0.5));

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
    const requiredSteps = calculateRequiredSteps(
      newCalories,
      baseMaintenance,
      targetChange
    );

    if (requiredSteps > MAX_STEPS) {
      const maxNeat = calculateNEAT(MAX_STEPS);
      const maxTotalMaintenance = baseMaintenance + maxNeat;
      const maxPossibleCalories = calculateTargetCalories(maxTotalMaintenance, targetChange);
      
      setValues({
        targetCalories: maxPossibleCalories,
        targetSteps: MAX_STEPS
      });
      return;
    }

    if (requiredSteps < 0) {
      const minPossibleCalories = baseMaintenance + targetChange;
      
      setValues({
        targetCalories: minPossibleCalories,
        targetSteps: 0
      });
      return;
    }

    setValues({
      targetCalories: newCalories,
      targetSteps: requiredSteps
    });
  };

  const handleStepsChange = (newSteps: number) => {
    const newNeat = calculateNEAT(newSteps);
    const newTotalMaintenance = baseMaintenance + newNeat;
    const newCalories = calculateTargetCalories(newTotalMaintenance, targetChange);

    if (newCalories > maxCalories) {
      const maxPossibleSteps = Math.round((maxCalories - targetChange - baseMaintenance) / CALORIES_PER_STEP);
      
      setValues({
        targetCalories: maxCalories,
        targetSteps: maxPossibleSteps
      });
      return;
    }

    if (newCalories < minCalories) {
      const minPossibleSteps = Math.round((minCalories - targetChange - baseMaintenance) / CALORIES_PER_STEP);
      
      setValues({
        targetCalories: minCalories,
        targetSteps: minPossibleSteps
      });
      return;
    }

    setValues({
      targetCalories: newCalories,
      targetSteps: newSteps
    });
  };

  React.useEffect(() => {
    onChange({
      target: { name: 'dailyCalorieTarget', value: values.targetCalories.toString() }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { name: 'dailyStepGoal', value: values.targetSteps.toString() }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [values.targetCalories, values.targetSteps]);

  const maxPossibleSteps = values.targetCalories === maxCalories 
    ? values.targetSteps 
    : MAX_STEPS;

  const minPossibleSteps = values.targetCalories === minCalories
    ? values.targetSteps
    : 0;

  const maxPossibleCalories = values.targetSteps === MAX_STEPS
    ? values.targetCalories
    : maxCalories;

  const minPossibleCalories = values.targetSteps === 0
    ? values.targetCalories
    : minCalories;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Plan</h2>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
          <Target className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Target {isGain ? 'Surplus' : 'Deficit'}: {Math.abs(targetChange)} calories/day
          </span>
        </div>
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
              min={minPossibleCalories}
              max={maxPossibleCalories}
              value={values.targetCalories}
              onChange={(e) => handleCaloriesChange(Number(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600 ${
                activeSlider === 'calories' ? 'ring-2 ring-orange-500' : ''
              }`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{minPossibleCalories}</span>
              <span>{maxPossibleCalories}</span>
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
              min={minPossibleSteps}
              max={maxPossibleSteps}
              value={values.targetSteps}
              onChange={(e) => handleStepsChange(Number(e.target.value))}
              className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 ${
                activeSlider === 'steps' ? 'ring-2 ring-green-500' : ''
              }`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{minPossibleSteps.toLocaleString()}</span>
              <span>{maxPossibleSteps.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="text-center space-y-2">
          <div className="font-medium text-gray-900">Daily Target Summary</div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.abs(currentChange)} cal {isGain ? 'surplus' : 'deficit'}
          </div>
          <div className="text-sm text-gray-600">
            Following these targets should result in approximately {(Math.abs(currentChange) * 7 / 7700).toFixed(2)}kg of {isGain ? 'weight gain' : 'weight loss'} per week
          </div>
        </div>
      </div>
    </div>
  );
}