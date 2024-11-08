import React from 'react';
import { Ruler, Scale, Activity, Percent } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { SectionActions } from './SectionActions';
import { motion } from 'framer-motion';

interface PhysicalMeasurementsProps {
  profile: UserProfile;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function PhysicalMeasurements({
  profile,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  onEdit
}: PhysicalMeasurementsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-green-200 rounded-xl shadow-md">
            <Ruler className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-transparent bg-clip-text">
            Physical Measurements
          </h2>
        </div>
        <SectionActions
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="h-4 w-4 text-emerald-500" />
            <label className="text-sm font-medium text-emerald-700">Height</label>
          </div>
          <div className="relative">
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={onChange}
              disabled={!isEditing}
              min="140"
              max="220"
              step="0.1"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200 disabled:bg-transparent disabled:border-transparent disabled:text-emerald-600 disabled:text-lg disabled:font-semibold"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-emerald-500">cm</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-emerald-500" />
            <label className="text-sm font-medium text-emerald-700">Current Weight</label>
          </div>
          <div className="relative">
            <input
              type="number"
              name="currentWeight"
              value={profile.currentWeight}
              onChange={onChange}
              disabled={!isEditing}
              min="40"
              max="200"
              step="0.1"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200 disabled:bg-transparent disabled:border-transparent disabled:text-emerald-600 disabled:text-lg disabled:font-semibold"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-emerald-500">kg</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-emerald-500" />
            <label className="text-sm font-medium text-emerald-700">Body Fat Percentage</label>
          </div>
          <div className="relative">
            <input
              type="number"
              name="bodyFat"
              value={profile.bodyFat}
              onChange={onChange}
              disabled={!isEditing}
              min="3"
              max="50"
              step="0.1"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200 disabled:bg-transparent disabled:border-transparent disabled:text-emerald-600 disabled:text-lg disabled:font-semibold"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-emerald-500">%</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <label className="text-sm font-medium text-emerald-700">Activity Level</label>
          </div>
          <select
            name="activityLevel"
            value={profile.activityLevel}
            onChange={onChange}
            disabled={!isEditing}
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-emerald-100 focus:border-emerald-300 focus:ring-emerald-200 disabled:bg-transparent disabled:border-transparent disabled:text-emerald-600 disabled:text-lg disabled:font-semibold"
          >
            <option value="light">Light (1-2 workouts/week)</option>
            <option value="gym_bro">Gym Bro (3-5 workouts/week)</option>
            <option value="gym_rat">Gym Rat (6+ workouts/week)</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
}