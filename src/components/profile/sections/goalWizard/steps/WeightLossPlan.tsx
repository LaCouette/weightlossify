import React, { useState } from 'react';
import { Scale, TrendingDown } from 'lucide-react';

interface WeightLossPlanProps {
  currentWeight: number;
  currentPlan?: string;
  onChange: (plan: string, targetWeight: number) => void;
}

export function WeightLossPlan({ currentWeight, currentPlan, onChange }: WeightLossPlanProps) {
  const [targetWeight, setTargetWeight] = useState<number>(
    Math.round((Math.max(currentWeight - 20, currentWeight * 0.8) * 2)) / 2
  );
  const [selectedPlan, setSelectedPlan] = useState<'moderate_loss' | 'aggressive_loss'>(
    currentPlan === '0.35' ? 'moderate_loss' : 'aggressive_loss'
  );

  const handlePlanSelect = (plan: 'moderate_loss' | 'aggressive_loss') => {
    setSelectedPlan(plan);
    onChange(plan === 'moderate_loss' ? '0.35' : '0.6', targetWeight);
  };

  const handleTargetWeightChange = (value: number) => {
    // Round to nearest 0.5
    const roundedValue = Math.round(value * 2) / 2;
    const minWeight = Math.ceil(currentWeight * 0.6 * 2) / 2; // Round up to nearest 0.5
    const maxWeight = Math.floor((currentWeight - 0.5) * 2) / 2; // Round down to nearest 0.5
    const newValue = Math.min(Math.max(roundedValue, minWeight), maxWeight);
    setTargetWeight(newValue);
    onChange(selectedPlan === 'moderate_loss' ? '0.35' : '0.6', newValue);
  };

  const calculateTimeline = (weeklyLoss: number) => {
    const totalWeightToLose = currentWeight - targetWeight;
    const weeks = Math.ceil(totalWeightToLose / weeklyLoss);
    const months = Math.ceil(weeks / 4);
    return { weeks, months };
  };

  const moderateTimeline = calculateTimeline(0.35);
  const aggressiveTimeline = calculateTimeline(0.6);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Scale className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Weight Loss Plan</h3>
        <p className="text-sm text-gray-600">
          Choose your preferred approach and set your target weight
        </p>
      </div>

      <div className="space-y-4">
        {/* Target Weight Selector */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-4">Target Weight</label>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {targetWeight.toFixed(1)} kg
              </div>
              <div className="text-sm text-gray-500">target weight</div>
              <div className="text-sm text-blue-600 mt-1">
                ({(currentWeight - targetWeight).toFixed(1)} kg to lose)
              </div>
            </div>

            <div className="relative pt-6 pb-2">
              <div className="relative h-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full shadow-inner" />
                <input
                  type="range"
                  value={targetWeight}
                  onChange={(e) => handleTargetWeightChange(Number(e.target.value))}
                  className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer touch-pan-y"
                  step="0.5"
                  min={Math.ceil(currentWeight * 0.6 * 2) / 2}
                  max={Math.floor((currentWeight - 0.5) * 2) / 2}
                  style={{
                    '--thumb-size': '2rem',
                    '--thumb-shadow': '0 2px 6px rgba(0,0,0,0.2)'
                  } as React.CSSProperties}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>{(currentWeight * 0.6).toFixed(1)} kg</span>
                <span>{(currentWeight - 0.5).toFixed(1)} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="space-y-4">
          {/* Moderate Loss Plan */}
          <button
            type="button"
            onClick={() => handlePlanSelect('moderate_loss')}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selectedPlan === 'moderate_loss'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                selectedPlan === 'moderate_loss' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <TrendingDown className={`h-6 w-6 ${
                  selectedPlan === 'moderate_loss' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Moderate Weight Loss</h4>
                <p className="text-sm text-gray-600 mt-1">Steady, sustainable progress</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Loss</p>
                    <p className="text-lg font-semibold text-blue-600">0.35 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ~{moderateTimeline.months} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Aggressive Loss Plan */}
          <button
            type="button"
            onClick={() => handlePlanSelect('aggressive_loss')}
            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
              selectedPlan === 'aggressive_loss'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                selectedPlan === 'aggressive_loss' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <TrendingDown className={`h-6 w-6 ${
                  selectedPlan === 'aggressive_loss' ? 'text-purple-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Aggressive Weight Loss</h4>
                <p className="text-sm text-gray-600 mt-1">Faster results, requires more discipline</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Loss</p>
                    <p className="text-lg font-semibold text-purple-600">0.6 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="text-lg font-semibold text-purple-600">
                      ~{aggressiveTimeline.months} months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}