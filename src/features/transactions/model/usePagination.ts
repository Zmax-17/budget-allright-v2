import { useEffect, useMemo, useState } from "react";
import { getVisiblePages } from "../lib/getVisiblePages";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function usePagination<T>(
  items: T[],
  initialPageSize: PageSize = DEFAULT_PAGE_SIZE,
) {
  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] =
    useState<PageSize>(initialPageSize);

  const totalItems = items.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  );

  // Protect against invalid page after data changes
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Keep internal state valid when total pages shrink
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (safeCurrentPage - 1) * pageSize;

  const endIndex = Math.min(
    startIndex + pageSize,
    totalItems,
  );

  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  const visiblePages = useMemo(
    () => getVisiblePages(safeCurrentPage, totalPages),
    [safeCurrentPage, totalPages],
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  const nextPage = () => goToPage(safeCurrentPage + 1);

  const prevPage = () => goToPage(safeCurrentPage - 1);

  const changePageSize = (size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Reset pagination when external data changes
  // (search, filters, sorting)
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    // Items
    paginatedItems,
    totalItems,

    startIndex: totalItems === 0 ? 0 : startIndex + 1,

    endIndex,

    // Pagination
    currentPage: safeCurrentPage,
    totalPages,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    visiblePages,

    // Actions
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    resetPage,

    // Flags
    hasPrev: safeCurrentPage > 1,
    hasNext: safeCurrentPage < totalPages,
  };
}
