import React from 'react';
import { Scale, Ruler, User, Calendar } from 'lucide-react';

interface MetadataFormProps {
  metadata: {
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
  };
  onChange: (metadata: any) => void;
}

export function MetadataForm({ metadata, onChange }: MetadataFormProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Physical Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Ruler className="h-4 w-4 text-indigo-600" />
            Height (cm)
          </label>
          <input
            type="number"
            value={metadata.height || ''}
            onChange={(e) => onChange({ ...metadata, height: Number(e.target.value) })}
            min="140"
            max="220"
            step="1"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Scale className="h-4 w-4 text-indigo-600" />
            Weight (kg)
          </label>
          <input
            type="number"
            value={metadata.weight || ''}
            onChange={(e) => onChange({ ...metadata, weight: Number(e.target.value) })}
            min="40"
            max="200"
            step="0.1"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Age
          </label>
          <input
            type="number"
            value={metadata.age || ''}
            onChange={(e) => onChange({ ...metadata, age: Number(e.target.value) })}
            min="18"
            max="100"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 text-indigo-600" />
            Gender
          </label>
          <select
            value={metadata.gender}
            onChange={(e) => onChange({ ...metadata, gender: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
    </div>
  );
}