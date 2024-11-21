import { bodyFatRanges } from './referenceData';

interface BodyCompositionInsights {
  category: {
    label: string;
    color: string;
  };
  insights: Array<{
    area: string;
    description: string;
    color: string;
  }>;
  recommendations: {
    training: string[];
    nutrition: string[];
    goals: string[];
  };
}

export function getBodyCompositionInsights(
  bodyFat: number,
  metadata: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
  }
): BodyCompositionInsights {
  // Get category and color
  const category = getCategory(bodyFat, metadata.gender);
  
  // Generate area-specific insights
  const insights = generateInsights(bodyFat, metadata);
  
  // Generate recommendations
  const recommendations = generateRecommendations(bodyFat, metadata, category.label);

  return {
    category,
    insights,
    recommendations
  };
}

function getCategory(bf: number, gender: string) {
  if (gender === 'male') {
    if (bf < 6) return { label: 'Essential Fat', color: 'text-yellow-600' };
    if (bf < 14) return { label: 'Athletic', color: 'text-green-600' };
    if (bf < 18) return { label: 'Fitness', color: 'text-blue-600' };
    if (bf < 25) return { label: 'Average', color: 'text-indigo-600' };
    return { label: 'Above Average', color: 'text-red-600' };
  } else {
    if (bf < 14) return { label: 'Essential Fat', color: 'text-yellow-600' };
    if (bf < 21) return { label: 'Athletic', color: 'text-green-600' };
    if (bf < 25) return { label: 'Fitness', color: 'text-blue-600' };
    if (bf < 32) return { label: 'Average', color: 'text-indigo-600' };
    return { label: 'Above Average', color: 'text-red-600' };
  }
}

function generateInsights(
  bodyFat: number,
  metadata: { gender: string; age: number }
) {
  const insights = [];
  const { gender } = metadata;
  const isMale = gender === 'male';

  // Upper Body Analysis
  insights.push({
    area: 'Upper Body Composition',
    description: getUpperBodyInsight(bodyFat, isMale),
    color: 'bg-blue-500'
  });

  // Core Analysis
  insights.push({
    area: 'Core Region',
    description: getCoreInsight(bodyFat, isMale),
    color: 'bg-green-500'
  });

  // Lower Body Analysis
  insights.push({
    area: 'Lower Body Composition',
    description: getLowerBodyInsight(bodyFat, isMale),
    color: 'bg-purple-500'
  });

  // Overall Distribution
  insights.push({
    area: 'Fat Distribution Pattern',
    description: getDistributionInsight(bodyFat, isMale),
    color: 'bg-orange-500'
  });

  return insights;
}

function generateRecommendations(
  bodyFat: number,
  metadata: { gender: string; age: number },
  category: string
) {
  const { gender, age } = metadata;
  const isMale = gender === 'male';
  const isYoung = age < 30;

  const recommendations = {
    training: [] as string[],
    nutrition: [] as string[],
    goals: [] as string[]
  };

  // Training Recommendations
  if (category === 'Above Average') {
    recommendations.training = [
      'Focus on compound exercises (squats, deadlifts, bench press)',
      'Include HIIT workouts 2-3 times per week',
      'Add 30-45 minutes of steady-state cardio on rest days',
      'Prioritize progressive overload in strength training'
    ];
  } else if (category === 'Athletic' || category === 'Fitness') {
    recommendations.training = [
      'Maintain current training volume with periodic intensity increases',
      'Include mobility and flexibility work',
      'Focus on muscle groups that need additional development',
      'Consider periodization for continued progress'
    ];
  } else if (category === 'Essential Fat') {
    recommendations.training = [
      'Reduce high-intensity training frequency',
      'Focus on maintenance and recovery',
      'Include more restorative activities',
      'Prioritize strength maintenance over progression'
    ];
  }

  // Nutrition Recommendations
  if (category === 'Above Average') {
    recommendations.nutrition = [
      `Target protein intake: ${Math.round(metadata.weight * 2.2)}g daily`,
      'Create a moderate caloric deficit (20-25% below maintenance)',
      'Time carbohydrates around workouts',
      'Include fiber-rich foods to manage hunger'
    ];
  } else if (category === 'Athletic' || category === 'Fitness') {
    recommendations.nutrition = [
      `Maintain protein intake at ${Math.round(metadata.weight * 2)}g daily`,
      'Focus on nutrient timing and quality',
      'Consider carb cycling based on training days',
      'Optimize pre and post-workout nutrition'
    ];
  } else if (category === 'Essential Fat') {
    recommendations.nutrition = [
      'Gradually increase caloric intake',
      'Maintain high protein intake for muscle preservation',
      'Include healthy fats for hormone optimization',
      'Focus on nutrient-dense whole foods'
    ];
  }

  // Goal Recommendations
  recommendations.goals = [
    getShortTermGoal(bodyFat, isMale),
    getMediumTermGoal(bodyFat, isMale),
    getLongTermGoal(bodyFat, isMale, isYoung)
  ];

  return recommendations;
}

