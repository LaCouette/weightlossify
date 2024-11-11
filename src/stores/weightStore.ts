import { create } from 'zustand';
import { useLogsStore } from './logsStore';
import { useUserStore } from './userStore';

interface WeightState {
  currentWeight: number | null;
  updateCurrentWeight: (weight: number) => void;
  initializeWeight: () => void;
}

export const useWeightStore = create<WeightState>((set) => ({
  currentWeight: null,
  
  updateCurrentWeight: (weight: number) => {
    set({ currentWeight: weight });
    
    // Also update the user profile
    const { profile, updateProfile } = useUserStore.getState();
    const { user } = profile || {};
    
    if (user?.uid && profile) {
      updateProfile(user.uid, {
        ...profile,
        currentWeight: weight,
        updatedAt: new Date()
      });
    }
  },
  
  initializeWeight: () => {
    const { logs } = useLogsStore.getState();
    const { profile } = useUserStore.getState();
    
    // Find the most recent weight log
    const latestWeightLog = logs
      .filter(log => typeof log.weight === 'number')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    // Use the most recent logged weight, or fall back to profile weight
    const weight = latestWeightLog?.weight || profile?.currentWeight || null;
    set({ currentWeight: weight });
  }
}));