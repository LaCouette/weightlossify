import React from 'react';
import { Ruler } from 'lucide-react';
import { UserProfile } from '../../../types/profile';

interface PhysicalMeasurementsProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PhysicalMeasurements({ profile, isEditing, onChange }: PhysicalMeasurementsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Ruler className="h-5 w-5 text-green-500" />
        <h2 className="text-lg font-semibold">Physical Measurements</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={onChange}
              disabled={!isEditing}
              min="140"
              max="220"
              step="0.1"
              className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">cm</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Weight</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="currentWeight"
              value={profile.currentWeight}
              onChange={onChange}
              disabled={!isEditing}
              min="40"
              max="200"
              step="0.1"
              className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">kg</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Body Fat Percentage</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="bodyFat"
              value={profile.bodyFat}
              onChange={onChange}
              disabled={!isEditing}
              min="3"
              max="50"
              step="0.1"
              className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={profile.activityLevel}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="light">Light (1-2 workouts/week)</option>
            <option value="gym_bro">Gym Bro (3-5 workouts/week)</option>
            <option value="gym_rat">Gym Rat (6+ workouts/week)</option>
          </select>
        </div>
      </div>
    </div>
  );
}