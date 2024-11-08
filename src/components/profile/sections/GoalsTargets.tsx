import React, { useState } from 'react';
import { Target, Scale, Dumbbell, BarChart, Edit2 } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { GoalChangeWizard } from './goalWizard/GoalChangeWizard';

interface GoalsTargetsProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function GoalsTargets({ profile, isEditing, onChange }: GoalsTargetsProps) {
  const [showWizard, setShowWizard] = useState(false);

  const handleWizardComplete = (updatedProfile: Partial<UserProfile>) => {
    // Simulate form change events for each updated field
    Object.entries(updatedProfile).forEach(([key, value]) => {
      onChange({
        target: { name: key, value: value?.toString() || '' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    setShowWizard(false);
  };

  const renderCurrentGoal = () => {
    switch (profile.primaryGoal) {
      case 'weight_loss':
        return (
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900">Weight Loss Plan</h3>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowWizard(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                  <Edit2 className="h-4 w-4" />
                  Change Goal
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="font-medium text-blue-800">
                  {profile.weeklyWeightGoal === '0.35' ? 'Moderate Loss' : 'Aggressive Loss'}
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {profile.weeklyWeightGoal === '0.35' 
                    ? '0.35kg per week - Steady, sustainable progress'
                    : '0.6kg per week - Faster results, requires more discipline'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 font-medium">Target Weight</div>
                  <div className="text-xl font-bold text-blue-800 mt-1">
                    {profile.targetWeight} kg
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-sm text-blue-700 font-medium">Weight to Lose</div>
                  <div className="text-xl font-bold text-blue-800 mt-1">
                    {(profile.currentWeight - (profile.targetWeight || 0)).toFixed(1)} kg
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'muscle_gain':
        return (
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Muscle Gain Plan</h3>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowWizard(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                >
                  <Edit2 className="h-4 w-4" />
                  Change Goal
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="font-medium text-green-800">7.5% Caloric Surplus</div>
                <p className="text-sm text-green-600 mt-1">
                  Optimized for maximum muscle growth with minimal fat gain
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700 font-medium">Daily Surplus</div>
                  <div className="text-xl font-bold text-green-800 mt-1">
                    {Math.round(profile.dailyCaloriesTarget * 0.075)} kcal
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700 font-medium">Expected Monthly Gain</div>
                  <div className="text-xl font-bold text-green-800 mt-1">0.5 - 1 kg</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900">Maintenance Plan</h3>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowWizard(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200"
                >
                  <Edit2 className="h-4 w-4" />
                  Change Goal
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="font-medium text-purple-800">Weight Maintenance</div>
                <p className="text-sm text-purple-600 mt-1">
                  Focus on maintaining your current weight while improving body composition
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-700">
                  Your daily calorie target is set to maintain your current weight of {profile.currentWeight}kg
                  while supporting your activity level and body composition goals.
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-semibold">Goals & Targets</h2>
      </div>

      {renderCurrentGoal()}

      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <GoalChangeWizard
              currentProfile={profile}
              onComplete={handleWizardComplete}
              onCancel={() => setShowWizard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}