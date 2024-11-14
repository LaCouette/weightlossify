import React, { useState, useEffect, useRef } from 'react';
import { Scale } from 'lucide-react';
import '../../../styles/slider.css';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [startX, setStartX] = useState(0);

  // Calculate adjustment range (±20% of initial values)
  const calorieRange = initialCalories * 0.2;
  const minCalories = initialCalories - calorieRange;
  const maxCalories = initialCalories + calorieRange;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset slider when initial values change
  useEffect(() => {
    setSliderValue(50);
    setSliderPosition(0);
  }, [initialCalories, initialSteps]);

  const updateTargetsFromPosition = (position: number) => {
    // Convert position to percentage (-100 to 100)
    const containerWidth = sliderRef.current?.clientWidth || 200;
    const maxMove = containerWidth / 2;
    const movePercent = Math.max(-100, Math.min(100, (position / maxMove) * 100));
    
    // Calculate new calories based on movement
    const calorieAdjustment = (movePercent / 100) * calorieRange;
    const newCalories = Math.round(initialCalories + calorieAdjustment);
    
    // Calculate required steps to maintain the same energy balance
    const calorieChange = newCalories - initialCalories;
    const stepChange = Math.round(calorieChange / 0.045); // 0.045 calories per step
    const newSteps = initialSteps + stepChange;

    onTargetsChange(newCalories, newSteps);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = sliderRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      setStartX(touch.clientX - sliderPosition);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const newPosition = touch.clientX - startX;
    const containerWidth = sliderRef.current?.clientWidth || 200;
    const maxMove = containerWidth / 2;
    
    // Limit movement and add resistance at edges
    const boundedPosition = Math.min(maxMove, Math.max(-maxMove, newPosition));
    setSliderPosition(boundedPosition);
    updateTargetsFromPosition(boundedPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTraditionalSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    
    // Convert 0-100 range to -20% to +20% range
    const movePercent = ((value - 50) / 50) * 100;
    const calorieAdjustment = (movePercent / 100) * calorieRange;
    const newCalories = Math.round(initialCalories + calorieAdjustment);
    
    // Calculate required steps to maintain the same energy balance
    const calorieChange = newCalories - initialCalories;
    const stepChange = Math.round(calorieChange / 0.045);
    const newSteps = initialSteps + stepChange;

    onTargetsChange(newCalories, newSteps);
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-900">
          Adjust Daily Targets
        </span>
      </div>

      {isMobile ? (
        // Mobile Touch Slider
        <div 
          ref={sliderRef}
          className="relative h-12 bg-gray-100 rounded-full touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="touch-slider-track" />
          
          <div 
            className={`touch-slider-handle ${isDragging ? 'scale-110' : ''}`}
            style={{
              transform: `translate3d(${sliderPosition}px, -50%, 0)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          />

          <div className="absolute -bottom-6 left-4 text-xs text-gray-500">
            Decrease
          </div>
          <div className="absolute -bottom-6 right-4 text-xs text-gray-500">
            Increase
          </div>
        </div>
      ) : (
        // Desktop Traditional Slider
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleTraditionalSliderChange}
            className="range-slider"
          />
          <div className="flex justify-between text-xs text-gray-500 px-1">
            <span>-20%</span>
            <span>Current</span>
            <span>+20%</span>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-center text-gray-600">
        Adjust targets while maintaining energy balance
      </p>
    </div>
  );
}