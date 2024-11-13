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

// Get weight change between two values
export function getWeightChange(current: number, previous: number): {
  change: number;
  percentage: number;
} {
  const change = roundWeight(current - previous);
  const percentage = (change / previous) * 100;
  return { change, percentage };
}