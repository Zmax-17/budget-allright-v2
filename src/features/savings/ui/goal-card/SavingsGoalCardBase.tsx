import { ReactNode } from "react";
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
} from "react-icons/md";
import { SavingsGoal } from "@/entities/savings/types";
import {
  getGoalDaysLeft,
  getGoalProgress,
  isGoalDateUrgent,
} from "../../model/goalMeta";

type Props = {
  goal: SavingsGoal;
  status: "active" | "reached" | "completed";
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  onAddMoney: () => void;
  children: ReactNode;
};

const cardStyles = {
  active:
    "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  reached:
    "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-400 dark:border-emerald-600 shadow-lg scale-[1.03] ring-2 ring-emerald-200 dark:ring-emerald-800",
  completed:
    "bg-gray-50/50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 opacity-75",
};

export default function SavingsGoalCardBase({
  goal,
  status,
  onEdit,
  onDelete,
  isDeleting,
  onAddMoney,
  children,
}: Props) {
  const progress = getGoalProgress(goal);
  const roundedProgress = Math.round(progress);

  const daysLeft = getGoalDaysLeft(goal);
  const isDateUrgent = isGoalDateUrgent(goal);

  return (
    <div
      className={`
        p-5 rounded-xl border shadow-sm
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 space-y-4
        ${cardStyles[status]}
        ${status === "completed" ? "h-auto" : ""}
      `}
    >
      {/* Colored stripe - only for active/reached */}
      {status !== "completed" && (
        <div
          style={{ backgroundColor: goal.color }}
          className="h-2 w-full rounded-full opacity-90 shadow-sm"
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
            {goal.name}
          </h3>

          {/* Badge for reached */}
          {status === "reached" && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full mt-1 font-medium">
              <span>🎉</span> Reached
            </span>
          )}

          {/* We show the date only if it is close */}
          {isDateUrgent && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
              ⏰ {daysLeft} days left
            </p>
          )}
        </div>

        {/* Actions buttons */}
        <div className="flex gap-1.5 flex-shrink-0">
          {status !== "completed" && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300"
              title="Edit goal"
            >
              <MdOutlineModeEdit size={16} />
            </button>
          )}

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg  hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 transition disabled:opacity-50"
            title="Delete goal"
          >
            <MdDeleteOutline size={16} />
          </button>
        </div>
      </div>

      {/* Amount only for active/reached */}
      {status !== "completed" && (
        <div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {goal.current_amount?.toLocaleString("no-NO")}
            <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
              kr
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            goal:{" "}
            {goal.target_amount.toLocaleString("no-NO")} kr
          </p>
        </div>
      )}

      {/* Progress is only for active */}
      {status === "active" && (
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${roundedProgress}%` }}
            />
          </div>

          {/* Percentage + remaining */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {roundedProgress}% complete
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {(
                goal.target_amount - goal.current_amount
              ).toLocaleString("no-NO")}{" "}
              kr to go
            </span>
          </div>
        </div>
      )}

      {/* The "Add money" button is always visible for active */}
      {status === "active" && (
        <button
          onClick={onAddMoney}
          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-800 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 font-medium transition mt-2 cursor-pointer"
        >
          + Add / Withdraw money
        </button>
      )}

      {/* Children for Reached and Completed sections */}
      {children}
    </div>
  );
}
