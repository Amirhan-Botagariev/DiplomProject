import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    const maxAround = 2;

    const start = Math.max(currentPage - maxAround, 2);
    const end = Math.min(currentPage + maxAround, totalPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6 space-x-2 items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Always show page 1 */}
      <button
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded border hover:bg-blue-100 ${
          currentPage === 1 ? 'bg-blue-500 text-white font-semibold' : 'bg-white'
        }`}
      >
        1
      </button>

      {/* Dots if necessary */}
      {currentPage > 4 && <span className="px-2">...</span>}

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border hover:bg-blue-100 ${
            currentPage === page ? 'bg-blue-500 text-white font-semibold' : 'bg-white'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Dots before last */}
      {currentPage < totalPages - 3 && <span className="px-2">...</span>}

      {/* Always show last page */}
      {totalPages > 1 && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded border hover:bg-blue-100 ${
            currentPage === totalPages ? 'bg-blue-500 text-white font-semibold' : 'bg-white'
          }`}
        >
          {totalPages}
        </button>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded border bg-white disabled:opacity-50 hover:bg-gray-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
