import React from 'react';
import { Calculator, Plus } from 'lucide-react';
import { AddDayForm } from './projection/AddDayForm';
import { PlannedDaysList } from './projection/PlannedDaysList';
import { AdjustedTargets } from './projection/AdjustedTargets';
import { useProjectionCalculator } from './projection/useProjectionCalculator';
import { usePlannedDays } from './projection/usePlannedDays';

interface ProjectionData {
  remainingDays: number;
  requiredDailyCalories: number | null;
  requiredDailySteps: number | null;
  isCaloriesAchievable: boolean;
  isStepsAchievable: boolean;
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
  // Filter out today and past dates
  const futureDates = remainingDates.filter(date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck > today;
  });

  // Don't show the component if there are no future dates to plan
  if (futureDates.length === 0) return null;

  const {
    plannedDays,
    isAddingDay,
    newDay,
    setIsAddingDay,
    handleAddDay,
    handleRemoveDay,
    updateNewDay
  } = usePlannedDays(futureDates[0]);

  const { calculateRemainingTargets } = useProjectionCalculator(
    weeklyCaloriesTarget,
    weeklyStepsTarget,
    currentTotals
  );

  const remainingTargets = calculateRemainingTargets(plannedDays, futureDates);

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

      {isAddingDay && (
        <AddDayForm
          newDay={newDay}
          futureDates={futureDates}
          plannedDays={plannedDays}
          onCancel={() => setIsAddingDay(false)}
          onAdd={handleAddDay}
          onChange={updateNewDay}
        />
      )}

      <PlannedDaysList
        plannedDays={plannedDays}
        onRemove={handleRemoveDay}
      />

      {remainingTargets && (
        <AdjustedTargets
          remainingTargets={remainingTargets}
          projectionData={data}
        />
      )}
    </div>
  );
}