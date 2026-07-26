import { JSX, useEffect, useRef } from "react";
import { useModal } from "../context/ModalContext";

import TransactionForm from "../features/transactions/ui/TransactionsForm";
import SavingsGoalForm from "@/features/savings/ui/goal-create/SavingsGoalForm";

import AddMoneyToGoalModal from "@/features/savings/ui/goal-money/AddMoneyToGoalModal";
import ConfirmModal from "@/shared/ui/modals/ConfirmModal";

export default function Modal() {
  const { modal, closeModal } = useModal();
  const contentRef = useRef<HTMLDivElement>(null);

  // Close by Escape
  useEffect(() => {
    if (!modal.isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);
    return () =>
      document.removeEventListener("keydown", onKeyDown);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  let content: JSX.Element | null = null;

  switch (modal.name) {
    // Transactions
    case "add-transaction":
      content = <TransactionForm />;
      break;

    case "edit-transaction":
      content = (
        <TransactionForm transaction={modal.data} />
      );

      break;

    case "delete-transaction":
      content = <ConfirmModal {...modal.data} />;
      break;

    // Savings Goals
    case "add-savings-goal":
      content = <SavingsGoalForm />;
      break;

    case "edit-savings-goal":
      content = <SavingsGoalForm goal={modal.data} />;
      break;

    case "delete-savings-goal":
      content = <ConfirmModal {...modal.data} />;
      break;

    // Add money to goal
    case "add-money-to-goal":
      content = <AddMoneyToGoalModal goal={modal.data} />;
      break;

    // Withdraw money from reached goal
    case "confirm-complete-goal":
      content = <ConfirmModal {...modal.data} />;
      break;

    default: {
      // This will prevent forgotten cases when adding new modals.
      const _exhaustiveCheck: never = modal;
      content = null;
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-200"
      onMouseDown={(e) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(e.target as Node)
        ) {
          closeModal();
        }
      }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg md:max-w-xl overflow-hidden"
      >
        {content}
      </div>
    </div>
  );
}
