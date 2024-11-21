import React from 'react';
import { useLogsStore } from '../stores/logsStore';
import { useUserStore } from '../stores/userStore';
import { WeightAnalytics } from './analytics/WeightAnalytics';
import { CalorieAnalytics } from './analytics/CalorieAnalytics';
import { ActivityAnalytics } from './analytics/ActivityAnalytics';
import { ProgressAnalytics } from './analytics/ProgressAnalytics';
import { PredictiveAnalytics } from './analytics/PredictiveAnalytics';
import { PatternAnalytics } from './analytics/PatternAnalytics';
import { AIAnalytics } from './analytics/AIAnalytics';
import { Brain } from 'lucide-react';

export function Analytics() {
  const { logs } = useLogsStore();
  const { profile } = useUserStore();

  if (!profile || !logs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-md">
          <Brain className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Deep dive into your progress with advanced analytics, trends, and AI-powered insights
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        <AIAnalytics 
          logs={logs} 
          profile={profile}
          weightAnalytics={WeightAnalytics}
          calorieAnalytics={CalorieAnalytics}
          activityAnalytics={ActivityAnalytics}
          progressAnalytics={ProgressAnalytics}
        />
        <WeightAnalytics logs={logs} profile={profile} />
        <CalorieAnalytics logs={logs} profile={profile} />
        <ActivityAnalytics logs={logs} profile={profile} />
        <ProgressAnalytics logs={logs} profile={profile} />
        <PredictiveAnalytics logs={logs} profile={profile} />
        <PatternAnalytics logs={logs} profile={profile} />
      </div>
    </div>
  );
}