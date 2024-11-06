import React from 'react';
import { FormData } from '../../../types/profile';
import { Ruler, Scale, Activity } from 'lucide-react';

interface Step2Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const activityLevels = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise'
  },
  {
    value: 'light',
    label: 'Light Activity',
    description: 'Exercise 1-3 times/week'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Exercise 3-5 times/week'
  },
  {
    value: 'very',
    label: 'Very Active',
    description: 'Exercise 6-7 times/week'
  },
  {
    value: 'extra',
    label: 'Extra Active',
    description: 'Very active & physical job'
  }
];

export function Step2({ formData, onChange }: Step2Props) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Physical Stats</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          These measurements help us calculate your energy needs and create appropriate goals for your journey.
        </p>
      </div>

      <div className="space-y-6">
        {/* Height Field */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Ruler className="h-5 w-5 text-blue-600" />
            </div>
            <label className="block font-bold text-gray-900">Height</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              name="height"
              required
              min="100"
              max="250"
              value={formData.height || ''}
              onChange={onChange}
              placeholder="Enter your height"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <span className="text-sm text-gray-500 min-w-[60px]">cm</span>
          </div>
        </div>

        {/* Weight Field */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Scale className="h-5 w-5 text-orange-600" />
            </div>
            <label className="block font-bold text-gray-900">Current Weight</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              name="currentWeight"
              required
              min="30"
              max="300"
              step="0.1"
              value={formData.currentWeight || ''}
              onChange={onChange}
              placeholder="Enter your current weight"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="text-sm text-gray-500 min-w-[60px]">kg</span>
          </div>
        </div>

        {/* Activity Level Field */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <label className="block font-bold text-gray-900">Activity Level</label>
          </div>
          <div className="space-y-3">
            {activityLevels.map(({ value, label, description }) => (
              <label
                key={value}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.activityLevel === value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-200'
                }`}
              >
                <input
                  type="radio"
                  name="activityLevel"
                  value={value}
                  checked={formData.activityLevel === value}
                  onChange={onChange}
                  className="sr-only"
                />
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`font-medium ${
                      formData.activityLevel === value ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {label}
                    </span>
                    <p className={`text-sm ${
                      formData.activityLevel === value ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {description}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.activityLevel === value
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.activityLevel === value && (
                      <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}