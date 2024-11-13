import { Timestamp } from 'firebase/firestore';

// Date formatting utilities for collection IDs
export const formatters = {
  // Format: YYYY-MM-DD
  formatDateId: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Format: YYYY-WW (week number)
  formatWeekId: (date: Date): string => {
    const year = date.getFullYear();
    const weekNumber = getWeekNumber(date);
    return `${year}-${String(weekNumber).padStart(2, '0')}`;
  },

  // Format: YYYY-MM
  formatMonthId: (date: Date): string => {
    return date.toISOString().slice(0, 7);
  },

  // Format milestone IDs
  formatMilestoneId: (type: string, value: number): string => {
    return `${type}_${value}`;
  }
};

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

// Convert Date to Firestore Timestamp
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// Get start and end of week dates
export function getWeekBoundaries(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// Get start and end of month dates
export function getMonthBoundaries(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}