import React, { useState } from 'react';
import { useLogsStore } from '../stores/logsStore';
import { useUserStore } from '../stores/userStore';
import { WeekSelector } from './overview/WeekSelector';
import { DailyMetricCard } from './overview/DailyMetricCard';
import { WeekSummary } from './overview/WeekSummary';
import { getWeekRange, getWeekDates, calculateDayMetrics, calculateWeekSummary } from '../utils/weekCalculations';

export function Overview() {
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const { logs } = useLogsStore();
  const { profile } = useUserStore();

  const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeekOffset);
  const { start: prevWeekStart, end: prevWeekEnd } = getWeekRange(selectedWeekOffset - 1);

  // Get logs for selected week and previous week
  const weekLogs = logs
    .filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const prevWeekLogs = logs
    .filter(log => {
      const logDate = new Date(log.date);
      return logDate >= prevWeekStart && logDate <= prevWeekEnd;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate array of dates for the week
  const weekDates = getWeekDates(weekStart);

  // Calculate daily metrics
  const getDayMetrics = (date: Date) => {
    const dayLog = weekLogs.find(log => {
      const logDate = new Date(log.date);
      return logDate.getDate() === date.getDate() &&
             logDate.getMonth() === date.getMonth() &&
             logDate.getFullYear() === date.getFullYear();
    });

    return calculateDayMetrics(dayLog, profile);
  };

  const weekSummary = calculateWeekSummary(weekLogs, prevWeekLogs, profile);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <WeekSelector
        weekStart={weekStart}
        weekEnd={weekEnd}
        selectedWeekOffset={selectedWeekOffset}
        onOffsetChange={setSelectedWeekOffset}
      />

      {/* Daily Metrics */}
      <div className="space-y-4 mb-8">
        {weekDates.map(date => (
          <DailyMetricCard
            key={date.toISOString()}
            date={date}
            metrics={getDayMetrics(date)}
          />
        ))}
      </div>

      <WeekSummary data={weekSummary} />
    </div>
  );
}