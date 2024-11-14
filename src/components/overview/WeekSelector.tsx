import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface WeekSelectorProps {
  weekStart: Date;
  weekEnd: Date;
  selectedWeekOffset: number;
  onOffsetChange: (offset: number) => void;
}

export function WeekSelector({ weekStart, weekEnd, selectedWeekOffset, onOffsetChange }: WeekSelectorProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Minimum swipe distance to trigger week change (in pixels)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedWeekOffset > 0) {
      setIsAnimating(true);
      onOffsetChange(selectedWeekOffset - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
    if (isRightSwipe) {
      setIsAnimating(true);
      onOffsetChange(selectedWeekOffset + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const getSwipeTransform = () => {
    if (!touchStart || !touchEnd) return 'translateX(0)';
    const distance = touchEnd - touchStart;
    // Limit the drag distance and add some resistance
    const maxDrag = 100;
    const dampenedDistance = Math.sign(distance) * Math.min(Math.abs(distance) * 0.5, maxDrag);
    return `translateX(${dampenedDistance}px)`;
  };

  return (
    <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm touch-pan-y">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onOffsetChange(selectedWeekOffset - 1)}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors sm:block hidden"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <div 
            className="flex-1 sm:flex-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`text-center transition-transform ${isAnimating ? 'duration-300 ease-out' : 'duration-0'}`}
              style={{ transform: getSwipeTransform() }}
            >
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {formatDate(weekStart)} - {formatDate(weekEnd)}
                </span>
              </div>
              {selectedWeekOffset === 0 && (
                <div className="text-sm text-indigo-600 font-medium mt-1">Current Week</div>
              )}
            </div>
          </div>

          <button
            onClick={() => onOffsetChange(selectedWeekOffset + 1)}
            disabled={selectedWeekOffset === 0}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors disabled:opacity-50 sm:block hidden"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}