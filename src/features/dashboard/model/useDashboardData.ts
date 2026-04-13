import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getAllTransactions } from "@/features/transactions/api/apiTransactions";
import { getMonthDateRange } from "@/shared/utils/dataRange";
import { format } from "date-fns";

import { DashboardData } from "@/entities/dashboard/types";
import { Transaction } from "@/entities/transaction/types";
import { PostgrestError } from "@supabase/supabase-js";

import { dashboardKeys } from "./dashboardKeys";
import {
  PieItem,
  SubCategoryItem,
  LineItem,
  BarItem,
} from "@/entities/dashboard/ui-types";

import { getCategoryColor } from "@/features/categories/categories.ts";

export function useDashboardData(
  selectedDate: string,
): DashboardData {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const theme = darkMode ? "dark" : "light";
  const userId = user?.id;

  // 1. Download all user transactions
  const {
    data: allTransactions = [],
    isLoading,
    error,
  } = useQuery<Transaction[], PostgrestError>({
    queryKey: dashboardKeys.byMonth(userId, selectedDate),
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getAllTransactions(userId);
    },
    enabled: !!userId && !!selectedDate,
    placeholderData: keepPreviousData,
  });

  const safeTransactions = useMemo(() => {
    return allTransactions
      .filter((t) => t.date) // remove completely broken records
      .map((t) => ({
        ...t,
        amount: t.amount ?? 0,
        main_category: t.main_category ?? "Uncategorized",
        sub_category: t.sub_category ?? "Uncategorized",
      }));
  }, [allTransactions]);

  // 2. Filter by selected month
  const { fromDate, toDate } =
    getMonthDateRange(selectedDate);

  const monthlyTransactions = useMemo(() => {
    return safeTransactions.filter(
      (t) => t.date >= fromDate && t.date <= toDate,
    );
  }, [safeTransactions, fromDate, toDate]);

  // 3. Basic calculations
  const balance = useMemo(() => {
    return safeTransactions.reduce<number>((acc, t) => {
      return t.type === "income"
        ? acc + t.amount
        : acc - t.amount;
    }, 0);
  }, [safeTransactions]);

  const monthlyIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce<number>((acc, t) => acc + t.amount, 0);
  }, [monthlyTransactions]);

  const monthlyWithdraw = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === "withdraw")
      .reduce<number>((acc, t) => acc + t.amount, 0);
  }, [monthlyTransactions]);

  // 4. Pie Chart (expenses by category)
  const pieData = useMemo<PieItem[]>(() => {
    return monthlyTransactions
      .filter((tx) => tx.type === "withdraw")
      .reduce<PieItem[]>((acc, tx) => {
        const existing = acc.find(
          (item) => item.name === tx.main_category,
        );
        if (existing) {
          existing.value += tx.amount;
        } else {
          acc.push({
            name: tx.main_category,
            value: tx.amount,
            color: getCategoryColor(
              tx.main_category,
              theme,
            ),
          });
        }
        return acc;
      }, []);
  }, [monthlyTransactions, theme]);

  // 5. Line Chart (by day)
  const lineData = useMemo<LineItem[]>(() => {
    const dailyMap: Record<string, LineItem> = {};

    monthlyTransactions.forEach((tx) => {
      const date = format(new Date(tx.date), "yyyy-MM-dd");
      if (!dailyMap[date]) {
        dailyMap[date] = { date, income: 0, withdraw: 0 };
      }
      dailyMap[date][tx.type as "income" | "withdraw"] +=
        tx.amount;
    });

    return Object.values(dailyMap).sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    );
  }, [monthlyTransactions]);

  // 6. Bar Chart (income + expenses by category)
  const barData = useMemo<BarItem[]>(() => {
    const result: BarItem[] = [];
    const types = ["income", "withdraw"] as const;

    types.forEach((type) => {
      const grouped = monthlyTransactions
        .filter((tx) => tx.type === type)
        .reduce<Record<string, number>>((acc, tx) => {
          const cat = tx.main_category ?? "Uncategorized";
          acc[cat] = (acc[cat] ?? 0) + tx.amount;
          return acc;
        }, {});

      Object.entries(grouped).forEach(([name, value]) => {
        const existing = result.find(
          (item) => item.name === name,
        );
        if (existing) {
          existing[type] = value;
        } else {
          result.push({
            name,
            [type]: value,
            color: getCategoryColor(name, theme),
          });
        }
      });
    });

    return result;
  }, [monthlyTransactions, theme]);

  // 7. Sorting and subcategorization functions
  const sortBarData = useCallback<
    DashboardData["sortBarData"]
  >(
    (key, direction) => {
      if (!key || !direction) return barData;
      return [...barData].sort((a, b) =>
        direction === "asc"
          ? (a[key] ?? 0) - (b[key] ?? 0)
          : (b[key] ?? 0) - (a[key] ?? 0),
      );
    },
    [barData],
  );

  const getAmountBySubCategory = useCallback(
    (categoryName: string): Record<string, number> => {
      const data: Record<string, number> = {};
      monthlyTransactions
        .filter((t) => t.main_category === categoryName)
        .forEach((t) => {
          const key = t.sub_category || "Uncategorized";
          data[key] = (data[key] ?? 0) + t.amount;
        });
      return data;
    },
    [monthlyTransactions],
  );

  const getBarDataBySubCategory = useCallback(
    (categoryName: string): SubCategoryItem[] => {
      const subCategoryData =
        getAmountBySubCategory(categoryName);
      return Object.entries(subCategoryData).map(
        ([sub_category, amount]) => ({
          sub_category,
          amount,
          color: getCategoryColor(sub_category, theme),
        }),
      );
    },
    [getAmountBySubCategory, theme],
  );

  // 8. Available months
  const availableMonths = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        safeTransactions.map((t) =>
          format(new Date(t.date), "yyyy-MM"),
        ),
      ),
    ).sort();
  }, [safeTransactions]);

  const minMonth = availableMonths[0] ?? null;
  const maxMonth = availableMonths.at(-1) ?? null;

  return {
    isLoading,
    error,
    balance,
    monthlyIncome,
    monthlyWithdraw,
    monthlyTransactions,
    pieData,
    lineData,
    barData,
    sortBarData,
    getBarDataBySubCategory,
    availableMonths,
    minMonth,
    maxMonth,
  };
}
