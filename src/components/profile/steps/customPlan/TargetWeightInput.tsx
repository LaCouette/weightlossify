import React from 'react';
import { Target } from 'lucide-react';

interface TargetWeightInputProps {
  value: number | undefined;
  currentWeight: number;
  onChange: (value: number | undefined) => void;
}

export function TargetWeightInput({ value, currentWeight, onChange }: TargetWeightInputProps) {
  // Round min/max values to nearest 0.5
  const minWeight = Math.ceil(currentWeight * 0.6 * 2) / 2;
  const maxWeight = Math.floor((currentWeight - 0.5) * 2) / 2;

  const handleChange = (newValue: number) => {
    // Round to nearest 0.5
    const roundedValue = Math.round(newValue * 2) / 2;
    const clampedValue = Math.min(Math.max(roundedValue, minWeight), maxWeight);
    onChange(clampedValue);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900">Target Weight (Optional)</h3>
          <p className="text-sm text-gray-500 mt-1">Set a target weight to track your progress</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {value?.toFixed(1) || '-'} kg
          </div>
          {value && (
            <div className="text-sm text-blue-600 mt-1">
              Total to lose: {(currentWeight - value).toFixed(1)} kg
            </div>
          )}
        </div>

        <div className="relative pt-6 pb-2">
          <div className="relative h-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full shadow-inner" />
            <input
              type="range"
              value={value || maxWeight}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
              step="0.5"
              min={minWeight}
              max={maxWeight}
              style={{
                '--thumb-size': '2rem',
                '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)'
              } as React.CSSProperties}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>{minWeight.toFixed(1)} kg</span>
            <span>{maxWeight.toFixed(1)} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}