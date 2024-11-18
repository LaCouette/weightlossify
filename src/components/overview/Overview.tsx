import React, { useState } from 'react';
import { useLogsStore } from '../stores/logsStore';
import { useUserStore } from '../stores/userStore';
import { WeekSelector } from './WeekSelector';
import { DailyMetricCard } from './DailyMetricCard';
import { WeekSummary } from './WeekSummary';
import { InteractiveProjection } from './InteractiveProjection';
import { 
  getWeekRange, 
  getWeekDates, 
  calculateDayMetrics, 
  calculateWeekSummary,
  calculateWeekProjection,
  getRemainingDates
} from '../utils/weekCalculations';

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
  const projection = selectedWeekOffset === 0 ? calculateWeekProjection(weekLogs, profile) : null;

  // Calculate current totals for the week
  const currentTotals = {
    calories: weekLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
    steps: weekLogs.reduce((sum, log) => sum + (log.steps || 0), 0)
  };

  // Get remaining dates for the week
  const remainingDates = getRemainingDates(weekStart);

  const isCurrentWeek = selectedWeekOffset === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <WeekSelector
        weekStart={weekStart}
        weekEnd={weekEnd}
        selectedWeekOffset={selectedWeekOffset}
        onOffsetChange={setSelectedWeekOffset}
      />

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6">
        {/* Interactive Projection (only for current week) */}
        {projection && (
          <InteractiveProjection
            data={projection}
            remainingDates={remainingDates}
            weeklyCaloriesTarget={profile.dailyCaloriesTarget * 7}
            weeklyStepsTarget={profile.dailyStepsGoal * 7}
            currentTotals={currentTotals}
          />
        )}

        {/* Week Summary (show first for previous weeks) */}
        {!isCurrentWeek && (
          <div className="mb-8">
            <WeekSummary data={weekSummary} />
          </div>
        )}

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

        {/* Week Summary (show last for current week) */}
        {isCurrentWeek && <WeekSummary data={weekSummary} />}
      </div>
    </div>
  );
}