import React from "react";

interface ProductTablePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ProductTablePagination({
  totalPages,
  currentPage,
  onPageChange,
}: ProductTablePaginationProps) {
  const getPaginationRange = (
    totalPages: number,
    currentPage: number,
    siblingCount = 1
  ): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSibling > 2;
    const shouldShowRightDots = rightSibling < totalPages - 2;

    const firstPage = 1;
    const lastPage = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const range = [...Array(3 + siblingCount * 2)].map((_, i) => i + 1);
      return [...range, "...", lastPage];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const range = [...Array(3 + siblingCount * 2)].map(
        (_, i) => totalPages - (2 + siblingCount * 2) + i
      );
      return [firstPage, "...", ...range];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const range = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
      );
      return [firstPage, "...", ...range, "...", lastPage];
    }

    return [];
  };

  return (
    <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
      <p className="text-sm text-gray-600">
        Trang {currentPage}/{totalPages}
      </p>
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-50 text-blue-600 disabled:opacity-50"
        >
          &lt;
        </button>

        {getPaginationRange(totalPages, currentPage).map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600"
            } ${page === "..." ? "cursor-default opacity-50" : ""}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-50 text-blue-600 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
