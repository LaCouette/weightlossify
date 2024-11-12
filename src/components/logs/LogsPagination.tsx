import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LogsPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function LogsPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
}: LogsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-gray-50">
      <div className="mb-4 sm:mb-0">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
          <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div className="flex justify-between sm:justify-end items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Previous</span>
        </button>
        
        <div className="hidden sm:flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isCurrentPage = currentPage === page;
            const showPage = page === 1 || 
                           page === totalPages || 
                           Math.abs(currentPage - page) <= 1;

            if (!showPage) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-3 py-2 border border-gray-300 bg-white text-gray-500">...</span>;
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  isCurrentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only sm:not-sr-only sm:mr-2">Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}