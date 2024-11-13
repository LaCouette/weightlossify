import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLogsStore } from '../stores/logsStore';
import type { DailyLog } from '../types';
import { LogsHeader } from './logs/LogsHeader';
import { LogsTableHeader, type SortConfig, type SortField } from './logs/LogsTableHeader';
import { LogRow } from './logs/LogRow';
import { LogsPagination } from './logs/LogsPagination';
import { AlertDialog } from './logs/AlertDialog';
import { roundWeight } from '../utils/weightFormatting';

const ITEMS_PER_PAGE = 30;

export function LogsHistory() {
  const { user } = useAuthStore();
  const { logs, fetchLogs, updateLog, deleteLog, bulkDeleteLogs } = useLogsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DailyLog>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [isAllPagesSelected, setIsAllPagesSelected] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    logId?: string;
  }>({ isOpen: false, type: 'single' });

  const loadLogs = async () => {
    if (user?.uid) {
      setIsLoading(true);
      try {
        await fetchLogs(user.uid);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadLogs();
  }, [user?.uid]);

  const sortLogs = (logsToSort: DailyLog[]): DailyLog[] => {
    return [...logsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortConfig.field) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'weight':
          comparison = (a.weight || 0) - (b.weight || 0);
          break;
        case 'calories':
          comparison = (a.calories || 0) - (b.calories || 0);
          break;
        case 'steps':
          comparison = (a.steps || 0) - (b.steps || 0);
          break;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const sortedLogs = sortLogs(logs);
  const currentLogs = sortedLogs.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: 
        prevConfig.field === field
          ? prevConfig.direction === 'asc'
            ? 'desc'
            : 'asc'
          : 'desc'
    }));
  };

  const handleEdit = (log: DailyLog) => {
    setEditingLog(log.id);
    setEditValues({
      weight: log.weight,
      calories: log.calories,
      steps: log.steps
    });
  };

  const handleSave = async (logId: string) => {
    if (!user?.uid) return;

    try {
      // If weight is present, ensure it's rounded properly
      const updatedValues = {
        ...editValues,
        weight: editValues.weight ? roundWeight(editValues.weight) : editValues.weight
      };

      await updateLog(user.uid, logId, updatedValues);
      setEditingLog(null);
      setEditValues({});
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  };

  const handleCancel = () => {
    setEditingLog(null);
    setEditValues({});
  };

  const handleDelete = async (logId: string) => {
    if (!user?.uid) return;

    try {
      await deleteLog(user.uid, logId);
      setSelectedLogs(new Set([...selectedLogs].filter(id => id !== logId)));
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!user?.uid || selectedLogs.size === 0) return;

    try {
      const logsToDelete = isAllPagesSelected
        ? logs.map(log => log.id)
        : Array.from(selectedLogs);
        
      await bulkDeleteLogs(user.uid, logsToDelete);
      setSelectedLogs(new Set());
      setIsAllPagesSelected(false);
      setDeleteConfirm({ isOpen: false, type: 'bulk' });
    } catch (error) {
      console.error('Failed to delete logs:', error);
    }
  };

  const toggleLogSelection = (logId: string) => {
    setIsAllPagesSelected(false);
    const newSelection = new Set(selectedLogs);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    setSelectedLogs(newSelection);
  };

  const toggleAllSelection = () => {
    setIsAllPagesSelected(false);
    if (selectedLogs.size === currentLogs.length) {
      const newSelection = new Set([...selectedLogs].filter(id => 
        !currentLogs.find(log => log.id === id)
      ));
      setSelectedLogs(newSelection);
    } else {
      const newSelection = new Set([
        ...selectedLogs,
        ...currentLogs.map(log => log.id)
      ]);
      setSelectedLogs(newSelection);
    }
  };

  const toggleSelectAllPages = () => {
    if (isAllPagesSelected) {
      setSelectedLogs(new Set());
      setIsAllPagesSelected(false);
    } else {
      setSelectedLogs(new Set(logs.map(log => log.id)));
      setIsAllPagesSelected(true);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <LogsHeader
        selectedCount={isAllPagesSelected ? logs.length : selectedLogs.size}
        onBulkDelete={() => setDeleteConfirm({ isOpen: true, type: 'bulk' })}
        onImportComplete={loadLogs}
        logs={logs}
        selectedLogs={selectedLogs}
      />

      <div className="mt-4 sm:mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <LogsTableHeader
              sortConfig={sortConfig}
              onSort={handleSort}
              onToggleSelectAll={toggleAllSelection}
              onToggleSelectAllPages={toggleSelectAllPages}
              allSelected={currentLogs.every(log => selectedLogs.has(log.id))}
              someSelected={currentLogs.some(log => selectedLogs.has(log.id))}
              isAllPagesSelected={isAllPagesSelected}
              totalLogs={logs.length}
              selectedCount={selectedLogs.size}
            />
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => (
                <LogRow
                  key={log.id}
                  log={log}
                  isSelected={selectedLogs.has(log.id)}
                  isEditing={editingLog === log.id}
                  editValues={editValues}
                  onToggleSelect={() => toggleLogSelection(log.id)}
                  onEdit={() => handleEdit(log)}
                  onSave={() => handleSave(log.id)}
                  onCancel={handleCancel}
                  onDelete={() => setDeleteConfirm({ isOpen: true, type: 'single', logId: log.id })}
                  onEditValuesChange={setEditValues}
                />
              ))}
            </tbody>
          </table>
        </div>

        <LogsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={logs.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, type: 'single' })}
        onConfirm={() => {
          if (deleteConfirm.type === 'single' && deleteConfirm.logId) {
            handleDelete(deleteConfirm.logId);
          } else {
            handleBulkDelete();
          }
          setDeleteConfirm({ isOpen: false, type: 'single' });
        }}
        title={deleteConfirm.type === 'single' ? 'Delete Log Entry' : 'Delete Selected Logs'}
        description={
          deleteConfirm.type === 'single'
            ? 'Are you sure you want to delete this log entry? This action cannot be undone.'
            : `Are you sure you want to delete ${isAllPagesSelected ? 'all' : selectedLogs.size} selected logs? This action cannot be undone.`
        }
      />
    </div>
  );
}