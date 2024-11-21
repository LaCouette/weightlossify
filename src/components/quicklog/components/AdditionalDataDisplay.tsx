import React from 'react';
import type { DailyLog } from '../../../types';

interface AdditionalDataDisplayProps {
  log: DailyLog;
  field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>;
}

export function AdditionalDataDisplay({ log, field }: AdditionalDataDisplayProps) {
  if (field === 'weight' && log.bodyFat) {
    return (
      <div className="text-sm text-indigo-600 mt-1">
        Body Fat: {log.bodyFat}%
      </div>
    );
  }

  if (field === 'calories' && log.macros) {
    return (
      <div className="text-sm text-indigo-600 mt-1">
        P: {log.macros.proteins}g / F: {log.macros.fats}g / C: {log.macros.carbs}g
        {log.macros.fiber > 0 && ` / Fiber: ${log.macros.fiber}g`}
      </div>
    );
  }

  if (field === 'steps' && log.distance) {
    return (
      <div className="text-sm text-indigo-600 mt-1">
        Distance: {log.distance} km
      </div>
    );
  }

  return null;
}