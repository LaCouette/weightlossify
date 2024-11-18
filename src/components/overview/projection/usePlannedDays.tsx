import { useState } from 'react';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

export function usePlannedDays(initialDate: Date) {
  const [plannedDays, setPlannedDays] = useState<PlannedDay[]>([]);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDay, setNewDay] = useState<PlannedDay>({
    date: initialDate,
    calories: undefined,
    steps: undefined
  });

  const handleAddDay = () => {
    if (!newDay.calories && !newDay.steps) return;

    setPlannedDays(prev => [...prev, newDay]);
    setNewDay({
      date: initialDate,
      calories: undefined,
      steps: undefined
    });
    setIsAddingDay(false);
  };

  const handleRemoveDay = (index: number) => {
    setPlannedDays(prev => prev.filter((_, i) => i !== index));
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