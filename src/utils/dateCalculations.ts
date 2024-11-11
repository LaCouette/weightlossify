export function calculateDateRange(range: 'week' | 'month'): { startDate: Date; endDate: Date } {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(now);
  if (range === 'week') {
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const currentDay = startDate.getDay();
    
    // Calculate days to subtract to get to Monday (if Sunday, subtract 6 days)
    const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
    
    // Set to Monday of current week
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    // Set endDate to Sunday
    endDate.setDate(startDate.getDate() + 6);
  } else {
    // Set to first day of current month
    startDate.setDate(1);
    // Set endDate to last day of current month
    endDate.setMonth(endDate.getMonth() + 1, 0);
  }
  
  // Set time to start of day for startDate
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

export function calculateRemainingDays(endDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time part for accurate day calculation
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return at least 0 to avoid negative days
  return Math.max(0, diffDays);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function isToday(date: string): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

export function getTomorrowDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}