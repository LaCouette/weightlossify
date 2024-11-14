import React from 'react';
import { Calendar, Activity, Utensils, X } from 'lucide-react';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

interface PlannedDaysListProps {
  plannedDays: PlannedDay[];
  onRemove: (index: number) => void;
}

export function PlannedDaysList({ plannedDays, onRemove }: PlannedDaysListProps) {
  if (plannedDays.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="font-medium text-gray-900 mb-3">Planned Days</h4>
      <div className="space-y-2">
        {plannedDays.map((day, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {day.date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              {day.calories && (
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">
                    {day.calories.toLocaleString()} kcal
                  </span>
                </div>
              )}
              {day.steps && (
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {day.steps.toLocaleString()} steps
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}