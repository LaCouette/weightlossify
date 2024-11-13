import React from 'react';
import { Scale } from 'lucide-react';

interface CalorieSliderProps {
  value: number;
  minCalories: number;
  maxCalories: number;
  currentChange: number;
  onChange: (value: number) => void;
}

export function CalorieSlider({
  value,
  minCalories,
  maxCalories,
  currentChange,
  onChange
}: CalorieSliderProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-5 w-5 text-orange-600" />
        <h3 className="font-medium text-gray-900">Daily Calorie Target</h3>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            {Math.round(value)}
          </div>
          <div className="text-sm text-gray-500">calories per day</div>
          <div className="text-sm font-medium mt-2" style={{
            color: currentChange > 100 ? '#16a34a' : 
                   currentChange < -100 ? '#dc2626' : 
                   '#4f46e5'
          }}>
            {currentChange > 100 ? `+${Math.round(currentChange)} cal surplus` :
             currentChange < -100 ? `${Math.round(currentChange)} cal deficit` :
             'Maintenance range'}
          </div>
        </div>

        <div className="relative pt-6 pb-2">
          <input
            type="range"
            min={minCalories}
            max={maxCalories}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            step="50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{minCalories}</span>
            <span>{maxCalories}</span>
          </div>
        </div>
      </div>
    </div>
  );
}