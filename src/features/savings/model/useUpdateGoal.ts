import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import { PostgrestError } from "@supabase/supabase-js";
import {
  SavingsGoal,
  SavingsGoalUpdate,
} from "@/entities/savings/types";
import { updateGoalApi } from "../api/apiSavings";

export function useUpdateGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = ["savingsGoals", userId];

  const { isPending: isUpdating, mutate: updateGoal } =
    useMutation<
      SavingsGoal,
      PostgrestError | Error,
      SavingsGoalUpdate,
      { previousGoals: SavingsGoal[] }
    >({
      mutationFn: (goal) => {
        if (!userId) {
          throw new Error("User not authorized");
        }
        return updateGoalApi(goal, userId);
      },

      onMutate: async (newUpdateGoal) => {
        await queryClient.cancelQueries({ queryKey });

        const previousGoals =
          queryClient.getQueryData<SavingsGoal[]>(
            queryKey,
          ) ?? [];

        queryClient.setQueryData<SavingsGoal[]>(
          queryKey,
          (old = []) =>
            old.map((goal) =>
              goal.id === newUpdateGoal.id
                ? ({
                    ...goal,
                    ...newUpdateGoal,
                  } as SavingsGoal)
                : goal,
            ),
        );

        return { previousGoals };
      },

      onError: (err, _, context) => {
        if (context?.previousGoals) {
          queryClient.setQueryData(
            queryKey,
            context.previousGoals,
          );
        }

        toast.error(err.message ?? "Failed to update goal");
      },

      onSuccess: () => {
        toast.success("Goal updated successfully");
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  return { isUpdating, updateGoal };
}
