import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import type { DailyLog } from '../../../types';
import type { UserProfile } from '../../../types/profile';
import { DailyLogCard } from './daily/DailyLogCard';
import { getWeekDates } from '../../../utils/weekCalculations';

interface DailyLogsSectionProps {
  weekStart: Date;
  weekLogs: DailyLog[];
  profile: UserProfile;
}

export function DailyLogsSection({
  weekStart,
  weekLogs,
  profile
}: DailyLogsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Changed to false by default
  const weekDates = getWeekDates(weekStart);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Preview/Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">Daily Logs</h3>
            <p className="text-sm text-gray-500">
              Your daily progress for this week
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {weekDates.map(date => {
            const dayLog = weekLogs.find(log => {
              const logDate = new Date(log.date);
              return logDate.getDate() === date.getDate() &&
                     logDate.getMonth() === date.getMonth() &&
                     logDate.getFullYear() === date.getFullYear();
            });

            return (
              <DailyLogCard
                key={date.toISOString()}
                date={date}
                log={dayLog}
                profile={profile}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}