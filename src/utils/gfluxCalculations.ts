// G-Flux Calculations

// Constants for G-Flux calculation
const CALORIES_PER_STEP = 0.045;
const BASE_ACTIVITY_CALORIES = 300; // Baseline activity calories excluding steps

interface GFluxEducation {
  whatIsIt: string;
  whyImportant: string[];
  howCalculated: string;
  benefits: string[];
}

export function calculateGFlux(dailyCalories: number, dailySteps: number): number {
  // Calculate total energy expenditure
  const stepCalories = dailySteps * CALORIES_PER_STEP;
  const totalActivityCalories = stepCalories + BASE_ACTIVITY_CALORIES;
  
  // G-Flux is the sum of energy intake and energy expenditure
  const gFlux = dailyCalories + totalActivityCalories;
  
  return Math.round(gFlux);
}

export function getGFluxLevel(gFlux: number): {
  level: 'low' | 'moderate' | 'high' | 'optimal';
  message: string;
  color: string;
} {
  if (gFlux < 2000) {
    return {
      level: 'low',
      message: 'Low metabolic activity. Your body is operating in an energy-conserving state.',
      color: 'red'
    };
  } else if (gFlux < 3000) {
    return {
      level: 'moderate',
      message: 'Moderate energy flux. Your metabolism is active but has room for optimization.',
      color: 'yellow'
    };
  } else if (gFlux < 4000) {
    return {
      level: 'high',
      message: 'High energy flux. Your metabolism is running efficiently with good energy turnover.',
      color: 'green'
    };
  } else {
    return {
      level: 'optimal',
      message: 'Optimal energy flux! Your body is in a highly metabolically active state.',
      color: 'blue'
    };
  }
}

export function getGFluxEducation(level: string): GFluxEducation {
  return {
    whatIsIt: "G-Flux (Energy Flux) represents the total amount of energy flowing through your body - both the calories you consume and the calories you burn. Higher G-Flux typically means better body composition and health outcomes, even at the same body weight.",
    whyImportant: [
      "Higher metabolic rate and better nutrient partitioning",
      "Improved body composition (more muscle, less fat)",
      "Better appetite regulation and food utilization",
      "Enhanced recovery and athletic performance",
      "Increased insulin sensitivity and metabolic health"
    ],
    howCalculated: "Your G-Flux score combines your daily calorie intake with your energy expenditure from steps and baseline activity. The higher your food intake AND activity level, the higher your G-Flux.",
    benefits: level === 'optimal' ? [
      "Maximum nutrient partitioning efficiency",
      "Optimal hormone levels and metabolic health",
      "Enhanced recovery capacity",
      "Improved body composition potential"
    ] : [
      "Better appetite control",
      "Increased metabolic flexibility",
      "Improved body composition",
      "Enhanced recovery and performance"
    ]
  };
}

export function getGFluxRecommendations(gFlux: number, dailyCalories: number, dailySteps: number): {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
} {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[]
  };

  // Immediate Actions (Today)
  if (dailySteps < 8000) {
    recommendations.immediate.push('Add 2,000 steps to your daily routine through short walks');
  }
  if (dailyCalories < 1800) {
    recommendations.immediate.push('Increase calorie intake by adding nutrient-dense snacks');
  }
  if (dailySteps >= 12000) {
    recommendations.immediate.push('Maintain your excellent activity level while ensuring adequate recovery');
  }
  if (dailyCalories >= 2500) {
    recommendations.immediate.push('Focus on high-quality protein sources and nutrient timing');
  }

  // Short-Term Goals (This Week)
  if (gFlux < 3000) {
    recommendations.shortTerm.push('Gradually increase daily steps by 1,000 each week');
    recommendations.shortTerm.push('Add 100-200 calories daily from whole food sources');
  } else if (gFlux >= 3000 && gFlux < 4000) {
    recommendations.shortTerm.push('Optimize meal timing around your activity');
    recommendations.shortTerm.push('Include more non-exercise movement throughout the day');
  } else {
    recommendations.shortTerm.push('Focus on recovery quality and sleep optimization');
    recommendations.shortTerm.push('Fine-tune nutrient timing for performance');
  }

  // Long-Term Strategies (Next Few Weeks)
  if (gFlux < 3000) {
    recommendations.longTerm.push('Build up to 10,000 daily steps');
    recommendations.longTerm.push('Develop a structured meal plan to support increased activity');
  } else if (gFlux >= 3000 && gFlux < 4000) {
    recommendations.longTerm.push('Incorporate varied movement patterns and activities');
    recommendations.longTerm.push('Experiment with different meal frequencies and timing');
  } else {
    recommendations.longTerm.push('Consider periodizing your G-Flux for optimal results');
    recommendations.longTerm.push('Focus on maintaining this high level while optimizing recovery');
  }

  return recommendations;
}