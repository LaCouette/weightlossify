import { DailyLog } from '../../types';
import { addDays, differenceInDays, startOfDay, endOfDay, format } from 'date-fns';

export interface ActivityAnalysis {
  averageSteps: number;
  goalAchievementRate: number;
  consistency: number;
  streaks: {
    current: number;
    longest: number;
  };
  patterns: {
    weekday: number;
    weekend: number;
    difference: number;
    mostActiveDay: string;
    leastActiveDay: string;
  };
  intensity: {
    sedentary: number;
    light: number;
    moderate: number;
    vigorous: number;
  };
  progression: {
    trend: 'increasing' | 'decreasing' | 'stable';
    weeklyChange: number;
    bestDay: {
      date: Date;
      steps: number;
    };
    worstDay: {
      date: Date;
      steps: number;
    };
  };
  correlations: {
    withCalories: number;
    withWeight: number;
  };
  insights: {
    type: 'success' | 'warning' | 'info';
    message: string;
  }[];
}

export function analyzeActivity(logs: DailyLog[], targetSteps: number): ActivityAnalysis | null {
  if (logs.length < 7) return null;

  const stepsLogs = logs
    .filter(log => typeof log.steps === 'number')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (stepsLogs.length < 7) return null;

  // Calculate average steps
  const averageSteps = Math.round(
    stepsLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / stepsLogs.length
  );

  // Calculate goal achievement rate
  const goalAchievementRate = (stepsLogs.filter(log => 
    (log.steps || 0) >= targetSteps
  ).length / stepsLogs.length) * 100;

  // Calculate consistency
  const totalDays = differenceInDays(
    new Date(stepsLogs[stepsLogs.length - 1].date),
    new Date(stepsLogs[0].date)
  ) + 1;
  const consistency = (stepsLogs.length / totalDays) * 100;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakCount = 0;

  for (let i = 1; i < stepsLogs.length; i++) {
    const dayDiff = differenceInDays(
      new Date(stepsLogs[i].date),
      new Date(stepsLogs[i-1].date)
    );

    if (dayDiff === 1 && (stepsLogs[i].steps || 0) >= targetSteps) {
      currentStreakCount++;
      if (currentStreakCount > longestStreak) {
        longestStreak = currentStreakCount;
      }
    } else {
      currentStreakCount = 0;
    }
  }
  currentStreak = currentStreakCount;

  // Analyze daily patterns
  const dailyAverages = new Array(7).fill(0).map((_, index) => {
    const dayLogs = stepsLogs.filter(log => 
      new Date(log.date).getDay() === index
    );
    return {
      day: format(new Date(2024, 0, index + 1), 'EEEE'),
      average: dayLogs.length > 0
        ? Math.round(dayLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / dayLogs.length)
        : 0
    };
  });

  const mostActiveDay = dailyAverages.reduce((max, current) => 
    current.average > max.average ? current : max
  );

  const leastActiveDay = dailyAverages.reduce((min, current) => 
    current.average < min.average ? current : min
  );

  // Calculate weekday vs weekend averages
  const weekdaySteps = stepsLogs.filter(log => 
    [1,2,3,4,5].includes(new Date(log.date).getDay())
  ).map(log => log.steps!);
  
  const weekendSteps = stepsLogs.filter(log => 
    [0,6].includes(new Date(log.date).getDay())
  ).map(log => log.steps!);

  const weekdayAvg = Math.round(weekdaySteps.reduce((a, b) => a + b, 0) / weekdaySteps.length);
  const weekendAvg = Math.round(weekendSteps.reduce((a, b) => a + b, 0) / weekendSteps.length);

  // Analyze intensity distribution
  const intensity = {
    sedentary: stepsLogs.filter(log => (log.steps || 0) < 5000).length,
    light: stepsLogs.filter(log => 
      (log.steps || 0) >= 5000 && (log.steps || 0) < 7500
    ).length,
    moderate: stepsLogs.filter(log => 
      (log.steps || 0) >= 7500 && (log.steps || 0) < 10000
    ).length,
    vigorous: stepsLogs.filter(log => (log.steps || 0) >= 10000).length
  };

  // Analyze progression
  const weeklyAverages = [];
  for (let i = 7; i <= stepsLogs.length; i += 7) {
    const weekLogs = stepsLogs.slice(i - 7, i);
    weeklyAverages.push(
      weekLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / weekLogs.length
    );
  }

  const weeklyChange = weeklyAverages.length >= 2
    ? weeklyAverages[weeklyAverages.length - 1] - weeklyAverages[weeklyAverages.length - 2]
    : 0;

  const trend = Math.abs(weeklyChange) < 500 
    ? 'stable' 
    : weeklyChange > 0 
    ? 'increasing' 
    : 'decreasing';

  // Find best and worst days
  const bestDay = stepsLogs.reduce((max, log) => 
    (log.steps || 0) > (max.steps || 0) ? log : max
  );

  const worstDay = stepsLogs.reduce((min, log) => 
    (log.steps || 0) < (min.steps || 0) ? log : min
  );

  // Calculate correlations
  const correlations = {
    withCalories: calculateCorrelation(
      stepsLogs.map(log => log.steps!),
      stepsLogs.map(log => log.calories || 0)
    ),
    withWeight: calculateCorrelation(
      stepsLogs.map(log => log.steps!),
      stepsLogs.map(log => log.weight || 0)
    )
  };

  // Generate insights
  const insights = [];

  if (weekendAvg < weekdayAvg * 0.7) {
    insights.push({
      type: 'warning',
      message: 'Weekend activity is significantly lower. Try to maintain consistency throughout the week.'
    });
  }

  if (intensity.sedentary > stepsLogs.length * 0.3) {
    insights.push({
      type: 'warning',
      message: 'High number of low-activity days detected. Consider setting hourly movement reminders.'
    });
  }

  if (goalAchievementRate > 80) {
    insights.push({
      type: 'success',
      message: 'Excellent consistency in meeting your step goals! Consider increasing your target.'
    });
  }

  if (trend === 'increasing' && weeklyChange > 1000) {
    insights.push({
      type: 'success',
      message: 'Your activity level is steadily increasing. Keep up the great progress!'
    });
  }

  return {
    averageSteps,
    goalAchievementRate,
    consistency,
    streaks: {
      current: currentStreak,
      longest: longestStreak
    },
    patterns: {
      weekday: weekdayAvg,
      weekend: weekendAvg,
      difference: weekendAvg - weekdayAvg,
      mostActiveDay: mostActiveDay.day,
      leastActiveDay: leastActiveDay.day
    },
    intensity,
    progression: {
      trend,
      weeklyChange,
      bestDay: {
        date: new Date(bestDay.date),
        steps: bestDay.steps!
      },
      worstDay: {
        date: new Date(worstDay.date),
        steps: worstDay.steps!
      }
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