import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LogErrorProps {
  error: string;
}

export function LogError({ error }: LogErrorProps) {
  return (
    <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}