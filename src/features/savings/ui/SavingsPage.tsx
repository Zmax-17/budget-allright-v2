import { useState } from "react";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { useSavingsGoals } from "../model/useSavingsGoals";

import AddSavingsGoalButton from "./goal-create/AddSavingsGoalButton";
import SavingsGoalList from "./goal-list/SavingsGoalList";

export default function SavingsGoals() {
  const [activeId, setActiveId] = useState<string | null>(
    null,
  );
  const [amounts, setAmounts] = useState<
    Record<string, string>
  >({});

  const { savingsGoals, isLoading, error } =
    useSavingsGoals();

  if (isLoading)
    return <LoadingSpinner message="Loading goals..." />;
  if (error)
    return (
      <div className="text-red-600 p-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero / Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Track and achieve your financial targets
          </p>
        </div>

        <AddSavingsGoalButton />
      </div>

      <SavingsGoalList
        savingsGoals={savingsGoals}
        activeId={activeId}
        setActiveId={setActiveId}
        amounts={amounts}
        setAmounts={setAmounts}
      />
    </div>
  );
}
