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
import { AnimatePresence, motion } from 'framer-motion';

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
  // Round maintenance to nearest 50
  const roundedMaintenance = Math.round(baseMaintenance / 50) * 50;
  const maxCalories = Math.round(baseMaintenance * 2);
  const minCalories = Math.round(baseMaintenance * 0.5);

  const [values, setValues] = useState({
    targetCalories: roundedMaintenance,
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

  const handleCaloriesChange = (newCalories: number) => {
    // Round to nearest 50
    const roundedCalories = Math.round(newCalories / 50) * 50;
    setValues(prev => ({
      ...prev,
      targetCalories: roundedCalories
    }));
  };

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
        onChange={handleCaloriesChange}
      />

      <StepsSlider
        value={values.targetSteps}
        neat={neat}
        onChange={(value) => setValues(prev => ({ ...prev, targetSteps: value }))}
      />

      {/* Wrap TargetWeightInput in AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {isWeightLoss && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <TargetWeightInput
              value={values.targetWeight}
              currentWeight={profile.currentWeight}
              onChange={(value) => setValues(prev => ({ ...prev, targetWeight: value }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ExpectedResults currentChange={currentChange} />
    </div>
  );
}