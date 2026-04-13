import { Database } from "@/shared/types/supabase";
import { PostgrestError } from "@supabase/supabase-js";

// Base type from Supabase (Row)
export type TransactionRow =
  Database["public"]["Tables"]["transactions"]["Row"];

export type Transaction = TransactionRow & {
  goal_id?: string | null;
};

export type TransactionCreate =
  Database["public"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate =
  Database["public"]["Tables"]["transactions"]["Update"];

export type SortField = "date" | "amount";
export type SortDirection = "asc" | "desc";

export type TransactionFilter = {
  type?: "income" | "withdraw" | "all";
  sort?: {
    field: SortField;
    direction: SortDirection;
  };
};

// Result type for useTransactions* hooks (consistent)
export type UseTransactionsResult<T = Transaction[]> = {
  isLoading: boolean;
  error: PostgrestError | Error | null;
  transactions: T;
};
