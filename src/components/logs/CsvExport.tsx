import React from 'react';
import { Download } from 'lucide-react';
import type { DailyLog } from '../../types';

interface CsvExportProps {
  logs: DailyLog[];
  selectedLogs: Set<string>;
}

export function CsvExport({ logs, selectedLogs }: CsvExportProps) {
  const formatDate = (date: string): string => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleExport = () => {
    // Filter selected logs
    const logsToExport = logs.filter(log => selectedLogs.has(log.id));
    
    if (logsToExport.length === 0) {
      alert('Please select logs to export');
      return;
    }

    // Create CSV content
    const csvContent = logsToExport
      .map(log => {
        const date = formatDate(log.date);
        const steps = log.steps || '';
        const calories = log.calories || '';
        const weight = log.weight || '';
        return `${date},${steps},${calories},${weight}`;
      })
      .join('\n');

    const header = 'Date,Steps,Calories,Weight\n';
    const fullContent = header + csvContent;

    // Create and download file
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `weightlossify_logs_${formatDate(new Date().toISOString())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={selectedLogs.size === 0}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4" />
      <span>Export Selected</span>
    </button>
  );
}