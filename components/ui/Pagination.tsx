"use client";

import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading?: boolean;
  // Link mode dung cho Server Component, vi du product page build href tu search params.
  nextHref?: string;
  // Callback mode giu cho cac Client Component nhu users page.
  onPageChange?: (page: number) => void;
  itemLabel?: string;
  previousHref?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  isLoading = false,
  nextHref,
  onPageChange,
  itemLabel = "items",
  previousHref,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  // Disable nut khi dang loading hoac da o dau/cuoi danh sach.
  const canGoPrev = !isLoading && safeCurrentPage > 1;
  const canGoNext = !isLoading && safeCurrentPage < safeTotalPages;
  const buttonClassName =
    "btn-outline disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <p>
        {`Tong ${totalItems.toLocaleString("vi-VN")} ${itemLabel} | Trang ${safeCurrentPage}/${safeTotalPages}`}
      </p>

      <div className="flex items-center gap-2">
        {previousHref && canGoPrev ? (
          <Link className="btn-outline" href={previousHref} scroll={false}>
            Prev
          </Link>
        ) : (
          <button
            className={buttonClassName}
            disabled={!canGoPrev || !onPageChange}
            onClick={() => onPageChange?.(safeCurrentPage - 1)}
            type="button"
          >
            Prev
          </button>
        )}
        {nextHref && canGoNext ? (
          <Link className="btn-outline" href={nextHref} scroll={false}>
            Next
          </Link>
        ) : (
          <button
            className={buttonClassName}
            disabled={!canGoNext || !onPageChange}
            onClick={() => onPageChange?.(safeCurrentPage + 1)}
            type="button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
