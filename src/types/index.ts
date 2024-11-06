export interface UserProfile {
  // Basic Info
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height: number;
  currentWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  
  // Goals
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'wellness';
  secondaryGoal: 'body_composition' | 'stamina' | 'diet_quality';
  targetWeight?: number;
  muscleGainTarget?: number;
  weeklyWeightGoal?: number; // kg per week for weight loss/gain
  monthlyMuscleGoal?: number; // kg per month for muscle gain
  
  // Calculated Targets
  dailyStepsGoal: number;
  dailyCaloriesTarget: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fats: number;
  };
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  setupCompleted: boolean;
}

export interface DailyLog {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  steps: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sleep: {
    duration: number;
    quality: 1 | 2 | 3 | 4 | 5;
  };
  exercise: {
    type: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
  }[];
}