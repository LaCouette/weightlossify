import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileTimestampsProps {
  createdAt: Date;
  updatedAt: Date;
}

export function ProfileTimestamps({ createdAt, updatedAt }: ProfileTimestampsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Clock className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="section-title text-shadow">Profile Timeline</h2>
        <p className="section-description">
          Track when your profile was created and last updated
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="metric-card"
        >
          <div className="metric-header">
            <div className="metric-icon">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="metric-title">Created</span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(createdAt)}
            </div>
            <div className="h-1 w-16 bg-indigo-500 rounded-full mt-2" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="metric-card"
        >
          <div className="metric-header">
            <div className="metric-icon">
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="metric-title">Last Updated</span>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(updatedAt)}
            </div>
            <div className="h-1 w-16 bg-indigo-500 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}