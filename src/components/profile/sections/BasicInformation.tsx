import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { UserProfile } from '../../../types/profile';
import { SectionActions } from './SectionActions';
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
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl shadow-md">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
            Basic Information
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
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100/50 shadow-sm"
        >
          <label className="block text-sm font-medium text-blue-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={onChange}
            disabled={!isEditing}
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-blue-100 focus:border-blue-300 focus:ring-blue-200 disabled:bg-transparent disabled:border-transparent disabled:text-blue-600 disabled:text-lg disabled:font-semibold"
          />
        </motion.div>

        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100/50 shadow-sm"
        >
          <label className="block text-sm font-medium text-blue-700 mb-2">Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={onChange}
            disabled={!isEditing}
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-blue-100 focus:border-blue-300 focus:ring-blue-200 disabled:bg-transparent disabled:border-transparent disabled:text-blue-600 disabled:text-lg disabled:font-semibold"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </motion.div>

        <motion.div 
          whileHover={{ scale: isEditing ? 1.02 : 1 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100/50 shadow-sm"
        >
          <label className="block text-sm font-medium text-blue-700 mb-2">Age</label>
          <div className="relative">
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={onChange}
              disabled={!isEditing}
              min="13"
              max="120"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg border-blue-100 focus:border-blue-300 focus:ring-blue-200 disabled:bg-transparent disabled:border-transparent disabled:text-blue-600 disabled:text-lg disabled:font-semibold"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-blue-500">years</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}