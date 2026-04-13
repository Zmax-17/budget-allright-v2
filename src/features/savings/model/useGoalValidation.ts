import { validateGoalOperation } from "@/entities/savings-goal/validation";
import { getGoalInputErrorMessage } from "@/entities/savings-goal/getGoalInputErrorMessage";

export function useGoalValidation({
  amount,
  goal,
  balance,
  isAdding,
}: {
  amount: number;
  goal: {
    current_amount: number;
    target_amount: number;
  };
  balance: number;
  isAdding: boolean;
}) {
  const result = validateGoalOperation({
    amount,
    balance,
    currentAmount: goal.current_amount,
    targetAmount: goal.target_amount,
    isAdding,
  });

  return {
    result,
    isError: result.type === "error",
    errorMessage: getGoalInputErrorMessage(result),
  };
}
