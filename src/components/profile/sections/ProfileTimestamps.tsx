import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileTimestampsProps {
  createdAt: Date;
  updatedAt: Date;
}

export function ProfileTimestamps({ createdAt, updatedAt }: ProfileTimestampsProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-md">
          <Clock className="h-5 w-5 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-500 to-gray-600 text-transparent bg-clip-text">
          Profile Timeline
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100/50"
        >
          <div className="text-sm font-medium text-gray-500">Created</div>
          <div className="text-lg font-semibold text-gray-700 mt-1">
            {formatDate(createdAt)}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-100/50"
        >
          <div className="text-sm font-medium text-gray-500">Last Updated</div>
          <div className="text-lg font-semibold text-gray-700 mt-1">
            {formatDate(updatedAt)}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}