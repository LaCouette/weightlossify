import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdditionalDataPromptProps {
  icon: LucideIcon;
  title: string;
  onAdd: () => void;
  onSkip: () => void;
}

export function AdditionalDataPrompt({
  icon: Icon,
  title,
  onAdd,
  onSkip
}: AdditionalDataPromptProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-white p-4 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-indigo-600" />
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-3">
        <button
          onClick={onAdd}
          className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Yes, add details
        </button>
        <button
          onClick={onSkip}
          className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}