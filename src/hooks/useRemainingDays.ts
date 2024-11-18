import { useMemo } from 'react';
import type { DailyLog } from '../types';

interface RemainingDaysResult {
  caloriesRemainingDays: number;
  stepsRemainingDays: number;
  hasCaloriesLog: boolean;
  hasStepsLog: boolean;
}

export function useRemainingDays(logs: DailyLog[], plannedDays: any[] = []): RemainingDaysResult {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get end of current week (Sunday)
    const endOfWeek = new Date(today);
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
    endOfWeek.setDate(endOfWeek.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    // Check if today's logs exist
    const todayLog = logs.find(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    const hasCaloriesLog = todayLog?.calories !== undefined;
    const hasStepsLog = todayLog?.steps !== undefined;

    // Calculate remaining days including today if not logged
    const daysLeft = daysUntilSunday + 1; // Add 1 to include Sunday

    // Count planned days for each metric
    const plannedCaloriesDays = plannedDays.filter(day => day.calories !== undefined).length;
    const plannedStepsDays = plannedDays.filter(day => day.steps !== undefined).length;

    // Calculate remaining days for calories and steps
    const caloriesRemainingDays = hasCaloriesLog ? daysLeft - 1 : daysLeft;
    const stepsRemainingDays = hasStepsLog ? daysLeft - 1 : daysLeft;

    // Subtract planned days from remaining days
    const finalCaloriesRemainingDays = Math.max(0, caloriesRemainingDays - plannedCaloriesDays);
    const finalStepsRemainingDays = Math.max(0, stepsRemainingDays - plannedStepsDays);

    return {
      caloriesRemainingDays: finalCaloriesRemainingDays,
      stepsRemainingDays: finalStepsRemainingDays,
      hasCaloriesLog,
      hasStepsLog
    };
  }, [logs, plannedDays]);
}