import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createTransaction } from "../api/apiTransactions";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Transaction,
  TransactionCreate,
} from "@/entities/transaction/types";
import { transactionsKeys } from "./queryKeys";

export function useAddTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = transactionsKeys.all(userId);

  const { isPending: isAdding, mutate: addTransaction } =
    useMutation<
      Transaction,
      Error,
      TransactionCreate,
      {
        previousTransactions: Transaction[];
        tempId: string;
      } //  explicit context type
    >({
      mutationFn: (transaction) => {
        if (!userId) throw new Error("User not authorized");
        return createTransaction(transaction, userId);
      },

      onMutate: async (newTransaction) => {
        await queryClient.cancelQueries({ queryKey });

        const previousTransactions =
          queryClient.getQueryData<Transaction[]>(
            queryKey,
          ) ?? [];

        const tempId = `temp-${Date.now()}`;

        // Create a complete object corresponding to the Transaction type
        const optimisticTransaction: Transaction = {
          id: tempId,
          created_at: new Date().toISOString(),
          updated_at: null,
          user_id: userId!,
          amount: Number(newTransaction.amount),
          description: newTransaction.description ?? "",
          date:
            newTransaction.date ||
            new Date().toISOString().split("T")[0],
          main_category: newTransaction.main_category ?? "",
          sub_category: newTransaction.sub_category ?? null,
          type: newTransaction.type ?? null,
          goal_id: null,
        };

        queryClient.setQueryData<Transaction[]>(
          queryKey,
          (old = []) => [optimisticTransaction, ...old],
        );

        return { previousTransactions, tempId };
      },

      onError: (err, _, context) => {
        if (context?.previousTransactions) {
          queryClient.setQueryData(
            queryKey,
            context.previousTransactions,
          );
        }
        toast.error(
          err.message ?? "Failed to add transaction",
        );
      },

      onSuccess: (createdTransaction, _, context) => {
        if (!context?.tempId) return;

        queryClient.setQueryData<Transaction[]>(
          queryKey,
          (old = []) =>
            old.map((t) =>
              t.id === context.tempId
                ? createdTransaction
                : t,
            ),
        );
        toast.success("Transaction added successfully");
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  return { isAdding, addTransaction };
}
