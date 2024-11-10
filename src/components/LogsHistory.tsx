import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useLogsStore } from '../../stores/logsStore';
import { LogsHeader } from './LogsHeader';
import { LogsTable } from './LogsTable';
import { LogsPagination } from './LogsPagination';
import { useSortLogs } from '../../hooks/useSortLogs';
import type { DailyLog } from '../../types';

const ITEMS_PER_PAGE = 30;

export function LogsHistory() {
  const { user } = useAuthStore();
  const { logs, fetchLogs, bulkDeleteLogs } = useLogsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const { sortedLogs, sortConfig, handleSort } = useSortLogs(logs);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = sortedLogs.slice(startIndex, endIndex);

  useEffect(() => {
    if (user?.uid) {
      fetchLogs(user.uid)
        .finally(() => setIsLoading(false));
    }
  }, [user?.uid]);

  const handleBulkDelete = async () => {
    if (!user?.uid || selectedLogs.size === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedLogs.size} selected logs? This action cannot be undone.`)) {
      return;
    }

    try {
      await bulkDeleteLogs(user.uid, Array.from(selectedLogs));
      setSelectedLogs(new Set());
    } catch (error) {
      console.error('Failed to delete logs:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LogsHeader
        selectedCount={selectedLogs.size}
        onBulkDelete={handleBulkDelete}
      />

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <LogsTable
          logs={currentLogs}
          selectedLogs={selectedLogs}
          setSelectedLogs={setSelectedLogs}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {totalPages > 1 && (
          <LogsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={logs.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}