import { create } from 'zustand';
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { DailyLog } from '../types';
import { isToday } from '../utils/dateCalculations';

interface LogsState {
  logs: DailyLog[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: (userId: string, startDate?: Date, endDate?: Date) => Promise<void>;
  addLog: (userId: string, log: Partial<DailyLog>) => Promise<void>;
  updateLog: (userId: string, logId: string, updates: Partial<DailyLog>) => Promise<void>;
  getTodayLog: (field: keyof DailyLog) => DailyLog | null;
  updateUserProfile: (userId: string, updates: { currentWeight?: number }) => Promise<void>;
}

export const useLogsStore = create<LogsState>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  fetchLogs: async (userId: string, startDate?: Date, endDate?: Date) => {
    try {
      set({ isLoading: true, error: null });
      const logsRef = collection(db, `users/${userId}/logs`);
      let q = query(logsRef, orderBy('date', 'desc'));
      
      if (startDate && endDate) {
        q = query(q, 
          where('date', '>=', startDate.toISOString()),
          where('date', '<=', endDate.toISOString())
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || doc.data().createdAt?.toDate() || new Date()
      })) as DailyLog[];

      set({ logs });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch logs';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  getTodayLog: (field: keyof DailyLog) => {
    const state = get();
    return state.logs.find(log => isToday(log.date) && log[field] !== undefined) || null;
  },

  addLog: async (userId: string, logData: Partial<DailyLog>) => {
    try {
      set({ isLoading: true, error: null });
      const logsRef = collection(db, `users/${userId}/logs`);
      
      const now = new Date();
      const newLog = {
        ...logData,
        date: now.toISOString(),
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(logsRef, newLog);

      // If weight is being logged, update user profile
      if (logData.weight) {
        await get().updateUserProfile(userId, { currentWeight: logData.weight });
      }
      
      // Refresh logs
      await get().fetchLogs(userId);
      
      return docRef.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add log';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateLog: async (userId: string, logId: string, updates: Partial<DailyLog>) => {
    try {
      set({ isLoading: true, error: null });
      const logRef = doc(db, `users/${userId}/logs/${logId}`);
      
      const now = new Date();
      await updateDoc(logRef, {
        ...updates,
        updatedAt: now
      });

      // If weight is being updated, update user profile
      if (updates.weight) {
        await get().updateUserProfile(userId, { currentWeight: updates.weight });
      }

      // Refresh logs
      await get().fetchLogs(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update log';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (userId: string, updates: { currentWeight?: number }) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      // Update the user profile with the new weight
      if (updates.currentWeight) {
        await updateDoc(userRef, {
          currentWeight: updates.currentWeight,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user profile';
      throw new Error(errorMessage);
    }
  }
}));