import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlannedDay {
  date: Date;
  calories?: number;
  steps?: number;
}

interface PlannedDaysState {
  plannedDays: PlannedDay[];
  addPlannedDay: (day: PlannedDay) => void;
  removePlannedDay: (index: number) => void;
  updatePlannedDay: (index: number, updates: Partial<PlannedDay>) => void;
  clearExpiredDays: () => void;
}

export const usePlannedDaysStore = create<PlannedDaysState>()(
  persist(
    (set) => ({
      plannedDays: [],
      
      addPlannedDay: (day) => set((state) => {
        const existingIndex = state.plannedDays.findIndex(
          existing => new Date(existing.date).toDateString() === new Date(day.date).toDateString()
        );

        if (existingIndex !== -1) {
          // Update existing day
          const updatedDays = [...state.plannedDays];
          updatedDays[existingIndex] = {
            ...updatedDays[existingIndex],
            calories: day.calories || updatedDays[existingIndex].calories,
            steps: day.steps || updatedDays[existingIndex].steps
          };
          return { plannedDays: updatedDays };
        }

        // Add new day
        return { plannedDays: [...state.plannedDays, day] };
      }),

      removePlannedDay: (index) => set((state) => ({
        plannedDays: state.plannedDays.filter((_, i) => i !== index)
      })),

      updatePlannedDay: (index, updates) => set((state) => {
        const updatedDays = [...state.plannedDays];
        updatedDays[index] = { ...updatedDays[index], ...updates };
        return { plannedDays: updatedDays };
      }),

      clearExpiredDays: () => set((state) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return {
          plannedDays: state.plannedDays.filter(day => {
            const planDate = new Date(day.date);
            planDate.setHours(0, 0, 0, 0);
            return planDate >= today;
          })
        };
      })
    }),
    {
      name: 'weightlossify-planned-days',
      partialize: (state) => ({ 
        plannedDays: state.plannedDays.map(day => ({
          ...day,
          date: day.date.toISOString() // Convert Date to string for storage
        }))
      }),
      onRehydrateStorage: () => (state) => {
        // Convert ISO strings back to Date objects after rehydration
        if (state?.plannedDays) {
          state.plannedDays = state.plannedDays.map(day => ({
            ...day,
            date: new Date(day.date)
          }));
        }
        
        // Clear expired days on load
        state?.clearExpiredDays();
      }
    }
  )
);