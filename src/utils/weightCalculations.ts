import { DailyLog } from '../types';
import { roundWeight } from './weightFormatting';

// Get start of current week (Monday)
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get start and end of previous week
export function getPreviousWeekRange(): { start: Date; end: Date } {
  const currentWeekStart = getCurrentWeekStart();
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  
  const previousWeekEnd = new Date(currentWeekStart);
  previousWeekEnd.setSeconds(previousWeekEnd.getSeconds() - 1);
  
  return { start: previousWeekStart, end: previousWeekEnd };
}

// Calculate current week's average weight
export function calculateCurrentAverageWeight(logs: DailyLog[]): number | null {
  const weekStart = getCurrentWeekStart();
  
  // Filter logs for current week and with valid weight
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && typeof log.weight === 'number';
  });

  if (weekLogs.length === 0) return null;

  // Calculate average
  const sum = weekLogs.reduce((acc, log) => acc + (log.weight || 0), 0);
  const average = sum / weekLogs.length;

  // Round to nearest 0.05
  return roundWeight(average);
}

// Calculate previous week's average weight
export function calculatePreviousAverageWeight(logs: DailyLog[]): number | null {
  const { start: previousWeekStart, end: previousWeekEnd } = getPreviousWeekRange();
  
  // Filter logs for previous week and with valid weight
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= previousWeekStart && 
           logDate <= previousWeekEnd && 
           typeof log.weight === 'number';
  });

  if (weekLogs.length === 0) return null;

  // Calculate average
  const sum = weekLogs.reduce((acc, log) => acc + (log.weight || 0), 0);
  const average = sum / weekLogs.length;

  // Round to nearest 0.05
  return roundWeight(average);
}

// Get weight change between two values
export function getWeightChange(current: number, previous: number): {
  change: number;
  percentage: number;
} {
  const change = roundWeight(current - previous);
  const percentage = (change / previous) * 100;
  return { change, percentage };
}