import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { UserProfile } from '../../types/profile';
import { Edit, Save, User, Activity, Scale, Target } from 'lucide-react';

export function Profile() {
  const { user } = useAuthStore();
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  if (!user || !profile || !editedProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
        [name]: name === 'dailyStepGoal' || name === 'dailyCalorieTarget' 
          ? parseInt(value, 10) 
          : value
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

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={editedProfile.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={editedProfile.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Weight (kg)</label>
                <input
                  type="number"
                  name="currentWeight"
                  value={editedProfile.currentWeight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Weight (kg)</label>
                <input
                  type="number"
                  name="targetWeight"
                  value={editedProfile.targetWeight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                <select
                  name="activityLevel"
                  value={editedProfile.activityLevel}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="very">Very Active</option>
                  <option value="extra">Extra Active</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Goals</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Step Goal</label>
                  <div className="mt-1 flex items-center">
                    <Activity className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="number"
                        name="dailyStepGoal"
                        value={editedProfile.dailyStepGoal}
                        onChange={handleInputChange}
                        min={1000}
                        max={100000}
                        step={100}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span>{editedProfile.dailyStepGoal?.toLocaleString() || 'Not set'}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Daily Calorie Target</label>
                  <div className="mt-1 flex items-center">
                    <Scale className="h-5 w-5 text-gray-400 mr-2" />
                    {isEditing ? (
                      <input
                        type="number"
                        name="dailyCalorieTarget"
                        value={editedProfile.dailyCalorieTarget}
                        onChange={handleInputChange}
                        min={1000}
                        max={10000}
                        step={50}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <span>{editedProfile.dailyCalorieTarget?.toLocaleString() || 'Not set'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between text-sm text-gray-500">
                <div>Created: {formatDate(profile.createdAt)}</div>
                <div>Last Updated: {formatDate(profile.updatedAt)}</div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}