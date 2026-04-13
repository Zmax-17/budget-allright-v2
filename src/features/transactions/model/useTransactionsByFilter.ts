import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getTransactionsByFilter } from "../api/apiTransactions";
import {
  Transaction,
  TransactionFilter,
} from "@/entities/transaction/types";
import { transactionsKeys } from "./queryKeys";

export function useTransactionsByFilter(
  filter: TransactionFilter = {},
) {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    isLoading,
    error,
    data: transactions = [],
  } = useQuery<Transaction[], Error>({
    queryKey: transactionsKeys.byFilter(userId, filter),
    queryFn: () => getTransactionsByFilter(filter, userId),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });

  return {
    isLoading,
    error: error ?? null,
    transactions,
  };
}
