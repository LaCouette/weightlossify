import { DailyLog } from '../types';

// Round weight to nearest 0.05
export function roundWeight(weight: number): number {
  return Math.round(weight * 20) / 20;
}

// Format weight for display (always show 2 decimal places)
export function formatWeight(weight: number | null | undefined): string {
  if (typeof weight !== 'number' || isNaN(weight)) return '-';
  return weight.toFixed(2);
}

// Parse weight input, handling both . and , as decimal separators
export function parseWeight(value: string): number | null {
  // Replace comma with period for parsing
  const normalizedValue = value.replace(',', '.');
  const num = parseFloat(normalizedValue);
  
  if (isNaN(num)) return null;
  
  // Round to nearest 0.05
  return roundWeight(num);
}

// Validate weight input
export function validateWeight(value: string): boolean {
  const weight = parseWeight(value);
  if (weight === null) return false;
  
  // Check if it's a valid number with max 2 decimal places
  const decimalPlaces = value.includes('.') ? value.split('.')[1].length : 0;
  return decimalPlaces <= 2;
}

// Get step value for weight inputs
export const WEIGHT_STEP = 0.05;

// Format weight for CSV export
export function formatWeightForExport(weight: number | null | undefined): string {
  if (typeof weight !== 'number' || isNaN(weight)) return '';
  return weight.toFixed(2);
}

// Parse weight from CSV import
export function parseWeightFromCSV(value: string): number | null {
  const weight = parseWeight(value);
  return weight !== null ? roundWeight(weight) : null;
}

// Get weight change between two values
export function getWeightChange(current: number, previous: number): string {
  const change = roundWeight(current - previous);
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

// Get latest weight from logs
export function getLatestWeight(logs: DailyLog[]): number | null {
  const weightLogs = logs.filter(log => typeof log.weight === 'number');
  if (weightLogs.length === 0) return null;
  
  return roundWeight(weightLogs[0].weight!);
}