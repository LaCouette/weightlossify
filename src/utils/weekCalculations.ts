import { DailyLog } from '../types';
import { calculateBMR, calculateBaseMaintenance, calculateNEAT } from './calorieCalculations';
import { UserProfile } from '../types/profile';

export function getWeekRange(weekOffset: number = 0) {
  const now = new Date();
  const start = new Date(now);
  
  // Get to Monday of current week
  start.setDate(start.getDate() - start.getDay() + 1);
  
  // Adjust for week offset
  start.setDate(start.getDate() + (weekOffset * 7));
  
  // Set to start of day
  start.setHours(0, 0, 0, 0);
  
  // Calculate end date (Sunday)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(weekStart);
  
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function getRemainingDates(weekStart: Date): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const dates: Date[] = [];
  let currentDate = new Date(Math.max(today.getTime(), weekStart.getTime()));
  
  while (currentDate <= weekEnd) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function calculateDayMetrics(dayLog: DailyLog | undefined, profile: UserProfile) {
  if (!dayLog) return null;

  const bmr = calculateBMR(
    profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );
  
  const baseMaintenance = calculateBaseMaintenance(bmr);
  const neat = dayLog.steps ? calculateNEAT(dayLog.steps) : 0;
  const maintenance = baseMaintenance + neat;
  
  return {
    weight: dayLog.weight,
    steps: dayLog.steps,
    calories: dayLog.calories,
    calorieBalance: (dayLog.calories || 0) - maintenance
  };
}

export function calculateWeekSummary(
  weekLogs: DailyLog[],
  prevWeekLogs: DailyLog[],
  profile: UserProfile
) {
  // Calculate averages
  const weightLogs = weekLogs.filter(log => typeof log.weight === 'number');
  const caloriesLogs = weekLogs.filter(log => typeof log.calories === 'number');
  const stepsLogs = weekLogs.filter(log => typeof log.steps === 'number');

  const avgWeight = weightLogs.length > 0
    ? weightLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / weightLogs.length
    : null;

  const avgCalories = caloriesLogs.length > 0
    ? caloriesLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / caloriesLogs.length
    : null;

  const avgSteps = stepsLogs.length > 0
    ? stepsLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / stepsLogs.length
    : null;

  // Calculate weight change from previous week
  const prevWeightLogs = prevWeekLogs.filter(log => typeof log.weight === 'number');
  const prevAvgWeight = prevWeightLogs.length > 0
    ? prevWeightLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / prevWeightLogs.length
    : null;

  const weightChange = (avgWeight !== null && prevAvgWeight !== null)
    ? avgWeight - prevAvgWeight
    : null;

  // Calculate total caloric balance for the week
  let totalBalance = 0;
  weekLogs.forEach(log => {
    if (typeof log.calories === 'number') {
      const bmr = calculateBMR(
        profile.currentWeight,
        profile.height,
        profile.age,
        profile.gender,
        profile.bodyFat
      );
      const baseMaintenance = calculateBaseMaintenance(bmr);
      const neat = log.steps ? calculateNEAT(log.steps) : 0;
      const maintenance = baseMaintenance + neat;
      
      totalBalance += log.calories - maintenance;
    }
  });

  // Estimate weight change based on caloric balance
  // Using the 7700 kcal = 1kg formula
  const estimatedWeightChange = totalBalance / 7700;

  return {
    totalDays: weekLogs.length,
    avgWeight,
    weightChange,
    avgCalories,
    avgSteps,
    totalBalance,
    estimatedWeightChange
  };
}

export function calculateWeekProjection(weekLogs: DailyLog[], profile: UserProfile) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (6 - today.getDay()));
  
  const remainingDays = Math.floor((weekEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (remainingDays <= 0) return null;

  // Calculate current totals
  const currentCalories = weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const currentSteps = weekLogs.reduce((sum, log) => sum + (log.steps || 0), 0);

  // Calculate required daily averages
  const remainingCalories = (profile.dailyCaloriesTarget * 7) - currentCalories;
  const remainingSteps = (profile.dailyStepsGoal * 7) - currentSteps;

  const requiredDailyCalories = remainingCalories / remainingDays;
  const requiredDailySteps = remainingSteps / remainingDays;

  // Check if targets are achievable
  const isCaloriesAchievable = requiredDailyCalories <= profile.dailyCaloriesTarget * 1.5;
  const isStepsAchievable = requiredDailySteps <= profile.dailyStepsGoal * 1.5;

  return {
    remainingDays,
    requiredDailyCalories: requiredDailyCalories > 0 ? requiredDailyCalories : null,
    requiredDailySteps: requiredDailySteps > 0 ? requiredDailySteps : null,
    isCaloriesAchievable,
    isStepsAchievable
  };
}