import React from 'react';
import { BarChart, Scale, Target } from 'lucide-react';

interface MaintenanceGoalsProps {
  currentWeight: number;
  height: number;
  age: number;
  gender: string;
  bodyFat: number;
  onChange: (updates: any) => void;
}

export function MaintenanceGoals({
  currentWeight,
  height,
  age,
  gender,
  bodyFat,
  onChange
}: MaintenanceGoalsProps) {
  // Set initial values for maintenance plan
  React.useEffect(() => {
    onChange({
      primaryGoal: 'maintenance',
      weeklyWeightGoal: undefined,
      targetWeight: undefined
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Weight Maintenance Plan</h3>
        <p className="text-sm text-gray-600">
          Focus on body recomposition while maintaining weight
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Current Weight</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {currentWeight.toFixed(1)}kg
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Your maintenance target
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Target Range</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">±1kg</p>
          <p className="text-sm text-gray-600 mt-1">
            Acceptable fluctuation range
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
        <h4 className="font-semibold text-gray-900 mb-4">Balanced Approach</h4>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Your maintenance plan focuses on:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Maintaining current weight within ±1kg range</li>
            <li>• Improving body composition through proper nutrition</li>
            <li>• Building strength and fitness gradually</li>
            <li>• Creating sustainable, long-term habits</li>
          </ul>
          <div className="mt-4 text-sm text-gray-700">
            <strong>Your Maintenance Zone:</strong> We'll help you stay within ±1kg of your current weight 
            while potentially improving your body composition through proper training and nutrition.
          </div>
        </div>
      </div>
    </div>
  );
}