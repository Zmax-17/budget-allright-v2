export type GoalValidationResult =
  | { type: "error"; code: "INVALID_AMOUNT" }
  | { type: "error"; code: "NOT_ENOUGH_BALANCE" }
  | { type: "error"; code: "NOT_ENOUGH_IN_GOAL" }
  | { type: "error"; code: "OVER_GOAL"; remaining: number }
  | { type: "ok" };

type Params = {
  amount: number;
  balance: number;
  currentAmount: number;
  targetAmount: number;
  isAdding: boolean;
};

export function validateGoalOperation({
  amount,
  balance,
  currentAmount,
  targetAmount,
  isAdding,
}: Params): GoalValidationResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { type: "error", code: "INVALID_AMOUNT" };
  }

  const remaining = Math.max(
    0,
    targetAmount - currentAmount,
  );

  if (isAdding && amount > balance) {
    return { type: "error", code: "NOT_ENOUGH_BALANCE" };
  }

  if (!isAdding && amount > currentAmount) {
    return { type: "error", code: "NOT_ENOUGH_IN_GOAL" };
  }

  if (isAdding && amount > remaining) {
    return { type: "error", code: "OVER_GOAL", remaining };
  }

  return { type: "ok" };
}
