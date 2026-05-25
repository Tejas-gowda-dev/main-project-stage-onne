import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 font-mono text-[11px] text-gray-400">
      <div>
        Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
      </div>
      <div className="flex gap-1.5 justify-end">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 cursor-pointer disabled:cursor-not-allowed transition-colors font-sans"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const pg = i + 1;
          const isCurrent = pg === currentPage;
          return (
            <button
              key={pg}
              type="button"
              onClick={() => onPageChange(pg)}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer font-sans text-[11px] ${
                isCurrent 
                  ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-400 font-bold' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {pg}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 cursor-pointer disabled:cursor-not-allowed transition-colors font-sans"
        >
          Next
        </button>
      </div>
    </div>
  );
}
