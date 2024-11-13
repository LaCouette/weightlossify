import React, { useState } from 'react';
import { Target, Scale, Dumbbell, BarChart, Edit2, Sliders } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { GoalChangeWizard } from './goalWizard/GoalChangeWizard';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBMR, calculateBaseMaintenance, calculateNEAT } from '../../../utils/calorieCalculations';

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

  const getPlanTitle = () => {
    // For custom plans
    if (!profile.weeklyWeightGoal && profile.primaryGoal !== 'maintenance') {
      return 'Your Custom Plan';
    }

    // For guided plans
    switch (profile.primaryGoal) {
      case 'weight_loss':
        return profile.weeklyWeightGoal === '0.35' 
          ? 'Moderate Weight Loss Plan'
          : 'Aggressive Weight Loss Plan';
      case 'muscle_gain':
        return 'Lean Muscle Growth Plan';
      case 'maintenance':
        return 'Weight Maintenance Plan';
      default:
        return 'Your Plan';
    }
  };

  const calculateCalorieChange = () => {
    const bmr = calculateBMR(
      profile.currentWeight,
      profile.height,
      profile.age,
      profile.gender,
      profile.bodyFat
    );
    const baseMaintenance = calculateBaseMaintenance(bmr);
    const neat = calculateNEAT(profile.dailyStepsGoal);
    const maintenance = baseMaintenance + neat;
    return profile.dailyCaloriesTarget - maintenance;
  };

  const getMonthlyChange = () => {
    const dailyChange = calculateCalorieChange();
    const monthlyChange = (dailyChange * 30) / 7700; // kg per month
    return monthlyChange;
  };

  const isCustomPlan = () => {
    const calorieChange = calculateCalorieChange();
    // Check if the calorie change doesn't match the standard plans
    if (profile.primaryGoal === 'weight_loss') {
      return Math.abs(calorieChange + 350) > 50 && Math.abs(calorieChange + 600) > 50;
    }
    if (profile.primaryGoal === 'muscle_gain') {
      const expectedSurplus = Math.round(profile.dailyCaloriesTarget * 0.075);
      return Math.abs(calorieChange - expectedSurplus) > 50;
    }
    if (profile.primaryGoal === 'maintenance') {
      return Math.abs(calorieChange) > 100;
    }
    return false;
  };

  const renderCustomPlan = () => {
    const calorieChange = calculateCalorieChange();
    const monthlyChange = getMonthlyChange();
    const isDeficit = calorieChange < -100;
    const isSurplus = calorieChange > 100;

    return (
      <div className="space-y-6">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">
              <Sliders className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="metric-title">Your Custom Plan</span>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Daily Target</span>
              <span className={`text-lg font-semibold ${
                isDeficit ? 'text-red-600' : 
                isSurplus ? 'text-green-600' : 
                'text-indigo-600'
              }`}>
                {isDeficit ? '-' : isSurplus ? '+' : ''}
                {Math.abs(Math.round(calorieChange))} kcal/day
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Expected Monthly Change</span>
              <span className={`text-lg font-semibold ${
                isDeficit ? 'text-red-600' : 
                isSurplus ? 'text-green-600' : 
                'text-indigo-600'
              }`}>
                {Math.abs(monthlyChange).toFixed(1)} kg {monthlyChange > 0 ? 'gain' : 'loss'}
              </span>
            </div>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">
                {calorieChange > 300 && 'Aggressive bulk phase'}
                {calorieChange > 100 && calorieChange <= 300 && 'Lean gaining phase'}
                {calorieChange < -500 && 'Aggressive cut phase'}
                {calorieChange < -100 && calorieChange >= -500 && 'Moderate fat loss phase'}
                {Math.abs(calorieChange) <= 100 && 'Maintenance phase'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoalContent = () => {
    // Check if this is a custom plan
    if (isCustomPlan()) {
      return renderCustomPlan();
    }

    switch (profile.primaryGoal) {
      case 'weight_loss':
        return (
          <div className="space-y-6">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <Scale className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="metric-title">{getPlanTitle()}</span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Weekly Goal</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {profile.weeklyWeightGoal === '0.35' ? '0.35kg' : '0.6kg'} per week
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Target Weight</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {profile.targetWeight}kg
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-value"
                    style={{ 
                      width: `${Math.min(((profile.currentWeight - profile.targetWeight!) / profile.currentWeight) * 100, 100)}%` 
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {(profile.currentWeight - profile.targetWeight!).toFixed(1)}kg to lose
                </div>
              </div>
            </div>
          </div>
        );

      case 'muscle_gain':
        return (
          <div className="space-y-6">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <Dumbbell className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="metric-title">{getPlanTitle()}</span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Caloric Surplus</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    +{Math.round(profile.dailyCaloriesTarget * 0.075)} kcal/day
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Expected Monthly Gain</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    0.5 - 1 kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon">
                  <BarChart className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="metric-title">{getPlanTitle()}</span>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Current Weight</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {profile.currentWeight}kg
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Target Range</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    ±1kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="section-header">
        <div className="section-icon">
          <Target className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title text-shadow">Goals & Targets</h2>
        <p className="section-description">
          Your fitness goals and progress tracking
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowWizard(true)}
          className="btn btn-primary"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Change Goal
        </motion.button>
      </div>

      {renderGoalContent()}

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
    </motion.div>
  );
}