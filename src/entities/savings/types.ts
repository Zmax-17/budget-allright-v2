import type { Database } from "@/shared/types/supabase";

export type SavingsGoalRow =
  Database["public"]["Tables"]["savings_goals"]["Row"];
export type SavingsGoalInsert =
  Database["public"]["Tables"]["savings_goals"]["Insert"];
export type SavingsGoalUpdate =
  Database["public"]["Tables"]["savings_goals"]["Update"];

// The main interface for the frontend
export interface SavingsGoal extends SavingsGoalRow {
  // Ability to add calculated fields or override types if needed
  current_amount: number; // make it non-null, because default is 0
  target_date: string | null;
}

// To create a new goal (without id, user_id, current_amount, created_at)
export type SavingsGoalCreate = Omit<
  SavingsGoal,
  "id" | "user_id" | "current_amount" | "created_at"
>;

export type SavingsGoalUpdateFrontend =
  SavingsGoalUpdate & {
    id: string;
  };
