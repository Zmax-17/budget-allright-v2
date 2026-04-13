import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteTransaction } from "../api/apiTransactions";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { Transaction } from "@/entities/transaction/types";
import { transactionsKeys } from "./queryKeys";

export function useDelTransaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = transactionsKeys.all(userId);

  const { isPending: isDeleting, mutate: delTransaction } =
    useMutation<
      { count: number },
      Error,
      string,
      { previousTransactions: Transaction[] }
    >({
      mutationFn: (transactionId) => {
        if (!userId) throw new Error("User not authorized");
        return deleteTransaction(transactionId, userId);
      },

      onMutate: async (transactionId) => {
        await queryClient.cancelQueries({ queryKey });

        const previousTransactions =
          queryClient.getQueryData<Transaction[]>(
            queryKey,
          ) ?? [];

        queryClient.setQueryData<Transaction[]>(
          queryKey,
          (old = []) =>
            old.filter((t) => t.id !== transactionId),
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
          err.message ?? "Failed to delete transaction",
        );
      },

      onSuccess: () => {
        toast.success("Transaction deleted successfully");
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  return { isDeleting, delTransaction };
}
