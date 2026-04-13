import { SavingsGoal } from "@/entities/savings/types";
import SavingsGoalCard from "../goal-card/SavingsGoalCard";
import EmptyState from "@/shared/ui/EmptyState";
import { FaWallet } from "react-icons/fa";
import AddSavingsGoalButton from "../goal-create/AddSavingsGoalButton";

type Props = {
  savingsGoals: SavingsGoal[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  amounts: Record<string, string>;
  setAmounts: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
};

export default function SavingsGoalList({
  savingsGoals,
}: Props) {
  if (savingsGoals.length === 0) {
    return (
      <EmptyState
        icon={<FaWallet className="text-emerald-600" />}
        title="You don't have any savings goals yet."
        description="Create your first savings goal to start saving."
        action={<AddSavingsGoalButton />}
        className="mt-4"
      />
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {savingsGoals.map((goal) => (
        <SavingsGoalCard
          key={goal.id}
          goal={goal}
        />
      ))}
    </section>
  );
}
