// Firebase Database Schema
// This represents the structure and naming conventions for our Firestore collections

export interface FirebaseSchema {
    users: {
      [userId: string]: {
        // Profile Information
        profile: {
          email: string;
          name: string;
          gender: 'male' | 'female';
          age: number;
          height: number;
          currentWeight: number;
          bodyFat?: number;
          activityLevel: 'light' | 'gym_bro' | 'gym_rat';
          createdAt: Date;
          updatedAt: Date;
        };
  
        // Goals & Targets
        goals: {
          primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance';
          weeklyWeightGoal?: string; // For weight loss: '0.35' or '0.6'
          targetWeight?: number;
          dailyStepsGoal: number;
          dailyCaloriesTarget: number;
          startDate: Date;
          targetDate?: Date;
          updatedAt: Date;
        };
  
        // Daily Logs Collection
        logs: {
          // Format: YYYY-MM-DD (e.g., "2024-03-15")
          [date: string]: {
            weight?: number;
            calories?: number;
            steps?: number;
            createdAt: Date;
            updatedAt: Date;
          };
        };
  
        // Weekly Summaries Collection (Auto-generated)
        weeklySummaries: {
          // Format: YYYY-WW (e.g., "2024-11" for week 11 of 2024)
          [weekId: string]: {
            startDate: Date;
            endDate: Date;
            averageWeight: number;
            totalCalories: number;
            averageCalories: number;
            totalSteps: number;
            averageSteps: number;
            weightChange: number;
            completedDays: number;
            createdAt: Date;
            updatedAt: Date;
          };
        };
  
        // Monthly Summaries Collection (Auto-generated)
        monthlySummaries: {
          // Format: YYYY-MM (e.g., "2024-03")
          [monthId: string]: {
            startDate: Date;
            endDate: Date;
            startWeight: number;
            endWeight: number;
            weightChange: number;
            averageCalories: number;
            averageSteps: number;
            completedDays: number;
            createdAt: Date;
            updatedAt: Date;
          };
        };
  
        // Progress Milestones Collection
        milestones: {
          // Format: milestone_type_value (e.g., "weight_80" or "steps_10000")
          [milestoneId: string]: {
            type: 'weight' | 'steps' | 'streak';
            value: number;
            achievedAt: Date;
            previousValue: number;
            description: string;
          };
        };
  
        // Streaks Tracking
        streaks: {
          currentStreak: number;
          longestStreak: number;
          lastLogDate: Date;
          updatedAt: Date;
        };
      };
    };
  }
  
  // Example document paths:
  // /users/{userId}/profile
  // /users/{userId}/goals
  // /users/{userId}/logs/2024-03-15
  // /users/{userId}/weeklySummaries/2024-11
  // /users/{userId}/monthlySummaries/2024-03
  // /users/{userId}/milestones/weight_80
  // /users/{userId}/streaks