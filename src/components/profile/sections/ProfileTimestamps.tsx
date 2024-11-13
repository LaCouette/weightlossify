import React from 'react';
import { Clock } from 'lucide-react';

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
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-500 text-center">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Created {formatDate(createdAt)}</span>
        </div>
        <span className="hidden sm:inline px-2">•</span>
        <span>Last updated {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
}