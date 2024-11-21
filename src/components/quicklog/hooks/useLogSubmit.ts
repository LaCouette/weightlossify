import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useLogsStore } from '../../../stores/logsStore';
import { useWeightStore } from '../../../stores/weightStore';
import { useUserStore } from '../../../stores/userStore';
import { parseWeight } from '../../../utils/weightFormatting';
import type { DailyLog } from '../../../types';

interface LogSubmitState {
  isLoading: boolean;
  error: string | null;
}

export function useLogSubmit(field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>) {
  const [state, setState] = useState<LogSubmitState>({
    isLoading: false,
    error: null
  });

  const { user } = useAuthStore();
  const { addLog, updateLog } = useLogsStore();
  const updateCurrentWeight = useWeightStore(state => state.updateCurrentWeight);
  const { updateProfile } = useUserStore();

  const submit = async (
    value: number | null,
    todayLog: DailyLog | undefined,
    onSuccess?: () => void
  ) => {
    if (!user) return;

    setState({ isLoading: true, error: null });

    try {
      const logValue = field === 'weight' && value !== null 
        ? parseWeight(value.toString()) 
        : value;

      if (logValue === null && field === 'weight') {
        throw new Error('Invalid weight value');
      }

      const logData = {
        ...todayLog,
        [field]: logValue,
        updatedAt: new Date()
      };

      if (todayLog) {
        await updateLog(user.uid, todayLog.id, logData);
      } else {
        const newLog: Partial<DailyLog> = {
          [field]: logValue,
          date: new Date().toISOString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await addLog(user.uid, newLog);
      }

      if (field === 'weight' && typeof logValue === 'number') {
        updateCurrentWeight(logValue);
      }

      setState({ isLoading: false, error: null });
      onSuccess?.();
    } catch (err) {
      setState({ 
        isLoading: false, 
        error: 'Failed to save log. Please try again.' 
      });
      console.error('Error logging value:', err);
    }
  };

  return {
    state,
    submit
  };
}