import React from 'react';
import { Calendar, Activity, Utensils, X, Trash2 } from 'lucide-react';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

interface PlannedDaysListProps {
  plannedDays: PlannedDay[];
  onRemove: (index: number) => void;
  onUpdateDay: (index: number, updates: Partial<PlannedDay>) => void;
}

export function PlannedDaysList({ plannedDays, onRemove, onUpdateDay }: PlannedDaysListProps) {
  if (plannedDays.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-indigo-500" />
        <h4 className="font-medium text-gray-900">Planned Days</h4>
      </div>
      <div className="space-y-2">
        {plannedDays.map((day, index) => (
          <div 
            key={index}
            className="bg-gray-50 rounded-xl p-4 relative"
          >
            <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-3">
                  {day.calories && (
                    <div className="flex items-center gap-1 group">
                      <Utensils className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">
                        {day.calories.toLocaleString()} kcal
                      </span>
                      <button
                        onClick={() => onUpdateDay(index, { calories: undefined })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {day.steps && (
                    <div className="flex items-center gap-1 group">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {day.steps.toLocaleString()} steps
                      </span>
                      <button
                        onClick={() => onUpdateDay(index, { steps: undefined })}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                title="Delete planned day"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}