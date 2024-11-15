import { useState } from 'react';

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
  const calculateRemainingTargets = (plannedDays: PlannedDay[], futureDates: Date[]) => {
    // Count days with calories and steps separately
    const daysWithCalories = plannedDays.filter(day => day.calories !== undefined).length;
    const daysWithSteps = plannedDays.filter(day => day.steps !== undefined).length;

    const plannedCalories = plannedDays.reduce((sum, day) => sum + (day.calories || 0), 0);
    const plannedSteps = plannedDays.reduce((sum, day) => sum + (day.steps || 0), 0);

    // Calculate remaining unplanned days for each metric
    const unplannedCalorieDays = futureDates.length - daysWithCalories;
    const unplannedStepDays = futureDates.length - daysWithSteps;

    if (unplannedCalorieDays <= 0 && unplannedStepDays <= 0) return null;

    // Calculate remaining targets for each metric separately
    const remainingCalories = weeklyCaloriesTarget - currentTotals.calories - plannedCalories;
    const remainingSteps = weeklyStepsTarget - currentTotals.steps - plannedSteps;

    let requiredDailyCalories = unplannedCalorieDays > 0 
      ? remainingCalories / unplannedCalorieDays 
      : null;
    let requiredDailySteps = unplannedStepDays > 0 
      ? remainingSteps / unplannedStepDays 
      : null;

    // If calories are negative, adjust steps to compensate
    let calorieDeficitAdjustment = null;
    if (requiredDailyCalories !== null && requiredDailyCalories < 0 && requiredDailySteps !== null) {
      const totalCalorieDeficit = Math.abs(requiredDailyCalories * unplannedCalorieDays);
      const additionalStepsNeeded = Math.ceil(totalCalorieDeficit / CALORIES_PER_STEP);
      const additionalStepsPerDay = Math.ceil(additionalStepsNeeded / unplannedStepDays);
      
      requiredDailyCalories = 0;
      requiredDailySteps += additionalStepsPerDay;
      calorieDeficitAdjustment = {
        additionalSteps: additionalStepsPerDay,
        totalSteps: requiredDailySteps,
        days: unplannedStepDays
      };
    }

    return {
      calories: requiredDailyCalories,
      steps: requiredDailySteps,
      unplannedCalorieDays,
      unplannedStepDays,
      calorieDeficitAdjustment
    };
  };

  return { calculateRemainingTargets };
}