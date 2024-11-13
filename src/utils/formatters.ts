// Weight formatting utilities
export function formatWeight(weight: number | null | undefined): string {
    if (typeof weight !== 'number' || isNaN(weight)) return '-';
    return weight.toFixed(2);
  }
  
  export function roundWeight(weight: number): number {
    // Round to nearest 0.05
    return Math.round(weight * 20) / 20;
  }
  
  // Input validation for weight
  export function validateWeight(value: string): number | null {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    return roundWeight(num);
  }
  
  // Format date for CSV
  export function formatDateForCsv(date: string): string {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  
  // Parse date from CSV
  export function parseDateFromCsv(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }