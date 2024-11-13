import React from 'react';

interface ExpectedResultsProps {
  currentChange: number;
}

export function ExpectedResults({ currentChange }: ExpectedResultsProps) {
  const getExpectedWeightChange = (calorieChange: number): string => {
    const weeklyChange = (calorieChange * 7) / 7700; // kg per week
    if (Math.abs(weeklyChange) < 0.1) return 'Weight maintenance';
    return `${Math.abs(weeklyChange).toFixed(2)}kg ${weeklyChange > 0 ? 'gain' : 'loss'} per week`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
      <h4 className="font-semibold text-gray-900 mb-4">Expected Results</h4>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700">Weekly Change</div>
          <div className="text-lg font-semibold text-gray-900">
            {getExpectedWeightChange(currentChange)}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Recommended For</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.abs(currentChange) < 100 && 'Maintaining current weight'}
            {currentChange >= 100 && currentChange <= 300 && 'Lean muscle gain'}
            {currentChange > 300 && 'Aggressive muscle gain'}
            {currentChange <= -100 && currentChange >= -500 && 'Moderate weight loss'}
            {currentChange < -500 && 'Aggressive weight loss'}
          </div>
        </div>
      </div>
    </div>
  );
}