// Constants
export const CALORIES_PER_KG = 7700;
export const CALORIES_PER_STEP = 0.045;
export const MAX_STEPS = 50000;
export const MIN_STEPS = 0;

// Workout calories based on height ranges
export const WORKOUT_CALORIES: { [key: string]: number } = {
  '150-160': 150,
  '160-170': 175,
  '170-180': 200,
  '180-190': 225,
  '190-200': 250
};

// Weekly workouts by activity level
export const WEEKLY_WORKOUTS: { [key: string]: number } = {
  'light': 1.5,
  'gym_bro': 4,
  'gym_rat': 6.5
};

export function roundSteps(steps: number): number {
  return Math.ceil(steps / 100) * 100;
}

export function roundCalories(calories: number, goal: 'weight_loss' | 'muscle_gain' | 'maintenance'): number {
  const roundTo = 50;
  if (goal === 'muscle_gain') {
    return Math.ceil(calories / roundTo) * roundTo;
  }
  return Math.floor(calories / roundTo) * roundTo;
}

// Get calories burned per workout based on height
export function getWorkoutCalories(height: number): number {
  if (height < 150) return 150;
  if (height > 200) return 250;
  
  const range = `${Math.floor(height / 10) * 10}-${Math.floor(height / 10) * 10 + 10}`;
  return WORKOUT_CALORIES[range] || 200;
}

// Calculate weekly calories from workouts
export function calculateWorkoutCalories(height: number, activityLevel: string): number {
  const caloriesPerWorkout = getWorkoutCalories(height);
  const weeklyWorkouts = WEEKLY_WORKOUTS[activityLevel] || 0;
  return Math.round(caloriesPerWorkout * weeklyWorkouts);
}

// BMR calculation using Katch-McArdle Formula when body fat is available
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string,
  bodyFat?: number
): number {
  if (typeof bodyFat === 'number' && !isNaN(bodyFat)) {
    // Katch-McArdle Formula
    const leanBodyMass = weight * (1 - bodyFat / 100);
    return 370 + (21.6 * leanBodyMass);
  } else {
    // Mifflin-St Jeor Equation as fallback
    const baseBMR = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
  }
}

export function calculateBaseMaintenance(bmr: number): number {
  return Math.round(bmr * 1.1); // BMR + TEF (Thermic Effect of Food)
}

export function calculateNEAT(steps: number): number {
  return Math.round(steps * CALORIES_PER_STEP);
}

export function calculateDailySurplusOrDeficit(weeklyWeightGoal: number, isGain: boolean): number {
  const weeklyChange = isGain ? (weeklyWeightGoal / 4) : weeklyWeightGoal;
  const dailyChange = Math.round((weeklyChange * CALORIES_PER_KG) / 7);
  return isGain ? dailyChange : -dailyChange;
}

export function calculateRequiredSteps(
  targetCalories: number,
  baseMaintenance: number,
  targetChange: number
): number {
  const requiredNEAT = targetCalories - targetChange - baseMaintenance;
  return roundSteps(Math.round(requiredNEAT / CALORIES_PER_STEP));
}

export function calculateTargetCalories(
  totalMaintenance: number,
  targetChange: number,
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance'
): number {
  return roundCalories(Math.round(totalMaintenance + targetChange), goal);
}

export function getInitialRecommendation(
  baseMaintenance: number,
  targetChange: number,
  isGain: boolean
) {
  const activityRatio = isGain ? 0.2 : 0.3;
  const dietaryChange = Math.round(targetChange * (1 - activityRatio));
  const activityChange = targetChange - dietaryChange;

  const baseSteps = isGain ? 7500 : 10000;
  const additionalSteps = Math.round(Math.abs(activityChange) / CALORIES_PER_STEP);
  const requiredSteps = roundSteps(baseSteps + (isGain ? -additionalSteps : additionalSteps));

  const neat = calculateNEAT(requiredSteps);
  const totalMaintenance = baseMaintenance + neat;
  const targetCalories = calculateTargetCalories(
    totalMaintenance, 
    targetChange,
    isGain ? 'muscle_gain' : 'weight_loss'
  );

  return {
    calories: targetCalories,
    steps: requiredSteps
  };
}