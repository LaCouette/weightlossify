import React from 'react';
import { Calculator } from 'lucide-react';

interface MaintenanceInfoProps {
  baseMaintenance: number;
  neat: number;
  totalMaintenance: number;
}

export function MaintenanceInfo({ baseMaintenance, neat, totalMaintenance }: MaintenanceInfoProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-indigo-800">Your Maintenance Calories</div>
        <div className="text-3xl font-bold text-indigo-900">{Math.round(totalMaintenance)}</div>
        <div className="text-sm text-indigo-700">
          Base: {Math.round(baseMaintenance)} + Activity: {Math.round(neat)}
        </div>
      </div>
    </div>
  );
}