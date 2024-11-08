import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '../../../types/profile';

interface BasicInformationProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function BasicInformation({ profile, isEditing, onChange }: BasicInformationProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Basic Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={onChange}
              disabled={!isEditing}
              min="13"
              max="120"
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}