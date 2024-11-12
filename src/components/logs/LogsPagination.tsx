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
    <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
        <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      
      <div className="flex justify-center sm:justify-end">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:flex">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isCurrentPage = currentPage === page;
              const isFirstPage = page === 1;
              const isLastPage = page === totalPages;
              const isWithinRange = Math.abs(currentPage - page) <= 1;
              
              if (!isWithinRange && !isFirstPage && !isLastPage) {
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  );
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
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}