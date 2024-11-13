import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useLogsStore } from '../stores/logsStore';
import { WeightMetric } from './dashboard/WeightMetric';
import { CaloriesMetric } from './dashboard/CaloriesMetric';
import { StepsMetric } from './dashboard/StepsMetric';
import { DateRangeSelector } from './dashboard/DateRangeSelector';
import { calculateDateRange } from '../utils/dateCalculations';

type DateRange = 'week' | 'month';

export function Dashboard() {
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { logs, fetchLogs } = useLogsStore();
  const [dateRange, setDateRange] = useState<DateRange>('week');

  const refreshLogs = async () => {
    if (user?.uid) {
      const { startDate, endDate } = calculateDateRange(dateRange);
      await fetchLogs(user.uid, startDate, endDate);
    }
  };

  useEffect(() => {
    refreshLogs();
  }, [user?.uid, dateRange]);

  if (!profile || !logs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { startDate, endDate } = calculateDateRange(dateRange);
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Date Range Selector */}
      <DateRangeSelector
        dateRange={dateRange}
        onChange={setDateRange}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeightMetric
          currentWeight={profile.currentWeight}
          targetWeight={profile.targetWeight}
          logs={filteredLogs}
          dateRange={dateRange}
        />

        <CaloriesMetric
          logs={filteredLogs}
          dailyTarget={profile.dailyCaloriesTarget}
          dateRange={dateRange}
          endDate={endDate}
        />

        <StepsMetric
          logs={filteredLogs}
          dailyTarget={profile.dailyStepsGoal}
          dateRange={dateRange}
          endDate={endDate}
        />
      </div>
    </div>
  );
}