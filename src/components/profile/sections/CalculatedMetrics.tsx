import React from 'react';
import { Activity, Scale, Heart, Target } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { calculateBMI, calculateBMR, getBMICategory } from '../../../utils/calculations';

interface CalculatedMetricsProps {
  profile: UserProfile;
}

export function CalculatedMetrics({ profile }: CalculatedMetricsProps) {
  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(
    profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold">Calculated Metrics</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">BMI</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{bmi.toFixed(1)}</div>
          <div className="text-sm text-gray-500">{bmiCategory}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">BMR</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{Math.round(bmr)}</div>
          <div className="text-sm text-gray-500">calories/day</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-700">Weight to Goal</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {profile.targetWeight 
              ? Math.abs(profile.currentWeight - profile.targetWeight).toFixed(1)
              : '-'}
          </div>
          <div className="text-sm text-gray-500">kg remaining</div>
        </div>
      </div>
    </div>
  );
}