import React from 'react';
import { Ruler, Scale, Activity, Percent } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
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
      className="card"
    >
      <div className="section-header">
        <div className="section-icon">
          <Scale className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title text-shadow">Physical Measurements</h2>
        <p className="section-description">
          Your physical stats help us calculate accurate targets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="input-group">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="h-4 w-4 text-indigo-500" />
            <label className="input-label">Height</label>
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
              className="input-field pr-16"
              placeholder="Enter your height"
            />
            <div className="input-addon">
              <span>cm</span>
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="h-4 w-4 text-indigo-500" />
            <label className="input-label">Current Weight</label>
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
              className="input-field pr-16"
              placeholder="Enter your weight"
            />
            <div className="input-addon">
              <span>kg</span>
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-indigo-500" />
            <label className="input-label">Body Fat Percentage</label>
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
              className="input-field pr-16"
              placeholder="Enter your body fat %"
            />
            <div className="input-addon">
              <span>%</span>
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            <label className="input-label">Activity Level</label>
          </div>
          <select
            name="activityLevel"
            value={profile.activityLevel}
            onChange={onChange}
            disabled={!isEditing}
            className="input-field"
          >
            <option value="light">Light (1-2 workouts/week)</option>
            <option value="gym_bro">Moderate (3-5 workouts/week)</option>
            <option value="gym_rat">Intense (6+ workouts/week)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        {!isEditing ? (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEdit} 
            className="btn btn-secondary"
          >
            Edit Measurements
          </motion.button>
        ) : (
          <>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel} 
              disabled={isLoading}
              className="btn btn-secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSave}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}