import React, { useState } from 'react';
import { UserProfile } from '../../../../types/profile';
import { GoalSelection } from './steps/GoalSelection';
import { WeightLossPlan } from './steps/WeightLossPlan';
import { TargetAdjustment } from './steps/TargetAdjustment';
import { CustomTargetAdjustment } from './steps/CustomTargetAdjustment';
import { useAuthStore } from '../../../../stores/authStore';
import { useUserStore } from '../../../../stores/userStore';

interface GoalChangeWizardProps {
  currentProfile: UserProfile;
  onComplete: (updatedProfile: Partial<UserProfile>) => void;
  onCancel: () => void;
}

export function GoalChangeWizard({ currentProfile, onComplete, onCancel }: GoalChangeWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { updateProfile } = useUserStore();
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile>({
    ...currentProfile,
    primaryGoal: currentProfile.primaryGoal,
    weeklyWeightGoal: currentProfile.weeklyWeightGoal,
    targetWeight: currentProfile.targetWeight,
    dailyStepsGoal: currentProfile.dailyStepsGoal,
    dailyCaloriesTarget: currentProfile.dailyCaloriesTarget
  });
  const [mode, setMode] = useState<'guided' | 'custom'>('guided');

  const handleNext = async () => {
    if (step === getMaxSteps()) {
      if (!user?.uid) return;
      
      try {
        setIsSubmitting(true);
        
        await updateProfile(user.uid, {
          ...updatedProfile,
          updatedAt: new Date()
        });
        
        onComplete(updatedProfile);
      } catch (error) {
        console.error('Failed to save profile changes:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const getMaxSteps = () => {
    if (mode === 'custom') return 2; // Selection -> Custom adjustment
    if (updatedProfile.primaryGoal === 'weight_loss') {
      return 3; // Selection -> Weight loss plan -> Target adjustment
    }
    return 2; // Selection -> Target adjustment
  };

  const handleGoalSelect = (goal: string) => {
    if (goal === 'custom') {
      setMode('custom');
      setUpdatedProfile(prev => ({
        ...prev,
        primaryGoal: 'maintenance', // Default to maintenance for custom mode
        weeklyWeightGoal: undefined,
        targetWeight: undefined
      }));
      setStep(2);
    } else {
      setMode('guided');
      setUpdatedProfile(prev => ({
        ...prev,
        primaryGoal: goal as 'weight_loss' | 'muscle_gain' | 'maintenance',
        weeklyWeightGoal: undefined,
        targetWeight: undefined
      }));
      setStep(2);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <GoalSelection
            currentGoal={updatedProfile.primaryGoal}
            onChange={handleGoalSelect}
          />
        );
      case 2:
        if (mode === 'custom') {
          return (
            <CustomTargetAdjustment
              profile={updatedProfile}
              onChange={(updates) => {
                setUpdatedProfile(prev => ({
                  ...prev,
                  ...updates
                }));
              }}
            />
          );
        }
        if (updatedProfile.primaryGoal === 'weight_loss') {
          return (
            <WeightLossPlan
              currentWeight={updatedProfile.currentWeight}
              currentPlan={updatedProfile.weeklyWeightGoal}
              onChange={(plan, targetWeight) => {
                setUpdatedProfile(prev => ({
                  ...prev,
                  weeklyWeightGoal: plan,
                  targetWeight
                }));
              }}
            />
          );
        }
        return (
          <TargetAdjustment
            profile={updatedProfile}
            onChange={(updates) => {
              setUpdatedProfile(prev => ({
                ...prev,
                ...updates
              }));
            }}
          />
        );
      case 3:
        return (
          <TargetAdjustment
            profile={updatedProfile}
            onChange={(updates) => {
              setUpdatedProfile(prev => ({
                ...prev,
                ...updates
              }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center">Change Your Goal</h2>
        <div className="mt-2 flex justify-center">
          <div className="flex items-center space-x-2">
            {Array.from({ length: getMaxSteps() }).map((_, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className={`h-1 w-8 rounded ${
                    index < step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
                <div className={`h-4 w-4 rounded-full ${
                  index < step ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {step === getMaxSteps() ? (isSubmitting ? 'Saving...' : 'Complete') : 'Next'}
        </button>
      </div>
    </div>
  );
}