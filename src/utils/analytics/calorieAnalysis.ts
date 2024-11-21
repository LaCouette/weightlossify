import { DailyLog } from '../../types';
import { addDays, differenceInDays, startOfDay, endOfDay } from 'date-fns';

export interface CalorieAnalysis {
  averageIntake: number;
  averageDeficit: number;
  consistency: number;
  adherenceRate: number;
  streaks: {
    current: number;
    longest: number;
  };
  patterns: {
    weekday: number;
    weekend: number;
    difference: number;
  };
  distribution: {
    veryLow: number;
    low: number;
    target: number;
    high: number;
    veryHigh: number;
  };
  timing: {
    morning: number;
    afternoon: number;
    evening: number;
    mostConsistentTime: 'morning' | 'afternoon' | 'evening';
  };
  correlations: {
    withSteps: number;
    withWeight: number;
  };
  insights: {
    type: 'success' | 'warning' | 'info';
    message: string;
  }[];
}

export function analyzeCalories(logs: DailyLog[], targetCalories: number): CalorieAnalysis | null {
  if (logs.length < 7) return null;

  const calorieLogs = logs
    .filter(log => typeof log.calories === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (calorieLogs.length < 7) return null;

  // Calculate average intake
  const averageIntake = calorieLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / calorieLogs.length;

  // Calculate average deficit
  const averageDeficit = targetCalories - averageIntake;

  // Calculate consistency (percentage of days with calories logged)
  const totalDays = differenceInDays(
    new Date(calorieLogs[calorieLogs.length - 1].date),
    new Date(calorieLogs[0].date)
  ) + 1;
  const consistency = (calorieLogs.length / totalDays) * 100;

  // Calculate adherence rate (percentage of days within target ±10%)
  const adherenceRate = (calorieLogs.filter(log => 
    (log.calories || 0) >= targetCalories * 0.9 &&
    (log.calories || 0) <= targetCalories * 1.1
  ).length / calorieLogs.length) * 100;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakCount = 0;

  for (let i = 1; i < calorieLogs.length; i++) {
    const dayDiff = differenceInDays(
      new Date(calorieLogs[i].date),
      new Date(calorieLogs[i-1].date)
    );

    if (dayDiff === 1 && (calorieLogs[i].calories || 0) <= targetCalories) {
      currentStreakCount++;
      if (currentStreakCount > longestStreak) {
        longestStreak = currentStreakCount;
      }
    } else {
      currentStreakCount = 0;
    }
  }
  currentStreak = currentStreakCount;

  // Analyze weekday vs weekend patterns
  const weekdayCalories = calorieLogs.filter(log => 
    [1,2,3,4,5].includes(new Date(log.date).getDay())
  ).map(log => log.calories!);
  
  const weekendCalories = calorieLogs.filter(log => 
    [0,6].includes(new Date(log.date).getDay())
  ).map(log => log.calories!);

  const weekdayAvg = weekdayCalories.reduce((a, b) => a + b, 0) / weekdayCalories.length;
  const weekendAvg = weekendCalories.reduce((a, b) => a + b, 0) / weekendCalories.length;

  // Analyze distribution
  const distribution = {
    veryLow: calorieLogs.filter(log => (log.calories || 0) < targetCalories * 0.7).length,
    low: calorieLogs.filter(log => 
      (log.calories || 0) >= targetCalories * 0.7 && 
      (log.calories || 0) < targetCalories * 0.9
    ).length,
    target: calorieLogs.filter(log => 
      (log.calories || 0) >= targetCalories * 0.9 && 
      (log.calories || 0) <= targetCalories * 1.1
    ).length,
    high: calorieLogs.filter(log => 
      (log.calories || 0) > targetCalories * 1.1 && 
      (log.calories || 0) <= targetCalories * 1.3
    ).length,
    veryHigh: calorieLogs.filter(log => (log.calories || 0) > targetCalories * 1.3).length
  };

  // Calculate correlations
  const correlations = {
    withSteps: calculateCorrelation(
      calorieLogs.map(log => log.calories!),
      calorieLogs.map(log => log.steps || 0)
    ),
    withWeight: calculateCorrelation(
      calorieLogs.map(log => log.calories!),
      calorieLogs.map(log => log.weight || 0)
    )
  };

  // Generate insights
  const insights = [];

  if (weekendAvg - weekdayAvg > 300) {
    insights.push({
      type: 'warning',
      message: 'Weekend calories are significantly higher than weekdays. Consider meal planning for weekends.'
    });
  }

  if (distribution.veryLow > calorieLogs.length * 0.2) {
    insights.push({
      type: 'warning',
      message: 'Frequent very low calorie days detected. This may not be sustainable long-term.'
    });
  }

  if (adherenceRate > 80) {
    insights.push({
      type: 'success',
      message: 'Excellent adherence to calorie targets! Keep up the consistent work.'
    });
  }

  if (correlations.withSteps > 0.5) {
    insights.push({
      type: 'info',
      message: 'Higher activity days tend to have higher calorie intake. Consider adjusting calories based on activity level.'
    });
  }

  return {
    averageIntake,
    averageDeficit,
    consistency,
    adherenceRate,
    streaks: {
      current: currentStreak,
      longest: longestStreak
    },
    patterns: {
      weekday: weekdayAvg,
      weekend: weekendAvg,
      difference: weekendAvg - weekdayAvg
    },
    distribution,
    timing: {
      morning: 0, // TODO: Implement if timestamp data is available
      afternoon: 0,
      evening: 0,
      mostConsistentTime: 'morning'
    },
    correlations,
    insights
  };
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b);
  const sum2 = y.reduce((a, b) => a + b);
  const sum1sq = x.reduce((a, b) => a + b * b);
  const sum2sq = y.reduce((a, b) => a + b * b);
  const psum = x.map((x, i) => x * y[i]).reduce((a, b) => a + b);
  const num = psum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1sq - sum1 * sum1 / n) * (sum2sq - sum2 * sum2 / n));
  return num / den;
}