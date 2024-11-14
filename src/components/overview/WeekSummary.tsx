import React from 'react';
import { formatWeight } from '../../utils/weightFormatting';

interface WeekSummaryData {
  totalDays: number;
  avgWeight: number | null;
  weightChange: number | null;
  avgCalories: number | null;
  avgSteps: number | null;
  totalBalance: number;
  estimatedWeightChange: number;
}

interface WeekSummaryProps {
  data: WeekSummaryData;
}

export function WeekSummary({ data }: WeekSummaryProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Week Summary</h3>
      
      <div className="space-y-6">
        <div>
          <div className="text-sm text-gray-600 mb-2">Logged Days</div>
          <div className="text-2xl font-bold text-gray-900">
            {data.totalDays} / 7
          </div>
        </div>

        {data.avgWeight && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Average Weight</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900">
                {formatWeight(data.avgWeight)} kg
              </div>
              {data.weightChange && (
                <div className={`text-sm font-medium ${
                  data.weightChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {data.weightChange > 0 ? '+' : ''}
                  {formatWeight(data.weightChange)} kg vs prev week
                </div>
              )}
            </div>
          </div>
        )}

        {data.avgCalories && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Average Daily Calories</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(data.avgCalories).toLocaleString()}
            </div>
          </div>
        )}

        {data.avgSteps && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Average Daily Steps</div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(data.avgSteps).toLocaleString()}
            </div>
          </div>
        )}

        {data.totalBalance !== 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Weekly Caloric Balance</div>
            <div className="flex flex-col">
              <div className={`text-2xl font-bold ${
                data.totalBalance > 0 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {data.totalBalance > 0 ? '+' : ''}
                {Math.round(data.totalBalance).toLocaleString()} kcal
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Estimated impact: {data.estimatedWeightChange > 0 ? '+' : ''}
                {data.estimatedWeightChange.toFixed(2)} kg
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}