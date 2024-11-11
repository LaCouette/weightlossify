import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLogsStore } from '../stores/logsStore';
import { Edit2, Save, X, Calendar, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { DailyLog } from '../types';

const ITEMS_PER_PAGE = 30;

type SortField = 'date' | 'weight' | 'calories' | 'steps';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function LogsHistory() {
  const { user } = useAuthStore();
  const { logs, fetchLogs, updateLog, deleteLog, bulkDeleteLogs } = useLogsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [editingLog, setEditingLog] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DailyLog>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' });

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

  useEffect(() => {
    if (user?.uid) {
      fetchLogs(user.uid)
        .finally(() => setIsLoading(false));
    }
  }, [user?.uid]);

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

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const handleEdit = (log: DailyLog) => {
    setEditingLog(log.id);
    setEditValues({
      weight: log.weight || undefined,
      calories: log.calories || undefined,
      steps: log.steps || undefined
    });
  };

  const handleSave = async (logId: string) => {
    if (!user?.uid) return;

    try {
      await updateLog(user.uid, logId, editValues);
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
    if (!user?.uid || !window.confirm('Are you sure you want to delete this log? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteLog(user.uid, logId);
    } catch (error) {
      console.error('Failed to delete log:', error);
    }
  };

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

  const toggleLogSelection = (logId: string) => {
    const newSelection = new Set(selectedLogs);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    setSelectedLogs(newSelection);
  };

  const toggleAllSelection = () => {
    if (selectedLogs.size === currentLogs.length) {
      setSelectedLogs(new Set());
    } else {
      setSelectedLogs(new Set(currentLogs.map(log => log.id)));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWeight = (weight: number | undefined): string => {
    if (typeof weight !== 'number') return '-';
    return weight.toFixed(1);
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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Logs History</h1>
        </div>
        {selectedLogs.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedLogs.size})
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={toggleAllSelection}
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    {selectedLogs.size === currentLogs.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    <span>Select All</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    <span>Date</span>
                    {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('weight')}
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    <span>Weight (kg)</span>
                    {getSortIcon('weight')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('calories')}
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    <span>Calories</span>
                    {getSortIcon('calories')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('steps')}
                    className="flex items-center gap-2 hover:text-indigo-600"
                  >
                    <span>Steps</span>
                    {getSortIcon('steps')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-gray-50 ${selectedLogs.has(log.id) ? 'bg-indigo-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleLogSelection(log.id)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      {selectedLogs.has(log.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingLog === log.id ? (
                      <input
                        type="number"
                        value={editValues.weight || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, weight: Number(e.target.value) }))}
                        className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
                        step="0.1"
                      />
                    ) : (
                      formatWeight(log.weight)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingLog === log.id ? (
                      <input
                        type="number"
                        value={editValues.calories || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, calories: Number(e.target.value) }))}
                        className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      log.calories?.toLocaleString() || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingLog === log.id ? (
                      <input
                        type="number"
                        value={editValues.steps || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, steps: Number(e.target.value) }))}
                        className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500"
                      />
                    ) : (
                      log.steps?.toLocaleString() || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingLog === log.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(log.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(log)}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, logs.length)}</span> of{' '}
                  <span className="font-medium">{logs.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}