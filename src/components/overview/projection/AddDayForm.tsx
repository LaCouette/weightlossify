import React from 'react';
import { X, Calendar, Activity, Utensils } from 'lucide-react';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

interface AddDayFormProps {
  newDay: PlannedDay;
  futureDates: Date[];
  plannedDays: PlannedDay[];
  onCancel: () => void;
  onAdd: () => void;
  onChange: (updates: Partial<PlannedDay>) => void;
}

export function AddDayForm({
  newDay,
  futureDates,
  plannedDays,
  onCancel,
  onAdd,
  onChange
}: AddDayFormProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Plan New Day</h4>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <select
            value={newDay.date.toISOString()}
            onChange={(e) => onChange({ date: new Date(e.target.value) })}
            className="w-full p-2 border border-gray-200 rounded-lg"
          >
            {futureDates.map(date => (
              <option 
                key={date.toISOString()} 
                value={date.toISOString()}
                disabled={plannedDays.some(day => 
                  day.date.toDateString() === date.toDateString()
                )}
              >
                {date.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
          <input
            type="number"
            value={newDay.calories || ''}
            onChange={(e) => onChange({ 
              calories: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Enter calories"
            className="w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
          <input
            type="number"
            value={newDay.steps || ''}
            onChange={(e) => onChange({ 
              steps: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Enter steps"
            className="w-full p-2 border border-gray-200 rounded-lg"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onAdd}
          disabled={!newDay.calories && !newDay.steps}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Add Plan
        </button>
      </div>
    </div>
  );
}