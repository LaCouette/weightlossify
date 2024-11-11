import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLogsStore } from '../../stores/logsStore';
import { useWeightStore } from '../../stores/weightStore';

interface CsvImportProps {
  onComplete: () => void;
}

export function CsvImport({ onComplete }: CsvImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { addLog } = useLogsStore();
  const { updateCurrentWeight } = useWeightStore();

  const cleanString = (str: string): string => {
    return str.replace(/^\ufeff/g, '')  // Remove BOM
              .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
              .replace(/^["'](.+)["']$/, '$1') // Remove surrounding quotes
              .trim();
  };

  const parseDate = (dateStr: string): Date => {
    dateStr = cleanString(dateStr);

    // Expect DD/MM/YYYY format
    const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) {
      throw new Error(`Invalid date format: ${dateStr}. Expected format: DD/MM/YYYY`);
    }

    const [_, day, month, year] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateStr}`);
    }

    const parsedDay = parseInt(day);
    const parsedMonth = parseInt(month);
    
    if (parsedMonth < 1 || parsedMonth > 12) {
      throw new Error(`Invalid month: ${parsedMonth}`);
    }
    
    const daysInMonth = new Date(parseInt(year), parsedMonth, 0).getDate();
    if (parsedDay < 1 || parsedDay > daysInMonth) {
      throw new Error(`Invalid day: ${parsedDay} for month: ${parsedMonth}`);
    }

    return date;
  };

  const parseNumber = (value: string): number | undefined => {
    if (!value || !value.trim()) return undefined;
    
    // Clean and normalize the number string
    const cleaned = cleanString(value)
      .replace(/\s/g, '')         // Remove whitespace
      .replace(/["']/g, '')       // Remove quotes
      .replace(/,/g, '.');        // Replace comma with dot for decimal

    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  };

  const parseCsvLine = (line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Double quotes inside quotes = escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current);
    return result;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => cleanString(line));
      
      const firstLine = cleanString(lines[0]);
      const delimiter = firstLine.includes('|') ? '|' : ',';
      const startIndex = firstLine.toLowerCase().includes('date') ? 1 : 0;
      
      let latestWeight: number | null = null;
      let successCount = 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = cleanString(lines[i]);
        if (!line) continue;

        try {
          const [date, steps, calories, weight] = parseCsvLine(line, delimiter);

          const parsedDate = parseDate(date);
          const logEntry = {
            date: parsedDate.toISOString(),
            steps: parseNumber(steps),
            calories: parseNumber(calories),
            weight: parseNumber(weight),
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await addLog(user.uid, logEntry);
          successCount++;

          if (logEntry.weight !== undefined) {
            latestWeight = logEntry.weight;
          }
        } catch (err) {
          console.error(`Error parsing line ${i + 1}:`, line, err);
          throw new Error(`Error in line ${i + 1}: ${err.message}`);
        }
      }

      if (latestWeight !== null) {
        updateCurrentWeight(latestWeight);
      }

      onComplete();
      alert(`Successfully imported ${successCount} logs`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        <span>{isLoading ? 'Importing...' : 'Import CSV'}</span>
      </button>

      {error && (
        <div className="absolute top-full mt-2 w-64 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}