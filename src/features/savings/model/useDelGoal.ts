import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { PostgrestError } from "@supabase/supabase-js";
import { deleteGoal } from "../api/apiSavings";
import { SavingsGoal } from "@/entities/savings/types";

type DeleteContext = {
  previousGoals: SavingsGoal[];
};

export function useDelGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = ["savingsGoals", userId];

  const { isPending: isDeleting, mutate: delGoal } =
    useMutation<
      { count: number }, // successful mutation return
      PostgrestError | Error, // error type
      string, // goalId
      DeleteContext // context from onMutate
    >({
      mutationFn: (goalId: string) =>
        deleteGoal(goalId, userId),

      onMutate: async (goalId: string) => {
        await queryClient.cancelQueries({ queryKey });

        const previousGoals =
          queryClient.getQueryData<SavingsGoal[]>(
            queryKey,
          ) ?? [];

        queryClient.setQueryData<SavingsGoal[]>(
          queryKey,
          (old = []) => old.filter((g) => g.id !== goalId),
        );

        return { previousGoals };
      },

      onError: (error, _goalId, context) => {
        if (context?.previousGoals) {
          queryClient.setQueryData(
            queryKey,
            context.previousGoals,
          );
        }

        toast.error(
          error.message || "Failed to delete goal",
        );
      },

      onSuccess: () => {
        // Invalidate all queries starting with "savingsGoals" for the user
        queryClient.invalidateQueries({
          queryKey: ["savingsGoals", userId],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["transactions", userId],
        });
        toast.success("Goal deleted successfully");
      },
    });

  return { isDeleting, delGoal };
}
