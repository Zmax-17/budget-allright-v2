import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import type { PageSize } from "../model/usePagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  pageSize: PageSize;
  pageSizeOptions: readonly PageSize[];
  visiblePages: (number | "...")[];
  hasPrev: boolean;
  hasNext: boolean;

  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;

  onPageSizeChange: (size: PageSize) => void;
  disabled?: boolean;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  pageSize,
  pageSizeOptions,
  visiblePages,
  hasPrev,
  hasNext,
  onPageChange,
  onPrev,
  onNext,
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const showNavigation = totalPages > 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 border-t border-gray-200 dark:border-gray-800">
      {/* Showing info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {startIndex}-{endIndex}{" "}
        </span>
        of{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {totalItems}{" "}
        </span>
        transactions
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={!hasPrev || disabled}
            aria-label="Previous page"
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${focusRing} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <FiChevronLeft size={18} />
          </button>
          {/* Pages buttons */}
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-2 text-gray-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={disabled || page === currentPage}
                aria-current={
                  page === currentPage ? "page" : undefined
                }
                className={`
                  min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${focusRing}
                  ${
                    page === currentPage
                      ? "bg-emerald-600 text-white cursor-default"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                disabled:cursor-not-allowed
                `}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={onNext}
            disabled={!hasNext || disabled}
            aria-label="Next page"
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${focusRing} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Rows per page */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>Rows per page:</span>

        <div
          role="group"
          aria-label="Rows per page"
          className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1 shadow-sm"
        >
          {pageSizeOptions.map((size) => {
            const active = pageSize === size;

            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onPageSizeChange(size)}
                disabled={disabled || active}
                className={`
            min-w-[40px] rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 
            focus-visible:outline-none ${focusRing}
            ${
              active
                ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-700 "
                : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
            }
            disabled:cursor-not-allowed
`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
