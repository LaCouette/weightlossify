import React from 'react';
import { FormData } from '../../../types/profile';

interface Step1Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step1({ formData, onChange }: Step1Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={onChange}
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          required
          value={formData.gender}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          name="age"
          required
          min="13"
          max="120"
          value={formData.age || ''}
          onChange={onChange}
          placeholder="Enter your age"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}