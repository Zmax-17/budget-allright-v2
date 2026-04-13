import { useModal } from "@/context/ModalContext";
import { useDelGoal } from "../../model/useDelGoal";
import { useCompletedGoal } from "../../model/useCompletedGoal";
import { SavingsGoal } from "@/entities/savings/types";
import getGoalStatus from "../../model/getGoalStatus";

import SavingsGoalCardBase from "./SavingsGoalCardBase";
import GoalReachedSection from "./GoalReachedSection";
import GoalCompletedSection from "./GoalCompletedSection";
import { useCallback } from "react";

type Props = {
  goal: SavingsGoal;
};

export default function SavingsGoalCard({ goal }: Props) {
  const { openModal } = useModal();
  const { isDeleting, delGoal } = useDelGoal();
  const { completedGoal } = useCompletedGoal();

  const status = getGoalStatus(goal);

  //  Edit
  const handleEdit = useCallback(() => {
    openModal("edit-savings-goal", goal);
  }, [openModal, goal]);
  //  Delete
  const handleDelete = useCallback(() => {
    openModal("delete-savings-goal", {
      title: `Delete goal "${goal.name}"?`,
      description: "This action cannot be undone.",
      onConfirm: () => delGoal(goal.id),
      isDeleting,
    });
  }, [openModal, goal.name, goal.id, delGoal, isDeleting]);
  //  Add / Withdraw modal
  const handleAddMoney = () => {
    openModal("add-money-to-goal", goal);
  };
  //  Withdraw full (when reached)
  const handleWithdraw = useCallback(() => {
    completedGoal(goal);
  }, [completedGoal, goal]);

  return (
    <SavingsGoalCardBase
      goal={goal}
      status={status}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      onAddMoney={handleAddMoney}
    >
      {/*  Reached */}
      {status === "reached" && (
        <GoalReachedSection
          goal={goal}
          onWithdraw={handleWithdraw}
        />
      )}
      {/*  Completed */}
      {status === "completed" && (
        <GoalCompletedSection goal={goal} />
      )}
    </SavingsGoalCardBase>
  );
}
