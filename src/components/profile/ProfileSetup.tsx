import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { calculateFullProfile, calculateMacros } from '../../utils/profileCalculations';
import { FormData } from '../../types/profile';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';

export function ProfileSetup() {
  const { user } = useAuthStore();
  const { addProfile } = useUserStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    age: 0,
    height: 0,
    currentWeight: 0,
    activityLevel: '',
    primaryGoal: '',
    secondaryGoal: '',
    dailyStepGoal: 0,
    dailyCalorieTarget: 0,
    proteinPercentage: 0,
    carbsPercentage: 0,
    fatsPercentage: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRecommendations = () => {
    const calculations = calculateFullProfile({
      gender: formData.gender,
      age: Number(formData.age),
      height: Number(formData.height),
      currentWeight: Number(formData.currentWeight),
      targetWeight: formData.targetWeight ? Number(formData.targetWeight) : undefined,
      weeklyWeightGoal: formData.weeklyWeightGoal ? Number(formData.weeklyWeightGoal) : undefined,
      activityLevel: formData.activityLevel,
      primaryGoal: formData.primaryGoal
    });

    const macros = calculateMacros(
      calculations.netCalorieTarget,
      formData.primaryGoal,
      formData.secondaryGoal
    );

    setFormData(prev => ({
      ...prev,
      dailyStepGoal: calculations.requiredSteps,
      dailyCalorieTarget: calculations.netCalorieTarget,
      proteinPercentage: macros.protein,
      carbsPercentage: macros.carbs,
      fatsPercentage: macros.fats
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      calculateRecommendations();
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addProfile(user.uid, {
        ...formData,
        setupCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} onChange={handleChange} />;
      case 2:
        return <Step2 formData={formData} onChange={handleChange} />;
      case 3:
        return <Step3 formData={formData} onChange={handleChange} />;
      case 4:
        return <Step4 formData={formData} onChange={handleChange} />;
      case 5:
        return <Step5 formData={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Let's set up your profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 5
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step < 5 ? handleNext : handleSubmit}>
          {renderStep()}

          <div className="flex justify-between space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {step < 5 ? 'Next' : (isSubmitting ? 'Saving...' : 'Complete Setup')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}