import React from 'react';
import { User } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { motion } from 'framer-motion';

interface BasicInformationProps {
  profile: UserProfile;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function BasicInformation({
  profile,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  onEdit
}: BasicInformationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="section-header">
        <div className="section-icon">
          <User className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title text-shadow">Basic Information</h2>
        <p className="section-description">
          Your personal details help us personalize your experience
        </p>
      </div>

      <div className="space-y-6">
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={onChange}
            disabled={!isEditing}
            className="input-field"
            placeholder="Enter your full name"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={onChange}
            disabled={!isEditing}
            className="input-field"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Age</label>
          <div className="relative">
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={onChange}
              disabled={!isEditing}
              min="13"
              max="120"
              className="input-field pr-16"
              placeholder="Enter your age"
            />
            <div className="input-addon">
              <span>years</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {!isEditing ? (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit} 
              className="btn btn-secondary"
            >
              Edit Information
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
      </div>
    </motion.div>
  );
}