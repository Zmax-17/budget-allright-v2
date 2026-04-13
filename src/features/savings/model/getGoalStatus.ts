import { SavingsGoal } from "@/entities/savings/types";
type GoalStatus = "active" | "reached" | "completed";

export default function getGoalStatus(
  goal: SavingsGoal,
): GoalStatus {
  if (goal.completed_at) return "completed";

  if (
    goal.target_amount > 0 &&
    (goal.current_amount ?? 0) >= goal.target_amount
  ) {
    return "reached";
  }

  return "active";
}
