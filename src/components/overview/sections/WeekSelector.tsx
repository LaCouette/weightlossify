import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatDate } from '../../../utils/dateUtils';

interface WeekSelectorProps {
  weekStart: Date;
  weekEnd: Date;
  selectedWeekOffset: number;
  onOffsetChange: (offset: number) => void;
}

export function WeekSelector({
  weekStart,
  weekEnd,
  selectedWeekOffset,
  onOffsetChange
}: WeekSelectorProps) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onOffsetChange(selectedWeekOffset - 1)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-900 font-medium">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(weekStart)} - {formatDate(weekEnd)}
              </span>
            </div>
            {selectedWeekOffset === 0 && (
              <div className="text-xs text-indigo-600 font-medium mt-0.5">
                Current Week
              </div>
            )}
          </div>

          <button
            onClick={() => onOffsetChange(selectedWeekOffset + 1)}
            disabled={selectedWeekOffset === 0}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}