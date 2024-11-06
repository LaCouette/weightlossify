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

export function calculateDailyDeficit(weeklyWeightGoal: number): number {
  return Math.round((weeklyWeightGoal * CALORIES_PER_KG) / 7);
}

export function calculateRequiredSteps(
  targetCalories: number,
  baseMaintenance: number,
  targetDeficit: number
): number {
  const requiredNEAT = targetCalories + targetDeficit - baseMaintenance;
  return Math.round(requiredNEAT / CALORIES_PER_STEP);
}

export function calculateTargetCalories(
  totalMaintenance: number,
  targetDeficit: number
): number {
  return Math.round(totalMaintenance - targetDeficit);
}

export function getInitialRecommendation(
  baseMaintenance: number,
  targetDeficit: number
) {
  // Split the deficit between diet and activity
  const dietaryDeficit = Math.round(targetDeficit * 0.7); // 70% from diet
  const activityDeficit = targetDeficit - dietaryDeficit; // 30% from activity

  // Calculate initial steps needed for activity deficit
  const requiredSteps = Math.round(activityDeficit / CALORIES_PER_STEP);

  // Calculate initial calorie target
  const neat = calculateNEAT(requiredSteps);
  const totalMaintenance = baseMaintenance + neat;
  const targetCalories = calculateTargetCalories(totalMaintenance, targetDeficit);

  return {
    calories: targetCalories,
    steps: requiredSteps
  };
}