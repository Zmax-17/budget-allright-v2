import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { getTransactionsByCategory } from "@/features/transactions/api/apiTransactions";
import { Transaction } from "@/entities/transaction/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";

const transactionsByCategoryKeys = {
  byCategory: (
    category: string,
    userId: string | undefined,
  ) =>
    [
      "transactions",
      userId,
      "byCategory",
      category,
    ] as const,
} as const;

export function useTransactionsByCategory(
  category: string,
): UseTransactionsByCategoryResult {
  const { user } = useAuth();

  const userId = user?.id;

  const {
    isLoading,
    error,
    data: transactions,
  } = useQuery<
    Transaction[],
    PostgrestError | Error | null
  >({
    queryKey: transactionsByCategoryKeys.byCategory(
      category,
      userId,
    ),
    queryFn: () => {
      if (!userId) throw new Error("User not authorized");
      return getTransactionsByCategory(category, userId);
    },
    enabled: !!category && !!userId, // if category and user exist
    placeholderData: keepPreviousData,
  });
  return {
    isLoading,
    error,
    transactions: transactions ?? [],
  };
}
export type UseTransactionsByCategoryResult = {
  isLoading: boolean;
  error: PostgrestError | Error | null;
  transactions: Transaction[];
};
