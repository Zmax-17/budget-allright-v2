import { SavingsGoal } from "@/entities/savings/types";

type Props = {
  goal: SavingsGoal;
  onWithdraw: () => void;
};

export default function GoalReachedSection({
  goal,
  onWithdraw,
}: Props) {
  return (
    <div className="space-y-4 pt-2">
      <div className="text-center">
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
          Congratulations! 🎉
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          You've reached your savings goal
        </p>
      </div>

      <button
        onClick={onWithdraw}
        className="
          w-full py-2.5 rounded-xl 
          bg-gradient-to-r from-emerald-600 to-green-600 
          hover:from-emerald-700 hover:to-green-700
          text-white font-bold text-base
          shadow-lg hover:shadow-xl
          transform hover:scale-[1.02]
          transition-all duration-200
          cursor-pointer
        "
      >
        💰 Withdraw{" "}
        {goal.current_amount.toLocaleString("no-NO")} kr
      </button>
    </div>
  );
}
