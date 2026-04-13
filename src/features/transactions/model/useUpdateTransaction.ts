import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateTransactionApi } from "../api/apiTransactions";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Transaction,
  TransactionUpdate,
} from "@/entities/transaction/types";
import { transactionsKeys } from "./queryKeys";

export function useUpdateTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = transactionsKeys.all(userId);

  const {
    isPending: isUpdating,
    mutate: updateTransaction,
  } = useMutation<
    Transaction,
    Error,
    TransactionUpdate,
    { previousTransactions: Transaction[] }
  >({
    mutationFn: (updateData) => {
      if (!userId) throw new Error("User not authorized");
      return updateTransactionApi(updateData, userId);
    },

    onMutate: async (newUpdate) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTransactions =
        queryClient.getQueryData<Transaction[]>(queryKey) ??
        [];

      queryClient.setQueryData<Transaction[]>(
        queryKey,
        (old = []) =>
          old.map((tx) =>
            tx.id === newUpdate.id
              ? ({ ...tx, ...newUpdate } as Transaction)
              : tx,
          ),
      );

      return { previousTransactions };
    },

    onError: (err, _, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          queryKey,
          context.previousTransactions,
        );
      }
      toast.error(
        err.message ?? "Failed to update transaction",
      );
    },

    onSuccess: () => {
      toast.success("Transaction updated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { isUpdating, updateTransaction };
}
