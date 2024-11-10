export interface UserProfile {
  // Basic Info
  name: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  currentWeight: number;
  bodyFat?: number;
  activityLevel: 'light' | 'gym_bro' | 'gym_rat';
  
  // Goals
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  targetWeight?: number;
  weeklyWeightGoal?: string;
  
  // Daily Targets
  dailyStepsGoal: number;
  dailyCaloriesTarget: number;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  setupCompleted: boolean;
}

export interface DailyLog {
  id: string;
  date: string;
  weight?: number;
  calories?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: number;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}