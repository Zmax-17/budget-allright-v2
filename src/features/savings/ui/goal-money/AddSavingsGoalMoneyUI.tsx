import clsx from "clsx";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { useState } from "react";

import { useGoalValidation } from "../../model/useGoalValidation";
import { validateGoalOperation } from "@/entities/savings-goal/validation";

import EmptyState from "@/shared/ui/EmptyState";
import { FaWallet } from "react-icons/fa";
import AddTransactionButton from "@/features/transactions/ui/AddTransactionButton";

import {
  getGoalRemaining,
  getGoalProgress,
  getGoalDaysLeft,
} from "../../model/goalMeta";

import { LuAlarmClock } from "react-icons/lu";

type Props = {
  goal: {
    id: string;
    name: string;
    current_amount: number;
    target_amount: number;
    target_date?: string;
    color?: string;
  };
  globalBalance: number;
  isPending: boolean;
  onSubmit: (
    value: number,
    type: "deposit" | "withdraw",
  ) => void;
  onClose: () => void;
};

export default function AddSavingsGoalMoneyUI({
  goal,
  globalBalance,
  isPending,
  onSubmit,
  onClose,
}: Props) {
  const [isAdding, setIsAdding] = useState(true);
  const [amount, setAmount] = useState("");

  const numericAmount = Number(amount) || 0;
  const isTouched = amount.length > 0;

  const { result, isError, errorMessage } =
    useGoalValidation({
      amount: numericAmount,
      goal,
      balance: globalBalance,
      isAdding,
    });

  const canSubmit = result.type === "ok" && !isPending;

  const remaining = getGoalRemaining(goal);
  const progress = getGoalProgress(goal);
  const daysLeft = getGoalDaysLeft(goal);

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit(
      numericAmount,
      isAdding ? "deposit" : "withdraw",
    );
  };

  //  quick submit (via domain validation)
  const handleQuickSubmit = (value: number) => {
    if (isPending) return;

    const validation = validateGoalOperation({
      amount: value,
      balance: globalBalance,
      currentAmount: goal.current_amount,
      targetAmount: goal.target_amount,
      isAdding: true,
    });

    if (validation.type === "error") return;

    onSubmit(value, "deposit");
  };

  const percentages =
    goal.target_amount > 200_000
      ? [0.01, 0.05, 0.1]
      : goal.target_amount > 50_000
        ? [0.05, 0.1, 0.25]
        : [0.1, 0.25, 0.5];

  // Quick-add buttons - percentage of remaining
  const quickAmounts = percentages
    .map((p) => {
      // Math.floor is guaranteed not to exceed remaining
      const raw = Math.floor(remaining * p);
      return {
        value: raw,
        label: `${Math.round(p * 100)}%`,
      };
    })
    .filter((q) => q.value > 0);

  // If the balance is 0 and we try to add money, we show a stub.
  const hasNoBalance = globalBalance === 0 && isAdding;

  if (hasNoBalance) {
    return (
      <EmptyState
        icon={<FaWallet className="text-gray-400" />}
        title="No funds available"
        description="Add a transaction to top up your balance before adding to this goal."
        action={<AddTransactionButton />}
        className="mt-4"
      />
    );
  }

  return (
    <div className="mt-3 pt-3 space-y-3">
      {/* Colored stripe */}
      <div
        style={{ backgroundColor: goal.color }}
        className="h-2 w-full rounded-full opacity-90 shadow-sm dark:opacity-100"
      />
      {/* Goal summary */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        {/* Top row */}{" "}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
          {goal.name}
        </h3>
        <div className="flex items-center justify-between mb-2 mt-2">
          <div>
            <p className="text-xs text-gray-500">Saved</p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {goal.current_amount?.toLocaleString("no-NO")}
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                kr
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Goal</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {goal.target_amount.toLocaleString("no-NO")}{" "}
              kr
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 transition-all duration-700 ease-out rounded-full"
            style={{
              width: `${Math.min(progress, 100)}%`,
            }}
          />
        </div>
        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {Math.round(progress)}% complete
          </span>

          <span className="font-medium text-gray-500 dark:text-gray-400">
            {remaining.toLocaleString("no-NO")} kr to go
          </span>
        </div>
        {/* Deadline */}
        {daysLeft !== null && daysLeft > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-xs text-orange-600 dark:text-orange-400">
            <LuAlarmClock className="text-sm" />
            <span>{daysLeft} days left</span>
          </div>
        )}
      </div>

      {/* Balance */}
      <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
        Balance: {globalBalance.toLocaleString("no-NO")} kr
      </p>

      {/* Toggle */}
      <div className="mb-3">
        <div
          className="relative flex rounded-xl p-1.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
          role="group"
          aria-label="Select action"
        >
          {/* Sliding background */}
          <div
            className={clsx(
              "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg",
              "bg-white dark:bg-gray-900",
              "shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
              "transition-all duration-200 ease-out",
              isAdding ? "left-1" : "left-[calc(50%+2px)]",
            )}
          />
          {/* Add */}
          <button
            onClick={() => setIsAdding(true)}
            aria-pressed={isAdding}
            className={clsx(
              "relative z-10 flex-1 flex items-center justify-center gap-1.5",
              "px-3 py-2 rounded-lg text-sm font-medium cursor-pointer",
              "transition-all duration-200",
              "active:scale-[0.97]",
              isAdding
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            <HiPlus className="text-base" /> Add
          </button>

          {/* Withdraw */}
          <button
            onClick={() => setIsAdding(false)}
            className={clsx(
              "relative z-10 flex-1 flex items-center justify-center gap-1.5",
              "px-3 py-2 rounded-lg text-sm font-medium cursor-pointer",
              "transition-all duration-200",
              "active:scale-[0.97]",
              !isAdding
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            <HiMinus className="text-base" /> Withdraw
          </button>
        </div>
      </div>

      {/* Quick */}
      {isAdding && quickAmounts.length > 0 && (
        <div className="flex gap-2">
          {quickAmounts.map((qa) => (
            <button
              key={qa.label}
              onClick={() => handleQuickSubmit(qa.value)}
              disabled={isPending}
              className={clsx(
                "flex-1 justify-center rounded-xl border px-2 py-2.5 text-[13px] font-semibold transition-all",
                "border-gray-200 bg-gray-50 text-gray-900",
                "dark:border-gray-700 dark:bg-gray-800 dark:text-white",
                "hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
              )}
            >
              {qa.value.toLocaleString("no-NO")} kr +
              {qa.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="number"
        min={0}
        max={isAdding ? remaining : goal.current_amount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={
          isAdding ? "Amount to add" : "Amount to withdraw"
        }
        className={clsx(
          "w-full px-3 py-2 rounded-md border text-sm bg-white dark:bg-gray-900 dark:text-white focus:outline-none transition  placeholder:text-gray-400 dark:placeholder:text-gray-500",
          isTouched && isError
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-300",
        )}
      />

      {isTouched && errorMessage && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-2 pt-3">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={clsx(
            "flex-1 py-2.5 rounded-lg text-sm font-semibold transition",
            "flex items-center justify-center gap-1.5",
            !canSubmit
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : isAdding
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                : "bg-red-600 hover:bg-red-700 text-white shadow-sm",
          )}
        >
          {isPending
            ? "Processing..."
            : isAdding
              ? "Add money"
              : "Withdraw"}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          className="
                flex-1 py-2.5 rounded-lg text-sm font-medium transition
                text-gray-600 dark:text-gray-300
                bg-gray-100 dark:bg-gray-800
                hover:bg-gray-200 dark:hover:bg-gray-700
                cursor-pointer
               "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
