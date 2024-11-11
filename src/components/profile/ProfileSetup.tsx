import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useLogsStore } from '../../stores/logsStore';
import { useWeightStore } from '../../stores/weightStore';
import { FormData } from '../../types/profile';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/Step4';
import { Step5 } from './steps/Step5';
import { AlertTriangle } from 'lucide-react';

export function ProfileSetup() {
  const { user } = useAuthStore();
  const { profile, addProfile, updateProfile } = useUserStore();
  const { addLog } = useLogsStore();
  const updateCurrentWeight = useWeightStore(state => state.updateCurrentWeight);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: user?.email || '',
    name: '',
    gender: '',
    age: 0,
    height: 0,
    currentWeight: 0,
    bodyFat: 0,
    activityLevel: '',
    primaryGoal: '',
    targetWeight: 0,
    weeklyWeightGoal: '',
    dailyStepsGoal: 0,
    dailyCaloriesTarget: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing profile data if available
  useEffect(() => {
    if (profile) {
      setFormData({
        email: user?.email || '',
        name: profile.name,
        gender: profile.gender,
        age: profile.age,
        height: profile.height,
        currentWeight: profile.currentWeight,
        bodyFat: profile.bodyFat || 0,
        activityLevel: profile.activityLevel,
        primaryGoal: profile.primaryGoal,
        targetWeight: profile.targetWeight || 0,
        weeklyWeightGoal: profile.weeklyWeightGoal || '',
        dailyStepsGoal: profile.dailyStepsGoal,
        dailyCaloriesTarget: profile.dailyCaloriesTarget
      });
    }
  }, [profile, user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'height', 'currentWeight', 'targetWeight', 'dailyStepsGoal', 'dailyCaloriesTarget', 'bodyFat']
        .includes(name) ? Number(value) : value
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleCancel = async () => {
    if (!user?.uid || !profile) return;
    
    try {
      setIsSubmitting(true);
      // Restore setupCompleted flag
      await updateProfile(user.uid, {
        ...profile,
        setupCompleted: true,
        updatedAt: new Date()
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error canceling setup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create weight log entry if weight changed
      if (formData.currentWeight > 0) {
        // Add weight log
        await addLog(user.uid, {
          date: new Date().toISOString(),
          weight: formData.currentWeight,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Update global weight state
        updateCurrentWeight(formData.currentWeight);
      }

      // Save profile
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
            {profile ? 'Update Your Profile' : "Let's set up your profile"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 5
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step < 5 ? handleNext : handleSubmit}>
          {renderStep()}

          <div className="flex justify-between space-x-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                disabled={isSubmitting}
                className="flex-1 py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Cancel Setup
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

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
            <div className="flex items-center gap-3 text-yellow-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Cancel Setup?</h3>
            </div>
            
            <p className="text-gray-600">
              Are you sure you want to cancel the setup? Your previous profile settings will be restored.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Continue Setup
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {isSubmitting ? 'Canceling...' : 'Yes, Cancel Setup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}