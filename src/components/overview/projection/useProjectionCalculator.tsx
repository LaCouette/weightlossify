import { useState } from 'react';
import { useRemainingDays } from '../../../hooks/useRemainingDays';
import { useLogsStore } from '../../../stores/logsStore';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

const CALORIES_PER_STEP = 0.045;

export function useProjectionCalculator(
  weeklyCaloriesTarget: number,
  weeklyStepsTarget: number,
  currentTotals: {
    calories: number;
    steps: number;
  }
) {
  const { logs } = useLogsStore();

  const calculateRemainingTargets = (plannedDays: PlannedDay[], futureDates: Date[]) => {
    const {
      caloriesRemainingDays,
      stepsRemainingDays,
      hasCaloriesLog,
      hasStepsLog
    } = useRemainingDays(logs, plannedDays);

    if (caloriesRemainingDays <= 0 && stepsRemainingDays <= 0) return null;

    const plannedCalories = plannedDays.reduce((sum, day) => sum + (day.calories || 0), 0);
    const plannedSteps = plannedDays.reduce((sum, day) => sum + (day.steps || 0), 0);

    // Calculate remaining targets for each metric separately
    const remainingCalories = weeklyCaloriesTarget - currentTotals.calories - plannedCalories;
    const remainingSteps = weeklyStepsTarget - currentTotals.steps - plannedSteps;

    let requiredDailyCalories = caloriesRemainingDays > 0 
      ? remainingCalories / caloriesRemainingDays 
      : null;
    let requiredDailySteps = stepsRemainingDays > 0 
      ? remainingSteps / stepsRemainingDays 
      : null;

    // If calories are negative, adjust steps to compensate
    let calorieDeficitAdjustment = null;
    if (requiredDailyCalories !== null && requiredDailyCalories < 0 && requiredDailySteps !== null) {
      const totalCalorieDeficit = Math.abs(requiredDailyCalories * caloriesRemainingDays);
      const additionalStepsNeeded = Math.ceil(totalCalorieDeficit / CALORIES_PER_STEP);
      const additionalStepsPerDay = Math.ceil(additionalStepsNeeded / stepsRemainingDays);
      
      requiredDailyCalories = 0;
      requiredDailySteps += additionalStepsPerDay;
      calorieDeficitAdjustment = {
        additionalSteps: additionalStepsPerDay,
        totalSteps: requiredDailySteps,
        days: stepsRemainingDays
      };
    }

    return {
      calories: requiredDailyCalories,
      steps: requiredDailySteps,
      unplannedCalorieDays: caloriesRemainingDays,
      unplannedStepDays: stepsRemainingDays,
      calorieDeficitAdjustment,
      hasCaloriesLog,
      hasStepsLog
    };
  };

  return { calculateRemainingTargets };
}