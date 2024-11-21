import { useState } from 'react';
import type { DailyLog } from '../../../types';

interface AdditionalDataState {
  showPrompt: boolean;
  showModal: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdditionalData(field: keyof Pick<DailyLog, 'weight' | 'calories' | 'steps'>) {
  const [state, setState] = useState<AdditionalDataState>({
    showPrompt: false,
    showModal: false,
    isLoading: false,
    error: null
  });

  const showPrompt = () => {
    setState(prev => ({ ...prev, showPrompt: true }));
  };

  const hidePrompt = () => {
    setState(prev => ({ ...prev, showPrompt: false }));
  };

  const showModal = () => {
    setState(prev => ({ ...prev, showPrompt: false, showModal: true }));
  };

  const hideModal = () => {
    setState(prev => ({ ...prev, showModal: false }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  return {
    state,
    showPrompt,
    hidePrompt,
    showModal,
    hideModal,
    setLoading,
    setError
  };
}