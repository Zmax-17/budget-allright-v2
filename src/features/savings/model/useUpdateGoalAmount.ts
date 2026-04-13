import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { updateGoalCurrentAmount } from "../api/apiSavings";
import { SavingsGoalRow } from "@/entities/savings/types";

type UpdateGoalAmountInput = {
  goalId: string;
  delta: number;
};

export function useUpdateGoalAmount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = ["savingsGoals", userId];

  return useMutation({
    mutationFn: async ({
      goalId,
      delta, // positive = increase, negative = decrease
    }: UpdateGoalAmountInput) => {
      if (!userId) throw new Error("User not authorized");
      return updateGoalCurrentAmount(goalId, delta, userId);
    },

    onMutate: async ({ goalId, delta }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousGoals =
        queryClient.getQueryData<SavingsGoalRow[]>(
          queryKey,
        ) ?? [];

      queryClient.setQueryData(
        queryKey,
        (old: SavingsGoalRow[] | undefined) =>
          (old ?? []).map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  current_amount: Math.max(
                    0,
                    (goal.current_amount || 0) + delta,
                  ),
                }
              : goal,
          ),
      );

      return { previousGoals };
    },

    onError: (_err, _, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(
          queryKey,
          context.previousGoals,
        );
      }
      toast.error("Failed to update goal amount");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
