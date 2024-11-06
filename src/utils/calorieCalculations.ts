// Constants
export const CALORIES_PER_STEP = 0.045;
export const CALORIES_PER_KG = 7700;
export const MAX_STEPS = 40000;
export const MIN_STEPS = 0;

// Basic calculations
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

export function calculateBaseMaintenance(bmr: number): number {
  return Math.round(bmr * 1.1); // BMR + TEF (Thermic Effect of Food)
}

export function calculateNEAT(steps: number): number {
  return Math.round(steps * CALORIES_PER_STEP);
}

export function calculateDailySurplusOrDeficit(weeklyWeightGoal: number, isGain: boolean): number {
  // For muscle gain, we use monthly goals, so convert weekly values
  const weeklyChange = isGain ? (weeklyWeightGoal / 4) : weeklyWeightGoal;
  const dailyChange = Math.round((weeklyChange * CALORIES_PER_KG) / 7);
  return isGain ? dailyChange : -dailyChange; // Positive for surplus, negative for deficit
}

export function calculateRequiredSteps(
  targetCalories: number,
  baseMaintenance: number,
  targetChange: number
): number {
  const requiredNEAT = targetCalories - targetChange - baseMaintenance;
  return Math.round(requiredNEAT / CALORIES_PER_STEP);
}

export function calculateTargetCalories(
  totalMaintenance: number,
  targetChange: number
): number {
  return Math.round(totalMaintenance + targetChange);
}

export function getInitialRecommendation(
  baseMaintenance: number,
  targetChange: number,
  isGain: boolean
) {
  // For muscle gain, we want more calories and moderate activity
  // For weight loss, we want a balanced approach between diet and activity
  const activityRatio = isGain ? 0.2 : 0.3; // 20% from activity for gains, 30% for loss
  const dietaryChange = Math.round(targetChange * (1 - activityRatio));
  const activityChange = targetChange - dietaryChange;

  // Calculate initial steps
  const baseSteps = isGain ? 7500 : 10000; // Lower base steps for muscle gain
  const additionalSteps = Math.round(Math.abs(activityChange) / CALORIES_PER_STEP);
  const requiredSteps = baseSteps + (isGain ? -additionalSteps : additionalSteps);

  // Calculate initial calorie target
  const neat = calculateNEAT(requiredSteps);
  const totalMaintenance = baseMaintenance + neat;
  const targetCalories = calculateTargetCalories(totalMaintenance, targetChange);

  return {
    calories: targetCalories,
    steps: requiredSteps
  };
}