import React from 'react';
import { Target, Activity, Scale } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { motion } from 'framer-motion';

interface DailyTargetsProps {
  profile: UserProfile;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function DailyTargets({
  profile,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  onEdit
}: DailyTargetsProps) {
  // Calculate calorie adjustment based on goal
  const getCalorieAdjustment = () => {
    if (profile.primaryGoal === 'muscle_gain') {
      return `+${Math.round(profile.dailyCaloriesTarget * 0.075)} kcal surplus`;
    }
    if (profile.primaryGoal === 'weight_loss') {
      const deficit = profile.weeklyWeightGoal === '0.35' ? 350 : 600;
      return `-${deficit} kcal deficit`;
    }
    return 'maintenance';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-200 rounded-xl shadow-md">
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
            Daily Targets
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-orange-500" />
            <div className="text-sm font-medium text-orange-700">Daily Steps Goal</div>
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {profile.dailyStepsGoal?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-orange-500 mt-2">steps per day</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-orange-500" />
            <div className="text-sm font-medium text-orange-700">Daily Calories Target</div>
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {profile.dailyCaloriesTarget?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-orange-500 mt-2">calories per day</div>
          <div className="text-sm font-medium text-orange-600 mt-2">
            ({getCalorieAdjustment()})
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100/50"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100/50 rounded-lg">
            <Target className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-sm text-orange-700">
            <strong>Note:</strong> These targets are calculated based on your goals, activity level, and current metrics. 
            Adjust them if needed based on your progress and energy levels.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}