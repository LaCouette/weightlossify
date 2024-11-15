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
          <div className="relative h-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full shadow-inner" />
            <input
              type="range"
              min={minCalories}
              max={maxCalories}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
              step="50"
              style={{
                '--thumb-size': '2rem',
                '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)'
              } as React.CSSProperties}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>{minCalories}</span>
            <span>{maxCalories}</span>
          </div>
        </div>
      </div>
    </div>
  );
}