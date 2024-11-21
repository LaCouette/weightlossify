import React from 'react';
import { Calculator } from 'lucide-react';
import { AddDayForm } from './AddDayForm';
import { PlannedDaysList } from './PlannedDaysList';
import { InfoAccordion } from './InfoAccordion';
import { usePlannedDays } from '../../../../hooks/usePlannedDays';
import type { DailyLog } from '../../../../types';
import type { UserProfile } from '../../../../types/profile';

interface ProjectionContentProps {
  weekLogs: DailyLog[];
  profile: UserProfile;
  weekStart: Date;
}

export function ProjectionContent({ weekLogs, profile, weekStart }: ProjectionContentProps) {
  // Get future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(weekStart);
  endOfWeek.setDate(weekStart.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const futureDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).filter(date => date >= today);

  const {
    plannedDays,
    isAddingDay,
    newDay,
    setIsAddingDay,
    handleAddDay,
    handleRemoveDay,
    updateNewDay
  } = usePlannedDays(futureDates[0]);

  return (
    <div className="p-4 space-y-4">
      <InfoAccordion />

      {!isAddingDay && futureDates.length > 0 && (
        <button
          onClick={() => setIsAddingDay(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Calculator className="h-4 w-4" />
          <span>Plan Upcoming Day</span>
        </button>
      )}

      {isAddingDay && (
        <AddDayForm
          newDay={newDay}
          futureDates={futureDates}
          plannedDays={plannedDays}
          onCancel={() => setIsAddingDay(false)}
          onAdd={handleAddDay}
          onChange={updateNewDay}
        />
      )}

      <PlannedDaysList
        plannedDays={plannedDays}
        onRemove={handleRemoveDay}
      />
    </div>
  );
}