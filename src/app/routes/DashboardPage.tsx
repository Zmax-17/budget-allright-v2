import { useMonth } from "@/context/MonthContext";
import { BarItem } from "@/entities/dashboard/ui-types";
import BarChartBlock from "@/features/charts/BarChartBlock";
import LineChartBlock from "@/features/charts/LineChartBlock";
import PieChartCategoryWithdraw from "@/features/charts/PieChartCategoryWithdraw";
import SubCatBarChartBlock from "@/features/charts/SubCatBarChartBlock";
import { useDashboardData } from "@/features/dashboard/model/useDashboardData";

import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import SortControls from "@/shared/ui/SortControls";
import { useState } from "react";
import toast from "react-hot-toast";
import MonthPicker from "@/shared/ui/MonthPicker";
import { SortConfig } from "@/entities/dashboard/types";
import BalanceCards from "@/features/dashboard/ui/BalanceCards";
import EmptyState from "@/shared/ui/EmptyState";
import { FaWallet } from "react-icons/fa";
import AddTransactionButton from "@/features/transactions/ui/AddTransactionButton";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { selectedMonth, setSelectedMonth } = useMonth();

  const [selectedCategory, setSelectedCategory] = useState<
    string | null
  >(null);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const {
    isLoading,
    error,

    // Finance
    balance,
    monthlyIncome,
    monthlyWithdraw,
    monthlyTransactions,

    // Charts
    pieData,
    lineData,

    // Sorts
    sortBarData,

    // Subcategory
    getBarDataBySubCategory,

    // Month
    minMonth,
    maxMonth,
  } = useDashboardData(selectedMonth);

  const sortedData: BarItem[] = sortBarData(
    sortConfig.key,
    sortConfig.direction,
  );

  if (isLoading)
    return (
      <LoadingSpinner message="Dashboard loading..." />
    );

  if (error) {
    toast.error(error?.message ?? "Unknown error");
    return (
      <div className="text-red-600 p-4">
        Error loading dashboard
      </div>
    );
  }

  if (monthlyTransactions.length === 0) {
    /**
     * Placeholder for an empty dashboard
     * Shown when the user has no transactions
     */
    return (
      <EmptyState
        icon={
          <FaWallet className="text-5xl text-emerald-500" />
        }
        title="No transactions yet"
        description="Start tracking your finances by adding a transaction."
        action={
          <div className="flex flex-col sm:flex-row gap-4">
            <AddTransactionButton />
            <Link
              to="/transactions"
              title="Go to the list of all transactions"
              className="text-center bg-transparent border border-emerald-500 text-emerald-500 font-bold py-2 px-4 rounded-xl hover:bg-emerald-500 hover:text-white active:translate-y-0.5 transition-colors duration-200"
            >
              Go to Transactions
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="p-4 space-y-6 bg-emerald-50/20 dark:bg-gray-900 dark:text-white min-h-screen">
      <BalanceCards
        balance={balance}
        income={monthlyIncome}
        withdraw={monthlyWithdraw}
        selectedMonth={selectedMonth}
      />
      <div className="w-fit">
        <label
          htmlFor="month"
          className="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
        >
          Select month
        </label>

        <MonthPicker
          value={selectedMonth}
          min={minMonth}
          max={maxMonth}
          onChange={(e) => {
            if (e.target.value !== selectedMonth) {
              setSelectedMonth(e.target.value);
            }
          }}
        />
      </div>

      {/* // If no pieData, don't show the chart */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Spending Category Chart
          </h3>
          <PieChartCategoryWithdraw data={pieData} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Income and expenses by day
        </h3>
        <LineChartBlock data={lineData} />
      </div>

      {/*  Filtering */}
      <SortControls
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Income and Expense Graph by Category
        </h3>
        <BarChartBlock
          data={sortedData}
          onCategoryClick={(categoryName: string) =>
            setSelectedCategory(categoryName)
          }
        />
      </div>

      {selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Expenses by category: {selectedCategory}
          </h3>
          <SubCatBarChartBlock
            data={getBarDataBySubCategory(selectedCategory)}
          />
          <button
            className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-800 dark:hover:text-emerald-300"
            onClick={() => setSelectedCategory(null)}
          >
            Back to all categories
          </button>
        </div>
      )}
    </div>
  );
}
