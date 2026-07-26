import { useUpdateGoal } from "./useUpdateGoal";
import { useUpdateGoalAmount } from "./useUpdateGoalAmount";
import { useAddTransaction } from "@/features/transactions/model/useAddTransaction";
import toast from "react-hot-toast";
import { SavingsGoal } from "@/entities/savings/types";
import { useModal } from "@/context/ModalContext";

export function useCompletedGoal() {
  const { openModal } = useModal();
  const { updateGoal } = useUpdateGoal();
  const { mutateAsync: updateAmount } =
    useUpdateGoalAmount();
  const { addTransaction } = useAddTransaction();

  const completedGoal = async (goal: SavingsGoal) => {
    if (goal.completed_at) return;

    const amount = goal.current_amount ?? 0;

    openModal("confirm-complete-goal", {
      title: `Complete goal "${goal.name}"?`,
      description: `Return ${amount.toLocaleString("no-NO")} kr to your balance?`,
      confirmText: "Complete Goal",
      onConfirm: async () => {
        try {
          // 1. Transaction
          addTransaction({
            amount,
            type: "income",
            main_category: "Savings",
            description: `Completed goal ${goal.name}`,
            goal_id: null,
            date: new Date().toISOString().split("T")[0],
          });

          // 2. reset the amount
          await updateAmount({
            goalId: goal.id,
            delta: -amount,
          });

          // 3. mark as complete
          updateGoal({
            id: goal.id,
            completed_at: new Date().toISOString(),
          });

          toast.success(
            "Goal completed and funds returned 🎉",
          );
        } catch {
          toast.error("Error completing goal");
        }
      },
    });
  };

  return { completedGoal };
}
