import AddSavingsGoalMoneyUI from "./AddSavingsGoalMoneyUI";
import { useModal } from "@/context/ModalContext";
import { useAddToSavingsGoal } from "../../model/useAddToSavingsGoal";
import { useDashboardData } from "@/features/dashboard/model/useDashboardData";
import { useMonth } from "@/context/MonthContext";

type Props = {
  goal: {
    id: string;
    name: string;
    current_amount: number;
    target_amount: number;
    target_date?: string;
    color?: string;
  };
};

export default function AddMoneyToGoalModal({
  goal,
}: Props) {
  const { closeModal } = useModal();
  const { mutate: addToGoal, isPending } =
    useAddToSavingsGoal();

  const { selectedMonth } = useMonth();
  const { balance } = useDashboardData(selectedMonth);

  const handleSubmit = (
    value: number,
    type: "deposit" | "withdraw",
  ) => {
    addToGoal({
      goalId: goal.id,
      goalName: goal.name,
      amount: value,
      type,
    });

    closeModal();
  };

  return (
    <div className="p-6">
      <AddSavingsGoalMoneyUI
        goal={goal}
        globalBalance={balance}
        isPending={isPending}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
}
