import React from 'react';
import { Scale, Activity, Utensils, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
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
  // Calculate weight change percentage
  const weightChangePercentage = data.weightChange && data.avgWeight
    ? (data.weightChange / (data.avgWeight - data.weightChange)) * 100
    : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Calendar className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Week Summary</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Logged Days Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <div className="text-sm font-medium text-gray-700">Logged Days</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.totalDays} <span className="text-gray-500 text-lg">/ 7</span>
          </div>
        </div>

        {/* Average Weight Card */}
        {data.avgWeight && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-blue-600" />
              <div className="text-sm font-medium text-blue-900">Average Weight</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-900">
                {formatWeight(data.avgWeight)} kg
              </div>
              {data.weightChange && weightChangePercentage && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  data.weightChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {data.weightChange > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {weightChangePercentage > 0 ? '+' : ''}
                    {weightChangePercentage.toFixed(1)}% 
                    ({data.weightChange > 0 ? '+' : ''}
                    {formatWeight(data.weightChange)} kg)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Average Calories Card */}
        {data.avgCalories && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-orange-600" />
              <div className="text-sm font-medium text-orange-900">Daily Average</div>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {Math.round(data.avgCalories).toLocaleString()} kcal
            </div>
          </div>
        )}

        {/* Average Steps Card */}
        {data.avgSteps && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-150">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div className="text-sm font-medium text-green-900">Daily Steps</div>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {Math.round(data.avgSteps).toLocaleString()}
            </div>
          </div>
        )}

        {/* Weekly Balance Card */}
        {data.totalBalance !== 0 && (
          <div className={`col-span-2 bg-gradient-to-br ${
            data.totalBalance > 0 
              ? 'from-orange-50 to-red-50 border-orange-100' 
              : 'from-green-50 to-emerald-50 border-green-150'
          } rounded-xl p-4 border text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {data.totalBalance > 0 ? (
                <TrendingUp className="h-4 w-4 text-orange-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <div className={`text-sm font-medium ${
                data.totalBalance > 0 ? 'text-orange-900' : 'text-green-900'
              }`}>
                Weekly Caloric Balance
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`text-2xl font-bold ${
                data.totalBalance > 0 ? 'text-orange-900' : 'text-green-900'
              }`}>
                {data.totalBalance > 0 ? '+' : ''}
                {Math.round(data.totalBalance).toLocaleString()} kcal
              </div>
              <div className={`text-sm mt-1 ${
                data.totalBalance > 0 ? 'text-orange-700' : 'text-green-700'
              }`}>
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