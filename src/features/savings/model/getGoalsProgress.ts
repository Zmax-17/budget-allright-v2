import { SavingsGoal } from "@/entities/savings/types";
import { Transaction } from "@/entities/transaction/types";

type GoalWithProgress = SavingsGoal & {
  current: number;
};

export function getGoalsProgress(
  goals: SavingsGoal[] = [],
  transactions: Transaction[] = [],
): GoalWithProgress[] {
  return goals.map((goal) => {
    const current = transactions
      .filter((t) => t.goal_id === goal.id)
      .reduce((acc, t) => {
        // We assume that for the purposes of "withdraw" = replenishment of the purpose
        if (t.type === "withdraw")
          return acc + (t.amount ?? 0);
        if (t.type === "income")
          return acc - (t.amount ?? 0);
        return acc;
      }, 0);

    return {
      ...goal,
      current: Math.max(0, current),
    };
  });
}
