import React from 'react';
import { Activity, Scale, Heart, Target } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { calculateBMI, calculateBMR, getBMICategory } from '../../../utils/calculations';
import { motion } from 'framer-motion';

interface CalculatedMetricsProps {
  profile: UserProfile;
}

export function CalculatedMetrics({ profile }: CalculatedMetricsProps) {
  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(
    profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );

  const metrics = [
    {
      icon: Scale,
      label: 'BMI',
      value: bmi.toFixed(1),
      subtext: bmiCategory,
      gradient: 'from-blue-200 to-indigo-300',
      bgGradient: 'from-blue-50 to-indigo-50',
      textGradient: 'from-blue-500 to-indigo-500',
      borderColor: 'border-blue-100/50'
    },
    {
      icon: Heart,
      label: 'BMR',
      value: Math.round(bmr).toString(),
      subtext: 'calories/day',
      gradient: 'from-rose-200 to-pink-300',
      bgGradient: 'from-rose-50 to-pink-50',
      textGradient: 'from-rose-500 to-pink-500',
      borderColor: 'border-rose-100/50'
    },
    {
      icon: Target,
      label: 'Weight to Goal',
      value: profile.targetWeight 
        ? Math.abs(profile.currentWeight - profile.targetWeight).toFixed(1)
        : '-',
      subtext: 'kg remaining',
      gradient: 'from-violet-200 to-purple-300',
      bgGradient: 'from-violet-50 to-purple-50',
      textGradient: 'from-violet-500 to-purple-500',
      borderColor: 'border-violet-100/50'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl shadow-md">
          <Activity className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Calculated Metrics
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${metric.bgGradient} rounded-xl p-5 border ${metric.borderColor} shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 bg-gradient-to-br ${metric.gradient} rounded-lg shadow-sm`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className={`text-sm font-medium bg-gradient-to-r text-transparent bg-clip-text ${metric.textGradient}`}>
                  {metric.label}
                </span>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r text-transparent bg-clip-text ${metric.textGradient}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{metric.subtext}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}