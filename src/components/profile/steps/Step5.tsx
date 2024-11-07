import React, { useState, useEffect } from 'react';
import { FormData } from '../../../types/profile';
import { Target, ChevronRight, Info } from 'lucide-react';
import { MaintenanceCard } from './MaintenanceCard';
import { StepsCard } from './StepsCard';
import { CaloriesCard } from './CaloriesCard';
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

  const [values, setValues] = useState({
    targetCalories: initialReco.calories,
    targetSteps: initialReco.steps
  });

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const currentChange = values.targetCalories - totalMaintenance;

  const handleCaloriesChange = (newCalories: number) => {
    // Calculate required steps for the new calorie target
    const requiredSteps = calculateRequiredSteps(
      newCalories,
      baseMaintenance,
      targetChange
    );

    // If required steps would exceed MAX_STEPS, calculate the maximum possible calories
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

    // If required steps would go below 0, calculate the minimum possible calories
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

    // If new calories would exceed maxCalories, calculate the maximum possible steps
    if (newCalories > maxCalories) {
      const maxPossibleSteps = Math.round((maxCalories - targetChange - baseMaintenance) / CALORIES_PER_STEP);
      
      setValues({
        targetCalories: maxCalories,
        targetSteps: maxPossibleSteps
      });
      return;
    }

    // If new calories would go below minCalories, calculate the minimum possible steps
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

  useEffect(() => {
    onChange({
      target: { name: 'dailyCalorieTarget', value: values.targetCalories.toString() }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { name: 'dailyStepGoal', value: values.targetSteps.toString() }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [values.targetCalories, values.targetSteps]);

  // Calculate slider limits based on current values
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Plan</h2>
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
          <Target className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Target {isGain ? 'Surplus' : 'Deficit'}: {Math.abs(targetChange)} calories/day
          </span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your goal to {isGain ? 'gain muscle' : 'lose weight'}, we've calculated your optimal calorie and activity targets.
          Adjust the sliders below to find the perfect balance for you.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            {isGain 
              ? "For muscle gain, we recommend a moderate caloric surplus combined with strength training. The activity level is kept lower to prioritize recovery and muscle growth."
              : "Your plan includes both diet and activity adjustments. The calculator automatically balances your calorie intake with your activity level to help you reach your weight loss goal."}
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <MaintenanceCard
            baseMaintenance={baseMaintenance}
            neat={neat}
            total={totalMaintenance}
          />
          <CaloriesCard
            calories={values.targetCalories}
            change={currentChange}
            minCalories={minPossibleCalories}
            maxCalories={maxPossibleCalories}
            onChange={handleCaloriesChange}
            isGain={isGain}
          />
        </div>

        <StepsCard
          steps={values.targetSteps}
          calories={neat}
          minSteps={minPossibleSteps}
          maxSteps={maxPossibleSteps}
          onChange={handleStepsChange}
          isGain={isGain}
        />

        {/* Results Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Daily Targets Summary</h3>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-purple-100">
              <span className="font-medium text-lg text-purple-600">
                {Math.abs(currentChange)} cal {isGain ? 'surplus' : 'deficit'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <span className="text-sm text-gray-500 block mb-1">Maintenance</span>
              <span className="text-2xl font-bold text-gray-900">{totalMaintenance}</span>
              <span className="text-sm text-gray-500 block mt-1">calories/day</span>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <ChevronRight className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <span className="text-sm text-gray-500 block mb-1">Target Intake</span>
              <span className="text-2xl font-bold text-purple-600">{values.targetCalories}</span>
              <span className="text-sm text-gray-500 block mt-1">calories/day</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600 text-center">
            Following these targets should result in approximately {(Math.abs(currentChange) * 7 / 7700).toFixed(2)}kg of {isGain ? 'weight gain' : 'weight loss'} per week
          </div>
        </div>
      </div>
    </div>
  );
}