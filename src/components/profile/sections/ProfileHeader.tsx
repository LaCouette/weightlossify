import React from 'react';
import { RefreshCw, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  isResetting: boolean;
  onRestartSetup: () => void;
  error: string | null;
}

export function ProfileHeader({ 
  isResetting, 
  onRestartSetup,
  error 
}: ProfileHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-xl shadow-md">
            <User className="h-5 w-5 text-indigo-700" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            Profile
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestartSetup}
          disabled={isResetting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-200 text-indigo-700 rounded-lg shadow-md shadow-purple-100/50 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{isResetting ? 'Restarting...' : 'Restart Setup'}</span>
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl shadow-sm"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}