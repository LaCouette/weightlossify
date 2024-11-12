import React from 'react';
import { Activity, Scale, Heart, TrendingUp, ArrowUpDown } from 'lucide-react';
import type { UserProfile } from '../../../types';
import { calculateBMI, calculateBMR, getBMICategory } from '../../../utils/calculations';
import { motion } from 'framer-motion';
import { useWeightStore } from '../../../stores/weightStore';
import { useLogsStore } from '../../../stores/logsStore';

interface CalculatedMetricsProps {
  profile: UserProfile;
}

const CalculatedMetrics: React.FC<CalculatedMetricsProps> = ({ profile }) => {
  const currentWeight = useWeightStore(state => state.currentWeight) || profile.currentWeight;
  const { logs } = useLogsStore();

  // Calculate BMI and BMR
  const bmi = calculateBMI(currentWeight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(
    currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.bodyFat
  );

  // Calculate weight fluctuation for maintenance/muscle gain
  const getWeightFluctuation = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLogs = logs
      .filter(log => new Date(log.date) >= thirtyDaysAgo && log.weight)
      .map(log => log.weight!)
      .sort((a, b) => a - b);

    if (recentLogs.length < 2) return null;

    const minWeight = recentLogs[0];
    const maxWeight = recentLogs[recentLogs.length - 1];
    return maxWeight - minWeight;
  };

  const weightFluctuation = getWeightFluctuation();

  const getBmiColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'bg-blue-500';
      case 'Normal Weight':
        return 'bg-green-500';
      case 'Overweight':
        return 'bg-yellow-500';
      case 'Obese':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Define metrics based on goal and target weight
  const getThirdMetric = () => {
    const isWeightLossGoal = profile.primaryGoal === 'weight_loss';
    const isCustomPlan = !profile.weeklyWeightGoal && profile.primaryGoal !== 'maintenance';
    const isCustomWeightLoss = isCustomPlan && (profile.dailyCaloriesTarget < (bmr * 1.1)); // Check if in deficit

    // Show weight to goal if:
    // 1. Guided weight loss plan OR
    // 2. Custom plan in deficit with target weight set
    if ((isWeightLossGoal || (isCustomWeightLoss && profile.targetWeight)) && profile.targetWeight) {
      return {
        icon: TrendingUp,
        label: 'Weight to Goal',
        value: Math.abs(currentWeight - profile.targetWeight).toFixed(1),
        subtext: 'kg remaining',
        indicator: 'bg-indigo-500'
      };
    }

    // Show weight fluctuation for:
    // 1. Maintenance goal
    // 2. Muscle gain goal
    // 3. Custom plan not in deficit
    return {
      icon: ArrowUpDown,
      label: '30-Day Fluctuation',
      value: weightFluctuation ? weightFluctuation.toFixed(1) : '-',
      subtext: weightFluctuation ? 
        `${weightFluctuation <= 1 ? 'Stable' : 'Variable'} weight` : 
        'Insufficient data',
      indicator: weightFluctuation && weightFluctuation <= 1 ? 'bg-green-500' : 'bg-yellow-500'
    };
  };

  const metrics = [
    {
      icon: Scale,
      label: 'BMI',
      value: bmi.toFixed(1),
      subtext: bmiCategory,
      indicator: getBmiColor(bmiCategory)
    },
    {
      icon: Heart,
      label: 'BMR',
      value: Math.round(bmr).toLocaleString(),
      subtext: 'calories/day',
      indicator: 'bg-rose-500'
    },
    getThirdMetric()
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="section-header">
        <div className="section-icon">
          <Activity className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title text-shadow">Calculated Metrics</h2>
        <p className="section-description">
          Key metrics calculated based on your measurements
        </p>
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
              className="metric-card group"
            >
              <div className="metric-header">
                <div className="metric-icon">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="metric-title">{metric.label}</span>
              </div>
              <div className="flex items-end gap-3 mt-4">
                <div className="metric-value group-hover:text-indigo-600 transition-colors">
                  {metric.value}
                </div>
                <div className="h-8 w-1 rounded-full mb-1 opacity-75 transition-all group-hover:h-12 group-hover:opacity-100" 
                  style={{ backgroundColor: `var(--tw-${metric.indicator})` }} 
                />
              </div>
              <div className="metric-subtitle">{metric.subtext}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="info-box mt-8">
        <strong>Note:</strong> These metrics are automatically calculated based on your current measurements 
        and help us determine your optimal targets.
      </div>
    </motion.div>
  );
};

export { CalculatedMetrics };