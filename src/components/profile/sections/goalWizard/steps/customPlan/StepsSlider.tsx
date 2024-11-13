import React from 'react';
import { Activity } from 'lucide-react';
import { MAX_STEPS } from '../../../../utils/calorieCalculations';

interface StepsSliderProps {
  value: number;
  neat: number;
  onChange: (value: number) => void;
}

export function StepsSlider({ value, neat, onChange }: StepsSliderProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-green-600" />
        <h3 className="font-medium text-gray-900">Daily Steps Target</h3>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">steps per day</div>
          <div className="text-sm text-green-600 mt-1">
            (+{Math.round(neat)} kcal from activity)
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          <input
            type="range"
            min={0}
            max={MAX_STEPS}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            step="100"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0</span>
            <span>{MAX_STEPS.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}