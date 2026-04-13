import { useTransactions } from "@/features/transactions/model/useTransactions";
import { useMemo } from "react";

export function useGoalProgress(goalId: string) {
  const { transactions } = useTransactions();

  const progress = useMemo(() => {
    return transactions
      .filter((t) => t.goal_id === goalId)
      .reduce((acc, t) => {
        if (t.main_category !== "Savings") return acc;

        if (t.type === "withdraw")
          return acc + (t.amount ?? 0);
        if (t.type === "income")
          return acc - (t.amount ?? 0);

        return acc;
      }, 0);
  }, [transactions, goalId]);

  return progress;
}
