import React from 'react';
import { Edit, RefreshCw, Save, User } from 'lucide-react';

interface ProfileHeaderProps {
  isEditing: boolean;
  isResetting: boolean;
  setIsEditing: (value: boolean) => void;
  onRestartSetup: () => void;
  error: string | null;
}

export function ProfileHeader({ 
  isEditing, 
  isResetting, 
  setIsEditing, 
  onRestartSetup,
  error 
}: ProfileHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRestartSetup}
            disabled={isResetting}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{isResetting ? 'Restarting...' : 'Restart Setup'}</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}