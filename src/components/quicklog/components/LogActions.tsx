import React from 'react';

interface LogActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
}

export function LogActions({ isEditing, isLoading, onCancel }: LogActionsProps) {
  return (
    <div className="flex gap-2 mt-3">
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Log'}
      </button>
    </div>
  );
}