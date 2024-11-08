import React from 'react';

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
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between text-sm text-gray-500">
        <div>Created: {formatDate(createdAt)}</div>
        <div>Last Updated: {formatDate(updatedAt)}</div>
      </div>
    </div>
  );
}