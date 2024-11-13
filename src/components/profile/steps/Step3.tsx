import React, { useState } from 'react';
import { FormData } from '../../../types/profile';
import { Target, Scale, Dumbbell, BarChart, Sliders, Sparkles } from 'lucide-react';
import { WeightManagementGoals } from './WeightManagementGoals';
import { MuscleGainGoals } from './MuscleGainGoals';
import { MaintenanceGoals } from './MaintenanceGoals';
import { CustomPlanBuilder } from './customPlan/CustomPlanBuilder';

interface Step3Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCustomPlanSelect: () => void;
}

export function Step3({ formData, onChange, onCustomPlanSelect }: Step3Props) {
  const [selectedMode, setSelectedMode] = useState<'guided' | 'custom' | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<'weight_loss' | 'muscle_gain' | 'maintenance' | null>(null);

  if (!selectedMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Target className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">How would you like to proceed?</h3>
          <p className="text-sm text-gray-600">
            Choose your preferred approach to setting your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Guided Program Builder */}
          <button
            type="button"
            onClick={() => setSelectedMode('guided')}
            className="group p-6 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 bg-white transition-all text-left relative overflow-hidden hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Help me build my program
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get a personalized plan based on proven approaches for weight loss, muscle gain, or maintenance
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Scale, label: 'Weight Loss' },
                    { icon: Dumbbell, label: 'Muscle Gain' },
                    { icon: BarChart, label: 'Maintenance' }
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-sm text-gray-600">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Custom Calculator Mode */}
          <button
            type="button"
            onClick={() => {
              setSelectedMode('custom');
              onCustomPlanSelect();
            }}
            className="group p-6 rounded-xl border-2 border-green-200 hover:border-green-300 bg-white transition-all text-left relative overflow-hidden hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-teal-100">
                <Sliders className="h-6 w-6 text-green-600" />
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Let me explore freely
                </h4>
                <p className="text-sm text-gray-600">
                  Experiment with different calorie and activity levels to create your own custom plan. 
                  Perfect if you want to fine-tune your targets or try different approaches.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (selectedMode === 'custom') {
    return (
      <CustomPlanBuilder
        profile={formData}
        onChange={(updates) => {
          Object.entries(updates).forEach(([key, value]) => {
            onChange({
              target: { name: key, value: value?.toString() || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          });
        }}
      />
    );
  }

  if (!selectedGoal) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Target className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">Select Your Goal</h3>
          <p className="text-sm text-gray-600">
            Choose the primary goal for your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Weight Loss */}
          <button
            type="button"
            onClick={() => {
              setSelectedGoal('weight_loss');
              onChange({
                target: { name: 'primaryGoal', value: 'weight_loss' }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Weight Loss</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Lose weight sustainably while preserving muscle mass
                </p>
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  Recommended: 0.35-0.6kg per week
                </div>
              </div>
            </div>
          </button>

          {/* Muscle Gain */}
          <button
            type="button"
            onClick={() => {
              setSelectedGoal('muscle_gain');
              onChange({
                target: { name: 'primaryGoal', value: 'muscle_gain' }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <Dumbbell className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Muscle Gain</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Build lean muscle mass with minimal fat gain
                </p>
                <div className="mt-3 text-sm text-green-600 font-medium">
                  Recommended: 0.5-1kg per month
                </div>
              </div>
            </div>
          </button>

          {/* Maintenance */}
          <button
            type="button"
            onClick={() => {
              setSelectedGoal('maintenance');
              onChange({
                target: { name: 'primaryGoal', value: 'maintenance' }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Maintenance</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Maintain current weight while improving body composition
                </p>
                <div className="mt-3 text-sm text-purple-600 font-medium">
                  Target: ±1kg fluctuation range
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Show the appropriate goal-specific component
  switch (selectedGoal) {
    case 'weight_loss':
      return (
        <WeightManagementGoals
          currentWeight={formData.currentWeight}
          currentPlan={formData.weeklyWeightGoal}
          onChange={(plan, targetWeight) => {
            onChange({
              target: { name: 'weeklyWeightGoal', value: plan }
            } as React.ChangeEvent<HTMLInputElement>);
            onChange({
              target: { name: 'targetWeight', value: targetWeight.toString() }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
        />
      );
    case 'muscle_gain':
      return (
        <MuscleGainGoals
          currentWeight={formData.currentWeight}
          height={formData.height}
          age={formData.age}
          gender={formData.gender}
          bodyFat={formData.bodyFat}
          onChange={(updates) => {
            Object.entries(updates).forEach(([key, value]) => {
              onChange({
                target: { name: key, value: value?.toString() || '' }
              } as React.ChangeEvent<HTMLInputElement>);
            });
          }}
        />
      );
    case 'maintenance':
      return (
        <MaintenanceGoals
          currentWeight={formData.currentWeight}
          height={formData.height}
          age={formData.age}
          gender={formData.gender}
          bodyFat={formData.bodyFat}
          onChange={(updates) => {
            Object.entries(updates).forEach(([key, value]) => {
              onChange({
                target: { name: key, value: value?.toString() || '' }
              } as React.ChangeEvent<HTMLInputElement>);
            });
          }}
        />
      );
    default:
      return null;
  }
}