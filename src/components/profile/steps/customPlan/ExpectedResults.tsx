import React from 'react';
import { Scale, TrendingDown, TrendingUp, BarChart, Target, Activity } from 'lucide-react';

interface ExpectedResultsProps {
  currentChange: number;
}

export function ExpectedResults({ currentChange }: ExpectedResultsProps) {
  const getExpectedWeightChange = (calorieChange: number): string => {
    const weeklyChange = (calorieChange * 7) / 7700; // kg per week
    if (Math.abs(weeklyChange) < 0.1) return 'Weight maintenance';
    return `${Math.abs(weeklyChange).toFixed(2)}kg ${weeklyChange > 0 ? 'gain' : 'loss'} per week`;
  };

  // Determine the mode and styling based on calorie change
  const getMode = () => {
    if (Math.abs(currentChange) < 100) {
      return {
        mode: 'maintenance',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-100',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-900',
        icon: BarChart,
        title: 'Maintenance Mode',
        description: 'Focus on maintaining current weight while improving body composition'
      };
    }
    if (currentChange > 0) {
      return {
        mode: 'bulk',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        icon: TrendingUp,
        title: currentChange > 300 ? 'Aggressive Bulk' : 'Lean Bulk',
        description: currentChange > 300 
          ? 'Maximize muscle growth with higher surplus' 
          : 'Optimize muscle gain while minimizing fat gain'
      };
    }
    return {
      mode: 'cut',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      icon: TrendingDown,
      title: currentChange < -500 ? 'Aggressive Cut' : 'Moderate Cut',
      description: currentChange < -500
        ? 'Rapid fat loss with larger deficit'
        : 'Sustainable fat loss while preserving muscle'
    };
  };

  const mode = getMode();
  const Icon = mode.icon;

  return (
    <div className={`rounded-xl p-6 ${mode.bgColor} border ${mode.borderColor}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 bg-white/50 rounded-lg ${mode.iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className={`font-semibold ${mode.textColor}`}>{mode.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weekly Change */}
        <div className={`bg-white/50 rounded-lg p-4 ${mode.borderColor} border`}>
          <div className="flex items-center gap-2 mb-2">
            <Scale className={`h-4 w-4 ${mode.iconColor}`} />
            <div className="text-sm font-medium text-gray-700">Weekly Change</div>
          </div>
          <div className={`text-lg font-semibold ${mode.textColor}`}>
            {getExpectedWeightChange(currentChange)}
          </div>
        </div>

        {/* Daily Activity */}
        <div className={`bg-white/50 rounded-lg p-4 ${mode.borderColor} border`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`h-4 w-4 ${mode.iconColor}`} />
            <div className="text-sm font-medium text-gray-700">Daily Target</div>
          </div>
          <div className={`text-lg font-semibold ${mode.textColor}`}>
            {Math.abs(currentChange)} kcal {currentChange > 100 ? 'surplus' : currentChange < -100 ? 'deficit' : 'maintenance'}
          </div>
        </div>
      </div>

      {/* Target Info */}
      <div className={`mt-4 p-4 bg-white/50 rounded-lg ${mode.borderColor} border`}>
        <div className="flex items-center gap-2 mb-2">
          <Target className={`h-4 w-4 ${mode.iconColor}`} />
          <div className="text-sm font-medium text-gray-700">Optimal For</div>
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          {mode.mode === 'maintenance' && (
            <>
              <li>• Recomposition (lose fat, gain muscle)</li>
              <li>• Performance optimization</li>
              <li>• Long-term sustainability</li>
            </>
          )}
          {mode.mode === 'bulk' && (
            <>
              <li>• Maximum muscle growth</li>
              <li>• Strength gains</li>
              <li>• Recovery optimization</li>
            </>
          )}
          {mode.mode === 'cut' && (
            <>
              <li>• Fat loss while preserving muscle</li>
              <li>• Body composition improvement</li>
              <li>• Definition enhancement</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}