"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const canGoPrev = !isLoading && safeCurrentPage > 1;
  const canGoNext = !isLoading && safeCurrentPage < safeTotalPages;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <p>
        {`Tong ${totalItems.toLocaleString("vi-VN")} ${itemLabel} | Trang ${safeCurrentPage}/${safeTotalPages}`}
      </p>

      <div className="flex items-center gap-2">
        <button
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGoPrev}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          type="button"
        >
          Prev
        </button>
        <button
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGoNext}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
