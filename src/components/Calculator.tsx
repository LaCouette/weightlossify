import React, { useState } from 'react';
import { Calculator as CalculatorIcon, Activity, Scale, Info } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useWeightStore } from '../stores/weightStore';
import { MaintenanceCard } from './profile/steps/MaintenanceCard';
import {
  calculateBMR,
  calculateBaseMaintenance,
  calculateNEAT,
  roundSteps,
  roundCalories,
  MAX_STEPS,
  CALORIES_PER_STEP
} from '../utils/calorieCalculations';

const MAX_CALORIES = 6000;
const MIN_CALORIES = 1200;

export function Calculator() {
  const { profile } = useUserStore();
  const currentWeight = useWeightStore(state => state.currentWeight) || profile?.currentWeight || 0;
  
  const bmr = calculateBMR(
    currentWeight,
    profile?.height || 0,
    profile?.age || 0,
    profile?.gender || 'male',
    profile?.bodyFat
  );
  
  const baseMaintenance = calculateBaseMaintenance(bmr);
  
  const [values, setValues] = useState({
    targetCalories: profile?.dailyCaloriesTarget || Math.round(baseMaintenance),
    targetSteps: profile?.dailyStepsGoal || 8000
  });

  const neat = calculateNEAT(values.targetSteps);
  const totalMaintenance = baseMaintenance + neat;
  const calorieBalance = values.targetCalories - totalMaintenance;
  const isDeficit = calorieBalance < 0;
  const isSurplus = calorieBalance > 0;

  const handleCaloriesChange = (newCalories: number) => {
    setValues(prev => ({
      ...prev,
      targetCalories: roundCalories(newCalories, 'maintenance')
    }));
  };

  const handleStepsChange = (newSteps: number) => {
    setValues(prev => ({
      ...prev,
      targetSteps: roundSteps(Math.min(Math.max(newSteps, 0), MAX_STEPS))
    }));
  };

  const getBalanceDescription = () => {
    if (Math.abs(calorieBalance) < 50) {
      return {
        title: 'Maintenance',
        description: 'You are close to maintenance calories. This will help maintain your current weight.',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50'
      };
    }
    
    if (isDeficit) {
      const weeklyLoss = (Math.abs(calorieBalance) * 7) / 7700;
      return {
        title: 'Calorie Deficit',
        description: `This deficit could lead to approximately ${weeklyLoss.toFixed(2)}kg weight loss per week.`,
        color: 'bg-green-500',
        bgColor: 'bg-green-50'
      };
    }
    
    const weeklyGain = (calorieBalance * 7) / 7700;
    return {
      title: 'Calorie Surplus',
      description: `This surplus could lead to approximately ${weeklyGain.toFixed(2)}kg weight gain per week.`,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    };
  };

  const balanceInfo = getBalanceDescription();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-md">
          <CalculatorIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          TDEE Calculator
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Calculate your Total Daily Energy Expenditure (TDEE) and experiment with different activity levels.
        </p>
      </div>

      <MaintenanceCard
        baseMaintenance={baseMaintenance}
        neat={neat}
        total={totalMaintenance}
      />

      {/* Calories Slider */}
      <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-xl p-6 border border-orange-100/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-50 rounded-lg shadow-sm">
            <Scale className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="font-medium text-gray-900">Daily Calorie Target</h3>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(values.targetCalories)}
            </div>
            <div className="text-sm text-gray-500">calories per day</div>
            {(isDeficit || isSurplus) && (
              <div className={`text-sm mt-1 ${isDeficit ? 'text-green-600' : 'text-orange-600'}`}>
                ({isDeficit ? '-' : '+'}{Math.abs(Math.round(calorieBalance))} kcal {isDeficit ? 'deficit' : 'surplus'})
              </div>
            )}
          </div>

          <div className="relative pt-6 pb-2">
            <input
              type="range"
              min={MIN_CALORIES}
              max={MAX_CALORIES}
              value={values.targetCalories}
              onChange={(e) => handleCaloriesChange(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600 shadow-inner"
              step="50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{MIN_CALORIES}</span>
              <span>{MAX_CALORIES}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Slider */}
      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-xl p-6 border border-green-100/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-green-50 rounded-lg shadow-sm">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
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
              onChange={(e) => handleStepsChange(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 shadow-inner"
              step="100"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0</span>
              <span>{MAX_STEPS.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Balance Summary */}
      <div className={`${balanceInfo.bgColor} rounded-xl p-6 border border-gray-200/50 shadow-lg`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-white/80 rounded-lg shadow-sm">
            <Info className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-medium text-gray-900">Energy Balance Analysis</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-full ${balanceInfo.color} rounded-full shadow-sm`} />
            <div>
              <h4 className="font-semibold text-gray-900">{balanceInfo.title}</h4>
              <p className="text-gray-600">{balanceInfo.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/80 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Daily Balance</div>
              <div className="text-xl font-bold text-gray-900">
                {isDeficit ? '-' : '+'}{Math.abs(Math.round(calorieBalance))} kcal
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600">Weekly Impact</div>
              <div className="text-xl font-bold text-gray-900">
                {((Math.abs(calorieBalance) * 7) / 7700).toFixed(2)} kg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}