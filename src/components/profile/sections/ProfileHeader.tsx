import React from 'react';
import { RefreshCw, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  isResetting: boolean;
  onRestartSetup: () => void;
  error: string | null;
}

export function ProfileHeader({ isResetting, onRestartSetup, error }: ProfileHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
          <User className="h-6 w-6 text-indigo-600" />
        </div>
        
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestartSetup}
          disabled={isResetting}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Restarting...' : 'Restart Setup Wizard'}</span>
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-3 bg-red-50 border border-red-100 rounded-lg"
          >
            <p className="text-sm text-red-600 text-center">{error}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}