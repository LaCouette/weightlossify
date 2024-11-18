import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';

interface TargetSliderProps {
  initialCalories: number;
  initialSteps: number;
  onTargetsChange: (calories: number, steps: number) => void;
}

export function TargetSlider({ 
  initialCalories, 
  initialSteps,
  onTargetsChange 
}: TargetSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);

  // Calculate adjustment range (±20% of initial values)
  const calorieRange = initialCalories * 0.2;
  const minCalories = Math.floor((initialCalories - calorieRange) / 50) * 50; // Round down to nearest 50
  const maxCalories = Math.ceil((initialCalories + calorieRange) / 50) * 50; // Round up to nearest 50

  const stepsRange = initialSteps * 0.2;
  const minSteps = Math.floor((initialSteps - stepsRange) / 100) * 100; // Round down to nearest 100
  const maxSteps = Math.ceil((initialSteps + stepsRange) / 100) * 100; // Round up to nearest 100

  // Reset slider when initial values change
  useEffect(() => {
    setSliderValue(50);
  }, [initialCalories, initialSteps]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    
    // Convert 0-100 range to -20% to +20% range
    const movePercent = ((value - 50) / 50) * 100;
    
    // Calculate calories with 50 increment
    const calorieAdjustment = Math.round((movePercent / 100) * calorieRange / 50) * 50;
    const newCalories = initialCalories + calorieAdjustment;
    
    // Calculate steps with 100 increment
    const stepAdjustment = Math.round((movePercent / 100) * stepsRange / 100) * 100;
    const newSteps = Math.max(0, initialSteps + stepAdjustment);

    // If steps would be negative, adjust calories to maintain minimum 0 steps
    if (initialSteps + stepAdjustment < 0) {
      const maxDeficit = Math.round(initialSteps * 0.045); // Maximum calorie deficit possible from steps
      const adjustedCalories = Math.round((initialCalories - maxDeficit) / 50) * 50;
      onTargetsChange(adjustedCalories, 0);
    } else {
      onTargetsChange(newCalories, newSteps);
    }
  };

  const handleReset = () => {
    setSliderValue(50);
    onTargetsChange(initialCalories, initialSteps);
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg shadow-sm">
          <Scale className="h-4 w-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-900">
          Adjust Daily Targets
        </span>
      </div>

      <div className="space-y-2">
        <div className="relative h-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full shadow-inner" />
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
            style={{
              '--thumb-size': '2rem',
              '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)'
            } as React.CSSProperties}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>-20%</span>
          <button
            onClick={handleReset}
            className={`px-2 py-1 -mx-2 rounded transition-colors hover:bg-blue-50 ${
              sliderValue === 50 ? 'text-blue-600 font-medium' : ''
            }`}
          >
            Current
          </button>
          <span>+20%</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-center text-gray-600">
        Adjust targets while maintaining energy balance
      </p>
    </div>
  );
}