function getUpperBodyInsight(bodyFat: number, isMale: boolean): string {
  if (isMale) {
    if (bodyFat < 10) return 'High muscle definition in shoulders and arms with visible vascularity. Minimal fat storage in upper body.';
    if (bodyFat < 15) return 'Good muscle definition in upper body with some vascularity in arms. Low fat storage in chest and shoulders.';
    if (bodyFat < 20) return 'Moderate muscle definition with some fat storage in chest and upper arms. Limited vascularity.';
    return 'Higher fat storage in chest and upper arms. Muscle definition less visible.';
  } else {
    if (bodyFat < 18) return 'Athletic upper body with visible muscle tone in shoulders and arms. Minimal fat storage.';
    if (bodyFat < 25) return 'Good muscle tone with balanced fat distribution in upper body. Feminine shape maintained.';
    if (bodyFat < 30) return 'Natural feminine curves with moderate fat storage in upper arms and back.';
    return 'Higher fat storage in upper arms and back region. Softer appearance in upper body.';
  }
}

function getCoreInsight(bodyFat: number, isMale: boolean): string {
  if (isMale) {
    if (bodyFat < 10) return 'Highly visible six-pack abs with clear muscle separation. Minimal fat around waist.';
    if (bodyFat < 15) return 'Visible abs with some definition. Very little fat around midsection.';
    if (bodyFat < 20) return 'Some ab definition visible, especially upper abs. Moderate fat storage around waist.';
    return 'Limited ab visibility with higher fat storage in midsection. Focus area for fat loss.';
  } else {
    if (bodyFat < 18) return 'Athletic core with visible muscle tone. Minimal fat storage in abdominal region.';
    if (bodyFat < 25) return 'Flat stomach with some muscle tone visible. Healthy fat distribution in core.';
    if (bodyFat < 30) return 'Natural feminine core with moderate fat storage. Even distribution.';
    return 'Higher fat storage in abdominal region. Primary area for potential improvement.';
  }
}

function getLowerBodyInsight(bodyFat: number, isMale: boolean): string {
  if (isMale) {
    if (bodyFat < 10) return 'Striated leg muscles with clear separation. Minimal fat storage in lower body.';
    if (bodyFat < 15) return 'Good muscle definition in legs with visible quad separation. Low fat storage.';
    if (bodyFat < 20) return 'Some muscle definition in legs with moderate fat storage. Balance between muscle and fat.';
    return 'Higher fat storage in thighs and glutes. Muscle definition less visible.';
  } else {
    if (bodyFat < 18) return 'Athletic legs with visible muscle tone. Balanced fat distribution in lower body.';
    if (bodyFat < 25) return 'Toned legs with feminine shape. Healthy fat distribution in thighs and glutes.';
    if (bodyFat < 30) return 'Natural feminine curves with moderate fat storage in lower body.';
    return 'Higher fat storage in thighs and hips. Typical feminine fat distribution pattern.';
  }
}

function getDistributionInsight(bodyFat: number, isMale: boolean): string {
  if (isMale) {
    if (bodyFat < 10) return 'Even distribution with minimal fat storage. Primarily essential fat reserves.';
    if (bodyFat < 15) return 'Balanced distribution with slight concentration in lower abdomen.';
    if (bodyFat < 20) return 'Typical male pattern with moderate abdominal fat storage.';
    return 'Central adiposity pattern with primary storage in abdominal region.';
  } else {
    if (bodyFat < 18) return 'Athletic distribution with essential fat maintaining feminine shape.';
    if (bodyFat < 25) return 'Balanced feminine distribution in hips, thighs, and breast tissue.';
    if (bodyFat < 30) return 'Gynoid fat pattern with storage in lower body maintaining feminine curves.';
    return 'Typical feminine distribution with higher storage in hips and thighs.';
  }
}

function getShortTermGoal(bodyFat: number, isMale: boolean): string {
  const healthyRange = isMale ? { min: 10, max: 20 } : { min: 18, max: 28 };
  
  if (bodyFat < healthyRange.min) {
    return `Gradually increase body fat to ${healthyRange.min}% while maintaining muscle mass`;
  } else if (bodyFat > healthyRange.max) {
    return `Reduce body fat by 1% per month targeting ${healthyRange.max}%`;
  } else {
    return 'Maintain current body composition while focusing on performance goals';
  }
}

function getMediumTermGoal(bodyFat: number, isMale: boolean): string {
  const healthyRange = isMale ? { min: 10, max: 20 } : { min: 18, max: 28 };
  
  if (bodyFat < healthyRange.min) {
    return 'Build lean muscle mass while gradually increasing caloric intake';
  } else if (bodyFat > healthyRange.max) {
    return 'Develop consistent exercise and nutrition habits for sustainable fat loss';
  } else {
    return 'Focus on body recomposition through progressive overload and optimal nutrition';
  }
}

function getLongTermGoal(bodyFat: number, isMale: boolean, isYoung: boolean): string {
  const healthyRange = isMale ? { min: 10, max: 20 } : { min: 18, max: 28 };
  
  if (isYoung) {
    return `Develop sustainable habits to maintain ${healthyRange.min}-${healthyRange.max}% body fat year-round`;
  } else {
    return `Focus on maintaining muscle mass and keeping body fat between ${healthyRange.min}-${healthyRange.max}%`;
  }
}