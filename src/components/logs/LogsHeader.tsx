import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { CsvImport } from './CsvImport';
import { CsvExport } from './CsvExport';
import { ManualLogEntry } from './ManualLogEntry';
import type { DailyLog } from '../../types';

interface LogsHeaderProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onImportComplete: () => void;
  logs: DailyLog[];
  selectedLogs: Set<string>;
}

export function LogsHeader({ 
  selectedCount, 
  onBulkDelete, 
  onImportComplete,
  logs,
  selectedLogs
}: LogsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-indigo-600" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Logs History</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <ManualLogEntry onComplete={onImportComplete} />
        <CsvExport logs={logs} selectedLogs={selectedLogs} />
        <CsvImport onComplete={onImportComplete} />
        
        {selectedCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span> ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
}