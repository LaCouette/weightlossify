import React from 'react';
import { Target } from 'lucide-react';

interface TargetWeightInputProps {
  value: number | undefined;
  currentWeight: number;
  onChange: (value: number | undefined) => void;
}

export function TargetWeightInput({ value, currentWeight, onChange }: TargetWeightInputProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900">Target Weight (Optional)</h3>
          <p className="text-sm text-gray-500 mt-1">Set a target weight to track your progress</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => {
              const newValue = e.target.value ? Number(e.target.value) : undefined;
              onChange(newValue);
            }}
            placeholder="Enter target weight"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={Math.max(40, currentWeight * 0.5)}
            max={currentWeight - 0.5}
            step="0.5"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
        </div>
      </div>

      {value && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            Total to lose: {(currentWeight - value).toFixed(1)}kg
          </div>
        </div>
      )}
    </div>
  );
}