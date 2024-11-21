import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useLogsStore } from '../../stores/logsStore';
import { useWeightStore } from '../../stores/weightStore';
import { useUserStore } from '../../stores/userStore';
import { getTodayLog } from '../../utils/dateUtils';
import { parseWeight } from '../../utils/weightFormatting';
import type { DailyLog } from '../../types';

interface LogState {
  value: number | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  showBodyFatPrompt: boolean;
  showMacrosPrompt: boolean;
  showDistancePrompt: boolean;
  showBodyFatModal: boolean;
  showMacrosModal: boolean;
  showDistanceModal: boolean;
}

export function useLogState(field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>, defaultValue: number) {
  const [state, setState] = useState<LogState>({
    value: defaultValue,
    isLoading: false,
    error: null,
    isEditing: false,
    showBodyFatPrompt: false,
    showMacrosPrompt: false,
    showDistancePrompt: false,
    showBodyFatModal: false,
    showMacrosModal: false,
    showDistanceModal: false
  });

  const { user } = useAuthStore();
  const { logs, addLog, updateLog } = useLogsStore();
  const { updateProfile } = useUserStore();
  const updateCurrentWeight = useWeightStore(state => state.updateCurrentWeight);
  const todayLog = getTodayLog(logs);

  useEffect(() => {
    if (!state.isEditing && todayLog?.[field] !== undefined) {
      setState(prev => ({ ...prev, value: todayLog[field] as number }));
    }
  }, [todayLog, field, state.isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const logValue = field === 'weight' && state.value !== null 
        ? parseWeight(state.value.toString()) 
        : state.value;

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
        setState(prev => ({ ...prev, showBodyFatPrompt: true }));
      } else if (field === 'calories' && typeof logValue === 'number') {
        setState(prev => ({ ...prev, showMacrosPrompt: true }));
      } else if (field === 'steps' && typeof logValue === 'number') {
        setState(prev => ({ ...prev, showDistancePrompt: true }));
      }

      setState(prev => ({ 
        ...prev, 
        isEditing: false, 
        error: null 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to save log. Please try again.' 
      }));
      console.error('Error logging value:', err);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    state,
    setState,
    todayLog,
    user,
    updateLog,
    updateProfile,
    handleSubmit
  };
}