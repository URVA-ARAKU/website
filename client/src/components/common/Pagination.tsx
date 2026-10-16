import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 my-6 font-sans">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition shadow-2xs ${
            page === currentPage
              ? 'bg-[#8B5A2B] text-[#FAF8F4] border border-[#5A3825]'
              : 'bg-[#FAF8F4] text-[#5A3825] border border-[#E2D9CC] hover:bg-[#F4F1EA]'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;

