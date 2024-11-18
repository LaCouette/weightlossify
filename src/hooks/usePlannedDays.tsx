import { useState } from 'react';
import { usePlannedDaysStore } from '../stores/plannedDaysStore';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

export function usePlannedDays(initialDate: Date) {
  const { plannedDays, addPlannedDay, removePlannedDay } = usePlannedDaysStore();
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDay, setNewDay] = useState<PlannedDay>({
    date: initialDate,
    calories: undefined,
    steps: undefined
  });

  const handleAddDay = () => {
    if (!newDay.calories && !newDay.steps) return;
    addPlannedDay(newDay);
    setNewDay({
      date: initialDate,
      calories: undefined,
      steps: undefined
    });
    setIsAddingDay(false);
  };

  const handleRemoveDay = (index: number) => {
    removePlannedDay(index);
  };

  const updateNewDay = (updates: Partial<PlannedDay>) => {
    setNewDay(prev => ({ ...prev, ...updates }));
  };

  return {
    plannedDays,
    isAddingDay,
    newDay,
    setIsAddingDay,
    handleAddDay,
    handleRemoveDay,
    updateNewDay
  };
}