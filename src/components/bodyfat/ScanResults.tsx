import React, { useState } from 'react';
import { X, Activity, Scale, TrendingDown, TrendingUp, Target, Dumbbell, Brain, AlertTriangle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBodyCompositionInsights } from './utils/analysisHelpers';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useLogsStore } from '../../stores/logsStore';

interface ScanResultsProps {
  bodyFat: {
    min: number;
    max: number;
  };
  metadata: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
  };
  onClose: () => void;
}

export function ScanResults({ bodyFat, metadata, onClose }: ScanResultsProps) {
  const { user } = useAuthStore();
  const { updateProfile } = useUserStore();
  const { logs, updateLog, addLog } = useLogsStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const avgBodyFat = (bodyFat.min + bodyFat.max) / 2;
  const { category, insights, recommendations } = getBodyCompositionInsights(avgBodyFat, metadata);
  const leanMass = metadata.weight * (1 - avgBodyFat / 100);
  const fatMass = metadata.weight * (avgBodyFat / 100);

  const handleAcceptResults = async () => {
    if (!user?.uid) return;

    setIsUpdating(true);
    try {
      // Update user profile
      await updateProfile(user.uid, {
        bodyFat: avgBodyFat,
        updatedAt: new Date()
      });

      // Update or create today's log
      const today = new Date();
      const todayLog = logs.find(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === today.toDateString();
      });

      if (todayLog) {
        await updateLog(user.uid, todayLog.id, {
          ...todayLog,
          bodyFat: avgBodyFat,
          updatedAt: new Date()
        });
      } else {
        await addLog(user.uid, {
          date: today.toISOString(),
          bodyFat: avgBodyFat,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      setUpdateSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating body fat:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-md mb-4">
          <Activity className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
      </div>

      {/* Accuracy Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">Accuracy Disclaimer</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This AI-powered analysis provides an estimate with approximately 90% accuracy compared to DEXA scans. 
              While useful for tracking progress, it should not replace medical-grade body composition analysis. 
              For medical decisions, please consult healthcare professionals and use DEXA scans or other clinical methods.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Main Results Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">
              {bodyFat.min.toFixed(1)}-{bodyFat.max.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Estimated Body Fat Range</div>
            <div className={`text-sm font-medium mt-2 ${category.color}`}>
              {category.label} Range
            </div>
            <button
              onClick={handleAcceptResults}
              disabled={isUpdating || updateSuccess}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                updateSuccess
                  ? 'bg-green-100 text-green-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              <span className="flex items-center justify-center gap-2">
                {updateSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    Updated Successfully
                  </>
                ) : (
                  <>
                    {isUpdating ? 'Updating...' : 'Accept & Update Profile'}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Body Composition Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Estimated Lean Mass</div>
              <div className="text-2xl font-bold text-indigo-600">
                {leanMass.toFixed(1)} kg
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Estimated Fat Mass</div>
              <div className="text-2xl font-bold text-indigo-600">
                {fatMass.toFixed(1)} kg
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-6 border border-violet-100 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-violet-600" />
          <h3 className="font-medium text-gray-900">AI Analysis Insights</h3>
        </div>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="bg-white/50 rounded-lg p-4 border border-violet-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${insight.color}`} />
                <span className="font-medium text-gray-900">{insight.area}</span>
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Steps */}
      <div className="space-y-6">
        <h3 className="font-medium text-gray-900">Recommended Action Steps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Training Recommendations */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Training Focus</span>
            </div>
            <ul className="space-y-2">
              {recommendations.training.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    {index + 1}.
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition Recommendations */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Nutrition Focus</span>
            </div>
            <ul className="space-y-2">
              {recommendations.nutrition.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    {index + 1}.
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Goals Section */}
          <div className="sm:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-gray-900">Suggested Goals</span>
            </div>
            <ul className="space-y-2">
              {recommendations.goals.map((goal, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    {index + 1}.
                  </div>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}