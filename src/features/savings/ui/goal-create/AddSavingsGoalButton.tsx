import { useModal } from "@/context/ModalContext";
import { HiPlus } from "react-icons/hi";

/**
 * Button to open the form for adding a new goal
 * Opens the "add-savings-goal" modal window
 */
export default function AddSavingsGoalButton() {
  const { openModal } = useModal();

  return (
    <button
      className="flex items-center gap-2 bg-white text-emerald-700 dark:bg-emerald-700 dark:text-white
             font-bold p-2 rounded-xl cursor-pointer
             hover:bg-emerald-600 hover:text-white
             dark:hover:bg-emerald-600
             focus:outline-2 focus:outline-offset-2 focus:outline-emerald-900
             active:bg-emerald-800 active:translate-y-0.5
             transition-colors duration-200"
      onClick={() => {
        openModal("add-savings-goal");
      }}
      aria-label="Add new goal"
      title="Add new goal"
    >
      Add Goal
      <HiPlus />
    </button>
  );
}
