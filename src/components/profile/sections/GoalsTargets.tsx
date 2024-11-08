import React, { useState } from 'react';
import { Target, Scale, Dumbbell, BarChart, Edit2 } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { GoalChangeWizard } from './goalWizard/GoalChangeWizard';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalsTargetsProps {
  profile: UserProfile;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEdit: () => void;
}

export function GoalsTargets({ profile, isEditing, onChange, onEdit }: GoalsTargetsProps) {
  const [showWizard, setShowWizard] = useState(false);

  const handleWizardComplete = (updatedProfile: Partial<UserProfile>) => {
    Object.entries(updatedProfile).forEach(([key, value]) => {
      onChange({
        target: { name: key, value: value?.toString() || '' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    setShowWizard(false);
  };

  const getGoalGradient = () => {
    switch (profile.primaryGoal) {
      case 'weight_loss':
        return 'bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50';
      case 'muscle_gain':
        return 'bg-gradient-to-br from-emerald-50 via-green-100/50 to-teal-50';
      case 'maintenance':
        return 'bg-gradient-to-br from-purple-50 via-purple-100/50 to-pink-50';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100/50';
    }
  };

  const renderCurrentGoal = () => {
    switch (profile.primaryGoal) {
      case 'weight_loss':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${getGoalGradient()} rounded-2xl p-6 shadow-md shadow-blue-100/50 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-xl shadow-md">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
                  Weight Loss Plan
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 shadow-sm">
                <div className="font-semibold text-blue-700">
                  {profile.weeklyWeightGoal === '0.35' ? 'Moderate Loss' : 'Aggressive Loss'}
                </div>
                <p className="text-sm text-blue-500 mt-2">
                  {profile.weeklyWeightGoal === '0.35' 
                    ? '0.35kg per week - Steady, sustainable progress'
                    : '0.6kg per week - Faster results, requires more discipline'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 shadow-sm">
                  <div className="text-sm font-medium text-blue-500">Target Weight</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {profile.targetWeight} kg
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 shadow-sm">
                  <div className="text-sm font-medium text-blue-500">Weight to Lose</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {(profile.currentWeight - (profile.targetWeight || 0)).toFixed(1)} kg
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'muscle_gain':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${getGoalGradient()} rounded-2xl p-6 shadow-md shadow-emerald-100/50 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-200 to-green-300 rounded-xl shadow-md">
                  <Dumbbell className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-transparent bg-clip-text">
                  Muscle Gain Plan
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                <div className="font-semibold text-emerald-700">7.5% Caloric Surplus</div>
                <p className="text-sm text-emerald-500 mt-2">
                  Optimized for maximum muscle growth with minimal fat gain
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                  <div className="text-sm font-medium text-emerald-500">Daily Surplus</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {Math.round(profile.dailyCaloriesTarget * 0.075)} kcal
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                  <div className="text-sm font-medium text-emerald-500">Expected Monthly Gain</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">0.5 - 1 kg</div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'maintenance':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${getGoalGradient()} rounded-2xl p-6 shadow-md shadow-purple-100/50 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-200 to-pink-300 rounded-xl shadow-md">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                  Maintenance Plan
                </h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100/50 shadow-sm">
                <div className="font-semibold text-purple-700">Weight Maintenance</div>
                <p className="text-sm text-purple-500 mt-2">
                  Focus on maintaining your current weight while improving body composition
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100/50 shadow-sm">
                <div className="text-sm text-purple-600">
                  Your daily calorie target is set to maintain your current weight of {profile.currentWeight}kg
                  while supporting your activity level and body composition goals.
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-100 to-purple-200 rounded-xl shadow-md">
            <Target className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-transparent bg-clip-text">
            Goals & Targets
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-200 text-violet-700 rounded-lg shadow-md shadow-purple-100/50 transition-all duration-300 hover:shadow-lg"
        >
          <Edit2 className="h-4 w-4" />
          <span>Change Goal</span>
        </motion.button>
      </div>

      {renderCurrentGoal()}

      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowWizard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <GoalChangeWizard
                currentProfile={profile}
                onComplete={handleWizardComplete}
                onCancel={() => setShowWizard(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}