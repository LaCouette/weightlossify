import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, RefreshCw, Target, Scale, Activity } from 'lucide-react';
import { generateAIInsights, getPersonalizedAdvice } from '../../utils/openai';
import type { DailyLog } from '../../types';
import type { UserProfile } from '../../types/profile';

interface AIAnalyticsProps {
  logs: DailyLog[];
  profile: UserProfile;
  weightAnalytics: any;
  calorieAnalytics: any;
  activityAnalytics: any;
  progressAnalytics: any;
}

export function AIAnalytics({
  logs,
  profile,
  weightAnalytics,
  calorieAnalytics,
  activityAnalytics,
  progressAnalytics
}: AIAnalyticsProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [advice, setAdvice] = useState<Record<string, string>>({});
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyticsData = {
    profile,
    weightAnalytics,
    calorieAnalytics,
    activityAnalytics,
    progressAnalytics,
    recentLogs: logs.slice(-14) // Last 14 days of logs
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const insights = await generateAIInsights(analyticsData);
      setInsights(insights);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdvice = async (area: string) => {
    if (advice[area]) {
      setSelectedArea(area);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const newAdvice = await getPersonalizedAdvice(analyticsData, area);
      setAdvice(prev => ({ ...prev, [area]: newAdvice }));
      setSelectedArea(area);
    } catch (err) {
      setError('Failed to get personalized advice. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
            <Brain className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Analysis</h2>
            <p className="text-sm text-gray-600">Smart insights and personalized recommendations</p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Insights</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Main Insights */}
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-violet-600" />
          <h3 className="font-semibold text-gray-900">AI Generated Insights</h3>
        </div>
        
        {isLoading && !insights ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {insights?.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600">{paragraph}</p>
            ))}
          </div>
        )}
      </div>

      {/* Personalized Advice Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { id: 'weight', icon: Scale, label: 'Weight Management' },
          { id: 'nutrition', icon: Target, label: 'Nutrition' },
          { id: 'activity', icon: Activity, label: 'Physical Activity' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => fetchAdvice(id)}
            className={`p-4 rounded-xl border transition-all ${
              selectedArea === id
                ? 'bg-violet-50 border-violet-200'
                : 'bg-white border-gray-200 hover:border-violet-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${
                selectedArea === id ? 'text-violet-600' : 'text-gray-600'
              }`} />
              <span className={`font-medium ${
                selectedArea === id ? 'text-violet-900' : 'text-gray-900'
              }`}>
                {label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Area Advice */}
      {selectedArea && (
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold text-gray-900">
              Personalized {selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)} Advice
            </h3>
          </div>
          
          {isLoading && !advice[selectedArea] ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {advice[selectedArea]?.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600">{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}