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
      <div className="section-header">
        <div className="section-icon">
          <Calculator className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title">Interactive Projection</h2>
        <p className="section-description">
          Plan ahead and see adjusted daily targets
        </p>
        {!isAddingDay && (
          <button
            onClick={() => setIsAddingDay(true)}
            className="btn btn-primary mt-4"
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