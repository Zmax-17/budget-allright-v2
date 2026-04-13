// features/savings/utils.ts
import { Transaction } from "@/entities/transaction/types";

/**
 * Calculates current balance for a specific savings goal
 * based on all transactions linked to it
 */
export const getGoalBalance = (
  transactions: Transaction[],
  goalId: string,
): number => {
  return transactions
    .filter((t) => t.goal_id === goalId)
    .reduce(
      (sum, t) =>
        sum + (t.type === "income" ? t.amount : -t.amount),
      0,
    );
};
