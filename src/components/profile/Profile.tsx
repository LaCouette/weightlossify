import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { UserProfile } from '../../types/profile';

// Import section components
import { ProfileHeader } from './sections/ProfileHeader';
import { BasicInformation } from './sections/BasicInformation';
import { PhysicalMeasurements } from './sections/PhysicalMeasurements';
import { GoalsTargets } from './sections/GoalsTargets';
import { DailyTargets } from './sections/DailyTargets';
import { CalculatedMetrics } from './sections/CalculatedMetrics';
import { ProfileTimestamps } from './sections/ProfileTimestamps';
import { FormActions } from './sections/FormActions';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleRestartSetup = async () => {
    if (!user || isResetting) return;
    
    try {
      setIsResetting(true);
      await updateProfile(user.uid, {
        ...profile,
        setupCompleted: false,
        updatedAt: new Date()
      });
      navigate('/profile-setup');
    } catch (err) {
      setError('Failed to restart profile setup. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (!user || !profile || !editedProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: ['age', 'height', 'currentWeight', 'targetWeight', 'dailyStepGoal', 'dailyCaloriesTarget']
          .includes(name) ? Number(value) : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editedProfile) return;

    try {
      setIsLoading(true);
      setError(null);
      await updateProfile(user.uid, {
        ...editedProfile,
        updatedAt: new Date()
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ProfileHeader
          isEditing={isEditing}
          isResetting={isResetting}
          setIsEditing={setIsEditing}
          onRestartSetup={handleRestartSetup}
          error={error}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformation
            profile={editedProfile}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <PhysicalMeasurements
            profile={editedProfile}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <GoalsTargets
            profile={editedProfile}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <DailyTargets
            profile={editedProfile}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <CalculatedMetrics profile={editedProfile} />

          <ProfileTimestamps
            createdAt={profile.createdAt}
            updatedAt={profile.updatedAt}
          />

          <FormActions
            isEditing={isEditing}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
}