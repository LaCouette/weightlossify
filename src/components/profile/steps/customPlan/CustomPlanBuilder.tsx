import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { UserProfile } from '../../../../types/profile';
import {
  calculateBMR,
  calculateBaseMaintenance,
  calculateNEAT,
} from '../../../../utils/calorieCalculations';
import { MaintenanceInfo } from './MaintenanceInfo';
import { CalorieSlider } from './CalorieSlider';
import { StepsSlider } from './StepsSlider';
import { TargetWeightInput } from './TargetWeightInput';
import { ExpectedResults } from './ExpectedResults';

interface CustomPlanBuilderProps {
  profile: UserProfile;
  onChange: (updates: Partial<UserProfile>) => void;
  showHeader?: boolean;
}

export function CustomPlanBuilder({ profile, onChange, showHeader = true }: CustomPlanBuilderProps) {
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
    const neat = calculateNEAT(values.targetSteps);
    const totalMaintenance = baseMaintenance + neat;
    const currentChange = values.targetCalories - totalMaintenance;

    // Determine goal based on calorie target relative to maintenance
    let primaryGoal: 'weight_loss' | 'maintenance' | 'muscle_gain';
    if (Math.abs(currentChange) < 100) {
      primaryGoal = 'maintenance';
    } else if (currentChange > 0) {
      primaryGoal = 'muscle_gain';
    } else {
      primaryGoal = 'weight_loss';
    }

    onChange({
      dailyCaloriesTarget: values.targetCalories,
      dailyStepsGoal: values.targetSteps,
      primaryGoal,
      // Clear weekly weight goal since this is a custom plan
      weeklyWeightGoal: undefined,
      // Only include target weight for weight loss
      targetWeight: primaryGoal === 'weight_loss' ? values.targetWeight : undefined
    });
  }, [values.targetCalories, values.targetSteps, values.targetWeight]);

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const currentChange = values.targetCalories - totalMaintenance;

  const isWeightLoss = currentChange < -100;

  return (
    <div className="space-y-6">
      {showHeader && (
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
      )}

      <MaintenanceInfo
        baseMaintenance={baseMaintenance}
        neat={neat}
        totalMaintenance={totalMaintenance}
      />

      <CalorieSlider
        value={values.targetCalories}
        minCalories={minCalories}
        maxCalories={maxCalories}
        currentChange={currentChange}
        onChange={(value) => setValues(prev => ({ ...prev, targetCalories: value }))}
      />

      <StepsSlider
        value={values.targetSteps}
        neat={neat}
        onChange={(value) => setValues(prev => ({ ...prev, targetSteps: value }))}
      />

      {isWeightLoss && (
        <TargetWeightInput
          value={values.targetWeight}
          currentWeight={profile.currentWeight}
          onChange={(value) => setValues(prev => ({ ...prev, targetWeight: value }))}
        />
      )}

      <ExpectedResults currentChange={currentChange} />
    </div>
  );
}