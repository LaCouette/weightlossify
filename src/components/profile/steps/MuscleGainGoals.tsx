import React from 'react';
import { Dumbbell, TrendingUp } from 'lucide-react';
import { calculateMuscleGainPotential } from '../../../utils/calculations';

interface MuscleGainGoalsProps {
  currentWeight: number;
  height: number;
  age: number;
  gender: string;
  bodyFat: number;
  onChange: (updates: any) => void;
}

export function MuscleGainGoals({
  currentWeight,
  height,
  age,
  gender,
  bodyFat,
  onChange
}: MuscleGainGoalsProps) {
  const muscleGainPotential = calculateMuscleGainPotential(age, bodyFat, height, gender);

  // Set initial values for muscle gain plan
  React.useEffect(() => {
    onChange({
      primaryGoal: 'muscle_gain',
      weeklyWeightGoal: '0.5', // Moderate muscle gain pace
      targetWeight: Math.round(currentWeight * 1.1) // Initial target: 10% more than current weight
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Dumbbell className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Lean Muscle Growth Plan</h3>
        <p className="text-sm text-gray-600">
          Based on your current stats and training experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Monthly Potential</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {muscleGainPotential.monthlyGain.toFixed(1)}kg
          </p>
          <p className="text-sm text-gray-600 mt-1">
            of lean muscle per month
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Yearly Potential</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {muscleGainPotential.yearlyGain.toFixed(1)}kg
          </p>
          <p className="text-sm text-gray-600 mt-1">
            maximum in the first year
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
        <h4 className="font-semibold text-gray-900 mb-4">Optimized for Lean Gains</h4>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Your plan is optimized for maximum muscle growth with minimal fat gain:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Moderate caloric surplus for optimal muscle synthesis</li>
            <li>• Progressive overload training approach</li>
            <li>• Balanced activity level to support recovery</li>
            <li>• Focus on body composition over scale weight</li>
          </ul>
          <div className="mt-4 text-sm text-gray-700">
            <strong>Note:</strong> These projections are based on your age ({age}), current body fat ({bodyFat}%), 
            and training potential. Results may vary based on genetics, training intensity, and consistency.
          </div>
        </div>
      </div>
    </div>
  );
}