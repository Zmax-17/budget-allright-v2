import { SavingsGoal } from "@/entities/savings/types";

type Props = {
  goal: SavingsGoal;
};

export default function GoalCompletedSection({
  goal,
}: Props) {
  const completedDate = goal.completed_at
    ? new Date(goal.completed_at).toLocaleDateString(
        "no-NO",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : "Unknown date";

  return (
    <div className="pt-4 pb-2 text-center border-t border-gray-200 dark:border-gray-700 mt-4">
      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
        <span className="text-2xl">🎉</span>
        <span className="font-semibold">
          Goal Completed
        </span>
      </div>

      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {goal.target_amount.toLocaleString("no-NO")} kr
      </p>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Withdrawn to balance on {completedDate}
      </p>
    </div>
  );
}
