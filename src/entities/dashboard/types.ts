import { PostgrestError } from "@supabase/supabase-js";
import { Transaction } from "../transaction/types";
import {
  BarItem,
  LineItem,
  PieItem,
  SubCategoryItem,
} from "./ui-types";

export type SortKey = "income" | "withdraw";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey | null;
  direction: SortDirection | null;
}
export interface DashboardData {
  isLoading: boolean;
  error: PostgrestError | null;

  balance: number;
  monthlyIncome: number;
  monthlyWithdraw: number;

  monthlyTransactions: Transaction[];

  pieData: PieItem[];
  lineData: LineItem[];
  barData: BarItem[];

  sortBarData: (
    key: SortKey | null,
    direction: SortDirection | null,
  ) => BarItem[];

  getBarDataBySubCategory: (
    categoryName: string,
  ) => SubCategoryItem[];

  availableMonths: string[];
  minMonth: string | null;
  maxMonth: string | null;
}
