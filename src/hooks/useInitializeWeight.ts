import { useEffect } from 'react';
import { useWeightStore } from '../stores/weightStore';
import { useLogsStore } from '../stores/logsStore';

export function useInitializeWeight() {
  const initializeWeight = useWeightStore(state => state.initializeWeight);
  const logs = useLogsStore(state => state.logs);
  
  useEffect(() => {
    initializeWeight();
  }, [logs]); // Re-initialize when logs change
}