export interface DailyLog {
  id: string;
  date: string;
  weight?: number | null;
  bodyFat?: number | null;
  calories?: number | null;
  macros?: {
    proteins: number;
    fats: number;
    carbs: number;
    fiber: number;
  } | null;
  steps?: number | null;
  distance?: number | null;
  createdAt: Date;
  updatedAt: Date;
}