import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { createTransaction } from "@/features/transactions/api/apiTransactions";
import { useUpdateGoalAmount } from "./useUpdateGoalAmount";

type AddToGoalInput = {
  goalId: string;
  goalName: string;
  amount: number;
  type: "deposit" | "withdraw"; // deposit = replenishment of the target, withdraw = withdrawal
};

export function useAddToSavingsGoal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: updateGoalAmount } =
    useUpdateGoalAmount();

  return useMutation({
    mutationFn: async ({
      goalId,
      goalName,
      amount,
      type,
    }: AddToGoalInput) => {
      if (!user?.id) {
        throw new Error("User not authorized");
      }

      // create a regular transaction
      const tx = await createTransaction(
        {
          amount,
          type: type === "deposit" ? "withdraw" : "income", // target replenishment = expenditure from balance
          main_category: "Savings",
          sub_category: null,
          description: `${type === "deposit" ? "Added to" : "Withdrawn from"} goal ${goalName}`,
          goal_id: goalId, // connection with goals
          date: new Date().toISOString().split("T")[0],
        },
        user.id,
      );

      return tx;
    },

    onSuccess: (_data, variables) => {
      updateGoalAmount({
        goalId: variables.goalId,
        delta:
          variables.type === "deposit"
            ? variables.amount
            : -variables.amount,
      });

      toast.success(
        variables.type === "deposit"
          ? "Added to goal"
          : "Withdrawn from goal",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["savingsGoals", user?.id],
      });
    },

    onError: () => {
      toast.error("Error adding to goal");
    },
  });
}
