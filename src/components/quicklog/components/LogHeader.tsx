import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LogHeaderProps {
  icon: LucideIcon;
  label: string;
}

export function LogHeader({ icon: Icon, label }: LogHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-5 w-5 text-indigo-600" />
      <h3 className="text-sm font-medium text-gray-900">{label}</h3>
    </div>
  );
}