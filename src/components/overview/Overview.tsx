import React, { useState } from 'react';
import { useLogsStore } from '../../stores/logsStore';
import { useUserStore } from '../../stores/userStore';
import { WeekSelector } from './sections/WeekSelector';
import { ProjectionSection } from './sections/ProjectionSection';
import { WeekSummarySection } from './sections/WeekSummarySection';
import { DailyLogsSection } from './sections/DailyLogsSection';
import { getWeekRange } from '../../utils/weekCalculations';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <WeekSelector
        weekStart={weekStart}
        weekEnd={weekEnd}
        selectedWeekOffset={selectedWeekOffset}
        onOffsetChange={setSelectedWeekOffset}
      />

      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-4 pb-20">
        {/* Projection Section - Now passing selectedWeekOffset */}
        <ProjectionSection
          weekLogs={weekLogs}
          profile={profile}
          weekStart={weekStart}
          selectedWeekOffset={selectedWeekOffset}
        />

        {/* Week Summary Section */}
        <WeekSummarySection
          weekLogs={weekLogs}
          prevWeekLogs={prevWeekLogs}
          profile={profile}
        />

        {/* Daily Logs Section */}
        <DailyLogsSection
          weekStart={weekStart}
          weekLogs={weekLogs}
          profile={profile}
        />
      </div>
    </div>
  );
}