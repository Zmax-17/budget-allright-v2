import { useState, useMemo, useRef } from "react";
import TransactionRow from "./TransactionRow";
import { useTransactionsByFilter } from "../model/useTransactionsByFilter.ts";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { TransactionFilter } from "@/entities/transaction/types.ts";
import AddTransactionButton from "./AddTransactionButton.tsx";
import EmptyState from "@/shared/ui/EmptyState.tsx";
import { FaWallet } from "react-icons/fa";
import SearchInput from "@/shared/ui/SearchInput.tsx";
import { searchTransactions } from "../lib/searchTransactions.ts";
import { usePagination } from "../model/usePagination";
import Pagination from "./Pagination";
import {
  HiArrowDown,
  HiArrowUp,
  HiMiniArrowsUpDown,
} from "react-icons/hi2";

const SORTABLE_COLUMNS = [
  {
    key: "main_category",
    label: "Main category",
    sortable: false,
  },
  { key: "amount", label: "Amount", sortable: true },
  { key: "date", label: "Date", sortable: true },
  {
    key: "description",
    label: "Description",
    sortable: false,
  },
  { key: "options", label: "Options", sortable: false },
] as const;

type SortableColumn =
  (typeof SORTABLE_COLUMNS)[number]["key"];

const FILTER_TYPES = ["all", "income", "withdraw"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

export default function TransactionsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    sort: { field: "date", direction: "desc" },
  });

  const tableBodyRef = useRef<HTMLElement>(null);

  const scrollTableToTop = () => {
    tableBodyRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  const withScroll = (action: () => void) => {
    action();
    scrollTableToTop();
  };

  const { isLoading, error, transactions } =
    useTransactionsByFilter(filter);

  const visibleTransactions = useMemo(
    () =>
      searchTransactions(transactions ?? [], searchQuery),
    [transactions, searchQuery],
  );

  const {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startIndex,
    endIndex,
    visiblePages,
    pageSizeOptions,
    hasPrev,
    hasNext,
    goToPage,
    prevPage,
    nextPage,
    changePageSize,
    resetPage,
  } = usePagination(visibleTransactions, 10);

  const handleSearchChange = (value: string) => {
    withScroll(() => {
      setSearchQuery(value);
      resetPage();
    });
  };

  const setTypeFilter = (type: FilterType) => {
    withScroll(() => {
      setFilter((prev) => ({ ...prev, type }));
      resetPage();
    });
  };

  const handleSortClick = (column: SortableColumn) => {
    if (column !== "amount" && column !== "date") return;

    withScroll(() => {
      setFilter((prev) => ({
        ...prev,
        sort: {
          field: column,
          direction:
            prev.sort?.field === column &&
            prev.sort?.direction === "desc"
              ? "asc"
              : "desc",
        },
      }));
      resetPage();
    });
  };

  if (isLoading) {
    return (
      <LoadingSpinner message="Transaction loading..." />
    );
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={<FaWallet className="text-emerald-500" />}
        title="No transactions yet"
        description="Click below to add your first transaction."
        action={<AddTransactionButton />}
        className="mt-4"
      />
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 text-sm">
      {/* HEADER */}
      <header className="shrink-0">
        <div className="max-w-full flex flex-wrap justify-between items-center gap-2 p-1 rounded-lg border border-emerald-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-lg dark:shadow-black/30">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {FILTER_TYPES.map((type) => {
              const isActive = filter.type === type;

              return (
                <button
                  key={type}
                  disabled={isActive}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 disabled:cursor-not-allowed ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-700"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <AddTransactionButton />
        </div>
      </header>

      {/* Table container */}
      <div className="flex-1 min-h-0 flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-xl dark:shadow-black/40 mt-2">
        {/* Table header */}
        <div className="shrink-0">
          <div className="overflow-x-auto">
            <div className="p-[1.6rem_2.4rem] grid grid-cols-5 gap-x-[2.4rem] items-center bg-emerald-100 text-emerald-900 border-b border-emerald-200 dark:bg-emerald-950 uppercase tracking-[0.4px] font-semibold dark:text-emerald-100 text-sm">
              {SORTABLE_COLUMNS.map(
                ({ key, label, sortable }) => (
                  <div
                    key={key}
                    className={`flex items-center gap-1 ${
                      sortable
                        ? "cursor-pointer hover:underline"
                        : ""
                    }`}
                    onClick={() =>
                      sortable && handleSortClick(key)
                    }
                  >
                    {label}
                    {sortable && (
                      <span
                        className={`inline-flex items-center ${
                          filter.sort?.field === key
                            ? "text-emerald-700 dark:text-emerald-100"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {filter.sort?.field === key ? (
                          filter.sort.direction ===
                          "asc" ? (
                            <HiArrowUp className="w-3.5 h-3.5" />
                          ) : (
                            <HiArrowDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <HiMiniArrowsUpDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* BODY */}
        <section
          ref={tableBodyRef}
          className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-gray-900"
        >
          {paginatedItems.length > 0 ? (
            paginatedItems.map((tx) => (
              <div
                key={tx.id}
                className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150"
              >
                <TransactionRow transaction={tx} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              No matching transactions found.
            </div>
          )}
        </section>

        {/* Pagination */}
        <div className="shrink-0 select-none">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            visiblePages={visiblePages}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPageChange={(page) =>
              withScroll(() => goToPage(page))
            }
            onPrev={() => withScroll(prevPage)}
            onNext={() => withScroll(nextPage)}
            onPageSizeChange={(size) =>
              withScroll(() => changePageSize(size))
            }
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
