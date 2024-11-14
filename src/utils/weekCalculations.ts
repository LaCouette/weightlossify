import { DailyLog } from '../types';
import { calculateBMR, calculateBaseMaintenance, calculateNEAT } from './calorieCalculations';
import { UserProfile } from '../types/profile';

export function getWeekRange(offset: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay() + 1 + (offset * 7)); // Monday
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });
}

export function calculateDayMetrics(
  dayLog: DailyLog | undefined,
  profile: UserProfile
) {
  if (!dayLog) return null;

  const bmr = calculateBMR(
    dayLog.weight || profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );
  const baseMaintenance = calculateBaseMaintenance(bmr);
  const neat = calculateNEAT(dayLog.steps || 0);
  const maintenance = baseMaintenance + neat;
  const balance = (dayLog.calories || 0) - maintenance;

  return {
    ...dayLog,
    calorieBalance: balance
  };
}

export function calculateWeekSummary(
  weekLogs: DailyLog[],
  prevWeekLogs: DailyLog[],
  profile: UserProfile
) {
  // Current week calculations
  const weightLogs = weekLogs.filter(log => log.weight).map(log => log.weight!);
  const caloriesLogs = weekLogs.filter(log => log.calories).map(log => log.calories!);
  const stepsLogs = weekLogs.filter(log => log.steps).map(log => log.steps!);
  const currentWeekAvg = weightLogs.length > 0 
    ? weightLogs.reduce((a, b) => a + b) / weightLogs.length 
    : null;

  // Previous week average weight
  const prevWeightLogs = prevWeekLogs.filter(log => log.weight).map(log => log.weight!);
  const prevWeekAvg = prevWeightLogs.length > 0
    ? prevWeightLogs.reduce((a, b) => a + b) / prevWeightLogs.length
    : null;

  // Calculate total caloric balance for the week
  const totalBalance = weekLogs.reduce((total, log) => {
    if (!log.calories) return total;

    const bmr = calculateBMR(
      log.weight || profile.currentWeight,
      profile.height,
      profile.age,
      profile.gender,
      profile.bodyFat
    );
    const baseMaintenance = calculateBaseMaintenance(bmr);
    const neat = calculateNEAT(log.steps || 0);
    const maintenance = baseMaintenance + neat;
    return total + (log.calories - maintenance);
  }, 0);

  // Estimate weight change from caloric balance
  const estimatedWeightChange = totalBalance / 7700; // 7700 calories = 1kg

  return {
    totalDays: weekLogs.length,
    avgWeight: currentWeekAvg,
    prevWeekAvg,
    weightChange: currentWeekAvg && prevWeekAvg ? currentWeekAvg - prevWeekAvg : null,
    totalCalories: caloriesLogs.reduce((a, b) => a + b, 0),
    avgCalories: caloriesLogs.length > 0 ? caloriesLogs.reduce((a, b) => a + b) / caloriesLogs.length : null,
    totalSteps: stepsLogs.reduce((a, b) => a + b, 0),
    avgSteps: stepsLogs.length > 0 ? stepsLogs.reduce((a, b) => a + b) / stepsLogs.length : null,
    totalBalance,
    estimatedWeightChange
  };
}