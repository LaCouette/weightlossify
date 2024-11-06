import React from 'react';
import { FormData } from '../../../types/profile';

interface Step3Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Step3({ formData, onChange }: Step3Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
        <select
          name="primaryGoal"
          required
          value={formData.primaryGoal}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select your primary goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {formData.primaryGoal === 'weight_loss' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Weight (kg)</label>
            <input
              type="number"
              name="targetWeight"
              min={30}
              max={formData.currentWeight - 1}
              step="0.1"
              value={formData.targetWeight || ''}
              onChange={onChange}
              placeholder="Enter your target weight"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weekly Weight Loss Goal</label>
            <select
              name="weeklyWeightGoal"
              required
              value={formData.weeklyWeightGoal || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select your weekly goal</option>
              <option value="0.25">Lose 0.25 kg per week</option>
              <option value="0.5">Lose 0.5 kg per week</option>
              <option value="0.75">Lose 0.75 kg per week</option>
              <option value="1">Lose 1 kg per week</option>
            </select>
          </div>
        </>
      )}

      {formData.primaryGoal === 'muscle_gain' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Muscle Gain Goal</label>
          <select
            name="weeklyWeightGoal"
            required
            value={formData.weeklyWeightGoal || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select your monthly goal</option>
            <option value="0.5">Gain 0.5 kg per month</option>
            <option value="1">Gain 1 kg per month</option>
            <option value="1.5">Gain 1.5 kg per month</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Secondary Goal</label>
        <select
          name="secondaryGoal"
          required
          value={formData.secondaryGoal}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select your secondary goal</option>
          <option value="body_composition">Improve Body Composition</option>
          <option value="stamina">Increase Stamina</option>
          <option value="diet_quality">Improve Diet Quality</option>
        </select>
      </div>
    </div>
  );
}