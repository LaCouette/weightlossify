// Constants
export const CALORIES_PER_KG = 7700;
export const CALORIES_PER_STEP = 0.045;

// BMR calculation using Katch-McArdle Formula when body fat is available
// Falls back to Mifflin-St Jeor when it's not
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

// TDEE calculation based on activity level
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9
  };
  
  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55;
  return bmr * multiplier;
}

// Get baseline steps based on activity level
export function getBaselineSteps(activityLevel: string): number {
  const baselineSteps = {
    sedentary: 4000,
    light: 6000,
    moderate: 8000,
    very: 10000,
    extra: 12000
  };
  return baselineSteps[activityLevel as keyof typeof baselineSteps] || 8000;
}

export function calculateDailyCalorieChange(weeklyWeightGoal: number): number {
  return (weeklyWeightGoal * CALORIES_PER_KG) / 7;
}

export function calculateTargetCalories(tdee: number, dailyCalorieChange: number): number {
  return tdee + dailyCalorieChange;
}

export function calculateCalorieSplit(dailyCalorieChange: number) {
  return {
    dietAdjustment: dailyCalorieChange * DIET_ADJUSTMENT_RATIO,
    activityAdjustment: dailyCalorieChange * ACTIVITY_ADJUSTMENT_RATIO
  };
}

export function calculateRecommendedStepGoal(
  baselineSteps: number,
  activityCalorieAdjustment: number
): number {
  const additionalSteps = activityCalorieAdjustment / CALORIES_PER_STEP;
  return Math.round(baselineSteps + additionalSteps);
}

export function recalculateStepsFromCalorieAdjustment(
  currentStepGoal: number,
  calorieAdjustment: number,
  isDeficit: boolean
): number {
  const stepAdjustment = calorieAdjustment / CALORIES_PER_STEP;
  return Math.round(currentStepGoal + (isDeficit ? -stepAdjustment : stepAdjustment));
}

export function recalculateCaloriesFromStepAdjustment(
  currentCalories: number,
  stepAdjustment: number,
  isDeficit: boolean
): number {
  const calorieChange = stepAdjustment * CALORIES_PER_STEP;
  return Math.round(currentCalories + (isDeficit ? calorieChange : -calorieChange));
}

// BMI calculation
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

// BMI classification
export function getBMIClassification(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// Ideal weight calculations using various formulas
export function calculateIdealWeight(height: number) {
  const heightInCm = height;
  
  // G.J. Hamwi Formula (1964)
  const hamwi = 48 + ((heightInCm - 152.4) / 2.54) * 2.7;
  
  // B.J. Devine Formula (1974)
  const devine = 50 + ((heightInCm - 152.4) / 2.54) * 2.3;
  
  // J.D. Robinson Formula (1983)
  const robinson = 49 + ((heightInCm - 152.4) / 2.54) * 2.3;
  
  // D.R. Miller Formula (1983)
  const miller = 56.2 + ((heightInCm - 152.4) / 2.54) * 1.41;
  
  return {
    hamwi: Math.round(hamwi),
    devine: Math.round(devine),
    robinson: Math.round(robinson),
    miller: Math.round(miller)
  };
}

// Maximum muscular potential calculation (Martin Berkhan's Formula)
export function calculateMaxMuscularPotential(height: number) {
  const heightInCm = height;
  const leanMassAt5 = heightInCm - 100; // Weight at 5% body fat
  
  return {
    at5: leanMassAt5,
    at10: Math.round(leanMassAt5 * 1.05), // Weight at 10% body fat
    at15: Math.round(leanMassAt5 * 1.1)  // Weight at 15% body fat
  };
}