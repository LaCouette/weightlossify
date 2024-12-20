import React, { useState, useEffect } from 'react';
import { Activity, Scale, Target } from 'lucide-react';
import { FormData } from '../../../types/profile';
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
import { roundSteps, roundCalories } from '../../../utils/roundingRules';

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
    if (isMaintenance) return 0;
    if (isGain) return Math.round(baseMaintenance * 0.075);
    return formData.weeklyWeightGoal === '0.35' ? -350 : -600;
  })();

  const maxCalories = roundCalories(
    Math.round(baseMaintenance * (isGain ? 1.7 : isMaintenance ? 2.5 : 1.5)),
    formData.primaryGoal
  );
  const minCalories = roundCalories(
    Math.round(baseMaintenance * (isGain ? 1.1 : isMaintenance ? 0.9 : 0.5)),
    formData.primaryGoal
  );

  // Get initial balanced recommendation
  const initialReco = getInitialRecommendation(baseMaintenance, targetChange, isGain);

  // Initialize values with recommendations
  useEffect(() => {
    // Update form data with calculated targets
    onChange({
      target: { name: 'dailyStepsGoal', value: roundSteps(initialReco.steps).toString() }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { 
        name: 'dailyCaloriesTarget', 
        value: roundCalories(initialReco.calories, formData.primaryGoal).toString() 
      }
    } as React.ChangeEvent<HTMLInputElement>);
  }, [formData.primaryGoal, formData.weeklyWeightGoal]);

  const [values, setValues] = useState({
    targetCalories: roundCalories(initialReco.calories, formData.primaryGoal),
    targetSteps: roundSteps(initialReco.steps)
  });

  const [isCaloriesLocked, setIsCaloriesLocked] = useState(false);
  const [isStepsLocked, setIsStepsLocked] = useState(false);

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const currentChange = values.targetCalories - totalMaintenance;

  const handleCaloriesChange = (newCalories: number) => {
    if (isCaloriesLocked) return;

    const clampedCalories = roundCalories(
      Math.min(Math.max(newCalories, minCalories), maxCalories),
      formData.primaryGoal
    );
    
    const requiredSteps = calculateRequiredSteps(
      clampedCalories,
      baseMaintenance,
      targetChange
    );

    // Check if required steps would be out of bounds
    const clampedSteps = roundSteps(Math.min(Math.max(requiredSteps, 0), MAX_STEPS));
    
    // If steps would be at min/max, lock calories at current value
    if (clampedSteps === 0 || clampedSteps === MAX_STEPS) {
      setIsStepsLocked(true);
      return;
    }

    setIsStepsLocked(false);
    setValues({
      targetCalories: clampedCalories,
      targetSteps: clampedSteps
    });

    // Update form data
    onChange({
      target: { 
        name: 'dailyCaloriesTarget', 
        value: clampedCalories.toString() 
      }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { 
        name: 'dailyStepsGoal', 
        value: clampedSteps.toString() 
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleStepsChange = (newSteps: number) => {
    if (isStepsLocked) return;

    const clampedSteps = roundSteps(Math.min(Math.max(newSteps, 0), MAX_STEPS));
    const newNeat = calculateNEAT(clampedSteps);
    const newTotalMaintenance = baseMaintenance + newNeat;
    const newCalories = calculateTargetCalories(
      newTotalMaintenance,
      targetChange,
      formData.primaryGoal
    );

    // Check if new calories would be out of bounds
    const clampedCalories = roundCalories(
      Math.min(Math.max(newCalories, minCalories), maxCalories),
      formData.primaryGoal
    );

    // If calories would be at min/max, lock steps at current value
    if (clampedCalories === minCalories || clampedCalories === maxCalories) {
      setIsCaloriesLocked(true);
      return;
    }

    setIsCaloriesLocked(false);
    setValues({
      targetCalories: clampedCalories,
      targetSteps: clampedSteps
    });

    // Update form data
    onChange({
      target: { 
        name: 'dailyCaloriesTarget', 
        value: clampedCalories.toString() 
      }
    } as React.ChangeEvent<HTMLInputElement>);

    onChange({
      target: { 
        name: 'dailyStepsGoal', 
        value: clampedSteps.toString() 
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Reset locks when mouse/touch is released
  const handlePointerUp = () => {
    setIsCaloriesLocked(false);
    setIsStepsLocked(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            {!isMaintenance && (
              <div className="text-sm text-orange-600 mt-1">
                ({isGain ? '+' : ''}{Math.round(currentChange)} kcal {isGain ? 'surplus' : 'deficit'})
              </div>
            )}
          </div>

          <div className="relative pt-6 pb-2">
            <div className="relative h-4">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full shadow-inner" />
              <input
                type="range"
                min={minCalories}
                max={maxCalories}
                value={values.targetCalories}
                onChange={(e) => handleCaloriesChange(Number(e.target.value))}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
                step="50"
                style={{
                  '--thumb-size': '2rem',
                  '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)',
                  opacity: isCaloriesLocked ? '0.5' : '1',
                  cursor: isCaloriesLocked ? 'not-allowed' : 'pointer'
                } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
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
            <div className="relative h-4">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 rounded-full shadow-inner" />
              <input
                type="range"
                min={0}
                max={MAX_STEPS}
                value={values.targetSteps}
                onChange={(e) => handleStepsChange(Number(e.target.value))}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
                step="500"
                style={{
                  '--thumb-size': '2rem',
                  '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)',
                  opacity: isStepsLocked ? '0.5' : '1',
                  cursor: isStepsLocked ? 'not-allowed' : 'pointer'
                } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
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