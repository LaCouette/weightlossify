import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogContainerProps {
  children: React.ReactNode;
}

export function LogContainer({ children }: LogContainerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col relative overflow-hidden">
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </div>
  );
}