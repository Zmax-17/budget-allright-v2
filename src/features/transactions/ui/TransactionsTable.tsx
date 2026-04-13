import { useState } from "react";
import TransactionRow from "./TransactionRow";
import { useTransactionsByFilter } from "../model/useTransactionsByFilter.ts";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { TransactionFilter } from "@/entities/transaction/types.ts";
import AddTransactionButton from "./AddTransactionButton.tsx";
import EmptyState from "@/shared/ui/EmptyState.tsx";
import { FaWallet } from "react-icons/fa";

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

  // If needed, uncomment lines below and change grid-cols-6 in this table header and TransactionRow
  // {
  //   key: "subCategory",
  //   label: "Sub category",
  //   sortable: false,
  // },
  { key: "options", label: "Options", sortable: false },
] as const;

type SortableColumn =
  (typeof SORTABLE_COLUMNS)[number]["key"];

const FILTER_TYPES = ["all", "income", "withdraw"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

export default function TransactionsTable() {
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    sort: { field: "date", direction: "desc" },
  });

  const setTypeFilter = (type: FilterType) => {
    setFilter((prev) => ({ ...prev, type }));
  };

  const handleSortClick = (column: SortableColumn) => {
    if (column === "amount" || column === "date") {
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
    }
  };

  const { isLoading, error, transactions } =
    useTransactionsByFilter(filter);

  if (isLoading)
    return (
      <LoadingSpinner message="Transaction loading..." />
    );

  if (error)
    return (
      <div className="text-red-600">
        Error: {error.message}
      </div>
    );

  // Extracting data
  const transactionList = transactions ?? [];

  if (transactionList.length === 0) {
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
    <div className="flex flex-col bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200 text-sm">
      {/* HEADER */}
      <header className="shrink-0">
        <div className="max-w-full flex flex-wrap justify-between items-center gap-2 p-1 rounded-lg border border-emerald-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm dark:shadow-lg dark:shadow-black/30">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TYPES.map((type) => {
              const isActive = filter.type === type;
              return (
                <button
                  key={type}
                  disabled={isActive}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 disabled:cursor-not-allowed ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm  dark:bg-emerald-700"
                      : "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1)}
                </button>
              );
            })}
          </div>
          <AddTransactionButton />
        </div>
      </header>

      {/* Table container */}
      <div className="flex-1 min-h-0 flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm dark:shadow-xl dark:shadow-black/40 mt-2">
        {/* Table */}
        <div className="shrink-0">
          <div className="overflow-x-auto">
            <div
              className="
              p-[1.6rem_2.4rem]
              grid grid-cols-5 gap-x-[2.4rem] items-center
             bg-emerald-100 text-emerald-900 border-b border-emerald-200 dark:bg-emerald-950
              uppercase tracking-[0.4px] font-semibold
              dark:text-emerald-100
              text-sm 
            "
            >
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
                    {sortable &&
                      filter.sort?.field === key && (
                        <span>
                          {filter.sort.direction === "asc"
                            ? "↑"
                            : "↓"}
                        </span>
                      )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* BODY of a scrolling table */}
        <section className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-gray-900">
          {transactionList.map((tx) => (
            <div
              key={tx.id}
              className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150"
            >
              <TransactionRow transaction={tx} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
