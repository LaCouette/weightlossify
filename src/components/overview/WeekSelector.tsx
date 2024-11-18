import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface WeekSelectorProps {
  weekStart: Date;
  weekEnd: Date;
  selectedWeekOffset: number;
  onOffsetChange: (offset: number) => void;
}

export function WeekSelector({ weekStart, weekEnd, selectedWeekOffset, onOffsetChange }: WeekSelectorProps) {
  return (
    <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onOffsetChange(selectedWeekOffset - 1)}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="text-center">
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

          <button
            onClick={() => onOffsetChange(selectedWeekOffset + 1)}
            disabled={selectedWeekOffset === 0}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}