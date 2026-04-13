import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import {
  SavingsGoal,
  SavingsGoalCreate,
} from "@/entities/savings/types";
import { createGoal } from "../api/apiSavings";

export function useAddGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const queryKey = ["savingsGoals", userId];

  const { isPending: isAdding, mutate: addGoal } =
    useMutation<
      SavingsGoal,
      Error,
      SavingsGoalCreate,
      { previousGoals: SavingsGoal[] }
    >({
      mutationFn: (goal) => {
        if (!userId) {
          throw new Error("User not authorized");
        }
        return createGoal(goal, userId);
      },

      onMutate: async (newGoal) => {
        await queryClient.cancelQueries({ queryKey });

        const previousGoals =
          queryClient.getQueryData<SavingsGoal[]>(
            queryKey,
          ) ?? [];

        // Optimistic update
        queryClient.setQueryData<SavingsGoal[]>(
          queryKey,
          (old = []) => [
            {
              ...newGoal,
              id: `temp-${Date.now()}`,
            } as SavingsGoal,
            ...old,
          ],
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
        toast.error(err.message ?? "Failed to create goal");
      },

      onSuccess: (createdGoal) => {
        queryClient.setQueryData<SavingsGoal[]>(
          queryKey,
          (old = []) =>
            old.map((g) =>
              g.id.startsWith("temp-") ? createdGoal : g,
            ),
        );
        toast.success("Goal created successfully");
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });

  return { isAdding, addGoal };
}
