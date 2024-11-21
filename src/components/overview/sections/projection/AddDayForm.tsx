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
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <h4 className="font-medium text-gray-900">Plan New Day</h4>
        </div>
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
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="h-4 w-4 text-orange-500" />
            <label className="text-sm font-medium text-gray-700">Calories</label>
          </div>
          <input
            type="number"
            value={newDay.calories || ''}
            onChange={(e) => onChange({ 
              calories: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Enter calories"
            step="50"
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-green-500" />
            <label className="text-sm font-medium text-gray-700">Steps</label>
          </div>
          <input
            type="number"
            value={newDay.steps || ''}
            onChange={(e) => onChange({ 
              steps: e.target.value ? Number(e.target.value) : undefined 
            })}
            placeholder="Enter steps"
            step="100"
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onAdd}
          disabled={!newDay.calories && !newDay.steps}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Add Plan
        </button>
      </div>
    </div>
  );
}