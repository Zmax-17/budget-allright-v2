import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { getAllTransactions } from "@/features/transactions/api/apiTransactions";
import {
  Transaction,
  UseTransactionsResult,
} from "@/entities/transaction/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";

export function useTransactions(): UseTransactionsResult {
  const { user } = useAuth();

  const {
    isLoading,
    error,
    data: transactions,
  } = useQuery<Transaction[], PostgrestError | null>({
    queryKey: ["transactions", user?.id], // Unique key for different users
    queryFn: () => getAllTransactions(user?.id), // We pass user.id
    enabled: !!user?.id, // The request is executed only if the user is authorized.
    staleTime: 1000 * 60 * 5, // 5m in prod
    gcTime: 1000 * 60 * 30, // 30m
    placeholderData: keepPreviousData,
  });

  return {
    isLoading,
    error,
    transactions: transactions ?? [],
  };
}
