import { create } from 'zustand';
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { DailyLog } from '../types';

interface LogsState {
  logs: DailyLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: (userId: string) => Promise<void>;
  addLog: (userId: string, log: Partial<DailyLog>) => Promise<void>;
}

export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const logsRef = collection(db, `users/${userId}/logs`);
      const q = query(logsRef, orderBy('date', 'desc'), limit(30));
      const querySnapshot = await getDocs(q);
      
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DailyLog[];

      set({ logs });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addLog: async (userId: string, logData: Partial<DailyLog>) => {
    try {
      set({ isLoading: true, error: null });
      const logsRef = collection(db, `users/${userId}/logs`);
      
      // Create a new log entry
      const newLog = {
        ...logData,
        date: new Date().toISOString(),
        createdAt: new Date(),
      };

      await addDoc(logsRef, newLog);
      
      // Refresh logs
      const state = useLogsStore.getState();
      await state.fetchLogs(userId);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));