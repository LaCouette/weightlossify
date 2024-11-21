import regression from 'regression';
import { DailyLog } from '../../types';
import { addDays, differenceInDays, startOfDay } from 'date-fns';

export interface TrendAnalysis {
  slope: number;
  rSquared: number;
  prediction30Days: number;
  prediction90Days: number;
  volatility: number;
  consistency: number;
  isAccelerating: boolean;
  weeklyRate: number;
  monthlyRate: number;
  confidence: 'high' | 'medium' | 'low';
  dataPoints: number;
  longestStreak: number;
  currentStreak: number;
  bestWeeklyProgress: number;
  worstWeeklyProgress: number;
  plateauPeriods: { start: Date; end: Date; duration: number }[];
  seasonality: {
    weekday: number;
    weekend: number;
    difference: number;
  };
}

export function analyzeTrend(logs: DailyLog[]): TrendAnalysis | null {
  if (logs.length < 7) return null;

  const weightLogs = logs
    .filter(log => typeof log.weight === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (weightLogs.length < 7) return null;

  // Prepare data for regression
  const data = weightLogs.map((log, index) => [
    index,
    log.weight!
  ]);

  // Calculate linear regression
  const result = regression.linear(data);
  const slope = result.equation[0];
  
  // Calculate R-squared
  const rSquared = result.r2;

  // Calculate predictions
  const prediction30Days = result.predict(data.length + 30)[1];
  const prediction90Days = result.predict(data.length + 90)[1];

  // Calculate volatility (standard deviation of daily changes)
  const dailyChanges = [];
  for (let i = 1; i < weightLogs.length; i++) {
    dailyChanges.push(weightLogs[i].weight! - weightLogs[i-1].weight!);
  }
  const volatility = Math.sqrt(
    dailyChanges.reduce((sum, change) => sum + Math.pow(change, 0), 0) / dailyChanges.length
  );

  // Calculate consistency (percentage of days with weight logged)
  const totalDays = differenceInDays(
    new Date(weightLogs[weightLogs.length - 1].date),
    new Date(weightLogs[0].date)
  ) + 1;
  const consistency = (weightLogs.length / totalDays) * 100;

  // Determine if trend is accelerating
  const midpoint = Math.floor(weightLogs.length / 2);
  const firstHalfSlope = regression.linear(data.slice(0, midpoint)).equation[0];
  const secondHalfSlope = regression.linear(data.slice(midpoint)).equation[0];
  const isAccelerating = Math.abs(secondHalfSlope) > Math.abs(firstHalfSlope);

  // Calculate weekly and monthly rates
  const weeklyRate = slope * 7;
  const monthlyRate = slope * 30;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakCount = 0;

  for (let i = 1; i < weightLogs.length; i++) {
    const dayDiff = differenceInDays(
      new Date(weightLogs[i].date),
      new Date(weightLogs[i-1].date)
    );

    if (dayDiff === 1) {
      currentStreakCount++;
      if (currentStreakCount > longestStreak) {
        longestStreak = currentStreakCount;
      }
    } else {
      currentStreakCount = 0;
    }
  }
  currentStreak = currentStreakCount;

  // Calculate best and worst weekly progress
  const weeklyChanges = [];
  for (let i = 7; i < weightLogs.length; i++) {
    weeklyChanges.push(weightLogs[i].weight! - weightLogs[i-7].weight!);
  }
  const bestWeeklyProgress = Math.min(...weeklyChanges);
  const worstWeeklyProgress = Math.max(...weeklyChanges);

  // Detect plateau periods (less than 0.2kg change over 14 days)
  const plateauPeriods = [];
  let plateauStart: Date | null = null;

  for (let i = 14; i < weightLogs.length; i++) {
    const change = Math.abs(weightLogs[i].weight! - weightLogs[i-14].weight!);
    if (change < 0.2) {
      if (!plateauStart) {
        plateauStart = new Date(weightLogs[i-14].date);
      }
    } else if (plateauStart) {
      plateauPeriods.push({
        start: plateauStart,
        end: new Date(weightLogs[i-1].date),
        duration: differenceInDays(new Date(weightLogs[i-1].date), plateauStart)
      });
      plateauStart = null;
    }
  }

  // Analyze weekday vs weekend patterns
  const weekdayWeights = weightLogs.filter(log => 
    [1,2,3,4,5].includes(new Date(log.date).getDay())
  ).map(log => log.weight!);
  
  const weekendWeights = weightLogs.filter(log => 
    [0,6].includes(new Date(log.date).getDay())
  ).map(log => log.weight!);

  const weekdayAvg = weekdayWeights.reduce((a, b) => a + b, 0) / weekdayWeights.length;
  const weekendAvg = weekendWeights.reduce((a, b) => a + b, 0) / weekendWeights.length;

  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (rSquared > 0.7 && weightLogs.length >= 30 && consistency > 80) {
    confidence = 'high';
  } else if (rSquared > 0.5 && weightLogs.length >= 14 && consistency > 60) {
    confidence = 'medium';
  }

  return {
    slope,
    rSquared,
    prediction30Days,
    prediction90Days,
    volatility,
    consistency,
    isAccelerating,
    weeklyRate,
    monthlyRate,
    confidence,
    dataPoints: weightLogs.length,
    longestStreak,
    currentStreak,
    bestWeeklyProgress,
    worstWeeklyProgress,
    plateauPeriods,
    seasonality: {
      weekday: weekdayAvg,
      weekend: weekendAvg,
      difference: weekendAvg - weekdayAvg
    }
  };
}