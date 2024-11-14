import React, { useState } from 'react';
import { Calculator, Activity, Utensils, Plus, X, Calendar } from 'lucide-react';
import { DailyLog } from '../../types';

interface ProjectionData {
  remainingDays: number;
  requiredDailyCalories: number | null;
  requiredDailySteps: number | null;
  isCaloriesAchievable: boolean;
  isStepsAchievable: boolean;
}

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

interface InteractiveProjectionProps {
  data: ProjectionData;
  remainingDates: Date[];
  weeklyCaloriesTarget: number;
  weeklyStepsTarget: number;
  currentTotals: {
    calories: number;
    steps: number;
  };
}

export function InteractiveProjection({ 
  data, 
  remainingDates,
  weeklyCaloriesTarget,
  weeklyStepsTarget,
  currentTotals
}: InteractiveProjectionProps) {
  const [plannedDays, setPlannedDays] = useState<PlannedDay[]>([]);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDay, setNewDay] = useState<PlannedDay>({
    date: remainingDates[0],
    calories: undefined,
    steps: undefined
  });

  // Calculate remaining targets after accounting for planned days
  const calculateRemainingTargets = () => {
    const plannedCalories = plannedDays.reduce((sum, day) => sum + (day.calories || 0), 0);
    const plannedSteps = plannedDays.reduce((sum, day) => sum + (day.steps || 0), 0);

    const totalPlannedDays = plannedDays.length;
    const unplannedDays = data.remainingDays - totalPlannedDays;

    if (unplannedDays <= 0) return null;

    const remainingCalories = weeklyCaloriesTarget - currentTotals.calories - plannedCalories;
    const remainingSteps = weeklyStepsTarget - currentTotals.steps - plannedSteps;

    const requiredDailyCalories = remainingCalories / unplannedDays;
    const requiredDailySteps = remainingSteps / unplannedDays;

    return {
      calories: requiredDailyCalories,
      steps: requiredDailySteps,
      unplannedDays
    };
  };

  const remainingTargets = calculateRemainingTargets();

  const handleAddDay = () => {
    if (!newDay.calories && !newDay.steps) return;

    setPlannedDays(prev => [...prev, newDay]);
    setNewDay({
      date: remainingDates[0],
      calories: undefined,
      steps: undefined
    });
    setIsAddingDay(false);
  };

  const handleRemoveDay = (index: number) => {
    setPlannedDays(prev => prev.filter((_, i) => i !== index));
  };

  if (data.remainingDays === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interactive Projection</h3>
            <p className="text-sm text-gray-600">
              Plan ahead and see adjusted daily targets
            </p>
          </div>
        </div>

        {!isAddingDay && (
          <button
            onClick={() => setIsAddingDay(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Plan Day</span>
          </button>
        )}
      </div>

      {/* Add New Day Form */}
      {isAddingDay && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Plan New Day</h4>
            <button
              onClick={() => setIsAddingDay(false)}
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
                onChange={(e) => setNewDay(prev => ({ ...prev, date: new Date(e.target.value) }))}
                className="w-full p-2 border border-gray-200 rounded-lg"
              >
                {remainingDates.map(date => (
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
                onChange={(e) => setNewDay(prev => ({ 
                  ...prev, 
                  calories: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="Enter calories"
                className="w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
              <input
                type="number"
                value={newDay.steps || ''}
                onChange={(e) => setNewDay(prev => ({ 
                  ...prev, 
                  steps: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="Enter steps"
                className="w-full p-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddDay}
              disabled={!newDay.calories && !newDay.steps}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Add Plan
            </button>
          </div>
        </div>
      )}

      {/* Planned Days List */}
      {plannedDays.length > 0 && (
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
                  onClick={() => handleRemoveDay(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjusted Daily Targets */}
      {remainingTargets && remainingTargets.unplannedDays > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Adjusted Daily Targets for {remainingTargets.unplannedDays} Remaining Day{remainingTargets.unplannedDays > 1 ? 's' : ''}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {remainingTargets.calories > 0 && (
              <div className={`rounded-xl p-4 border ${
                remainingTargets.calories <= data.requiredDailyCalories! * 1.5
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                  : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-4 w-4 text-gray-600" />
                  <div className="text-sm font-medium text-gray-900">Required Calories</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(remainingTargets.calories).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">per day</div>
              </div>
            )}

            {remainingTargets.steps > 0 && (
              <div className={`rounded-xl p-4 border ${
                remainingTargets.steps <= data.requiredDailySteps! * 1.5
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                  : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-600" />
                  <div className="text-sm font-medium text-gray-900">Required Steps</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(remainingTargets.steps).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">per day</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}