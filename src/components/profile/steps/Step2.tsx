import React from 'react';
import { FormData } from '../../../types/profile';

interface Step2Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step2({ formData, onChange }: Step2Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
        <input
          type="number"
          name="height"
          required
          min="100"
          max="250"
          value={formData.height || ''}
          onChange={onChange}
          placeholder="Enter your height in centimeters"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Current Weight (kg)</label>
        <input
          type="number"
          name="currentWeight"
          required
          min="30"
          max="300"
          step="0.1"
          value={formData.currentWeight || ''}
          onChange={onChange}
          placeholder="Enter your current weight in kilograms"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Activity Level</label>
        <select
          name="activityLevel"
          required
          value={formData.activityLevel}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select your activity level</option>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Light (exercise 1-3 times/week)</option>
          <option value="moderate">Moderate (exercise 3-5 times/week)</option>
          <option value="very">Very Active (exercise 6-7 times/week)</option>
          <option value="extra">Extra Active (very active & physical job)</option>
        </select>
      </div>
    </div>
  );
}