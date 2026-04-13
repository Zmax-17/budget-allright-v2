type GoalBase = {
  current_amount: number;
  target_amount: number;
  target_date?: string;
};
export function getGoalProgress(goal: GoalBase) {
  if (goal.target_amount <= 0) return 0;

  return Math.min(
    100,
    (goal.current_amount / goal.target_amount) * 100,
  );
}

export function getGoalRemaining(goal: GoalBase) {
  return Math.max(
    0,
    goal.target_amount - goal.current_amount,
  );
}

export function getGoalDaysLeft(goal: GoalBase) {
  if (!goal.target_date) return null;

  return Math.ceil(
    (new Date(goal.target_date).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24),
  );
}

export function isGoalDateUrgent(goal: GoalBase): boolean {
  const daysLeft = getGoalDaysLeft(goal);
  return daysLeft !== null && daysLeft < 30 && daysLeft > 0;
}
