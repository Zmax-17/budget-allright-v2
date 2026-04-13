import {
  SavingsGoal,
  SavingsGoalCreate,
  SavingsGoalUpdate,
} from "@/entities/savings/types";
import supabase from "@/shared/services/supabase";

export async function getAllSavingsGoals(
  user_id: string | undefined,
): Promise<SavingsGoal[]> {
  if (!user_id) throw new Error("User ID is required");
  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", user_id)
    .order("target_date", { ascending: true });

  if (error)
    throw new Error(
      `Get savings failed: ${error.message ?? "Unknown error"}${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  return data ?? [];
}

export async function deleteGoal(
  id: string,
  user_id: string | undefined,
): Promise<{ count: number }> {
  if (!user_id) throw new Error("User ID is required");

  const { error, count } = await supabase
    .from("savings_goals")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user_id); // Avoid accidentally deleting someone else's transaction

  if (error)
    throw new Error(
      `Delete goal ${id} failed: ${error.message ?? "Unknown error"} ${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  return { count };
}

export async function createGoal(
  goal: SavingsGoalCreate,
  user_id: string | undefined,
): Promise<SavingsGoal> {
  if (!user_id) throw new Error("User ID is required");

  const requiredFields = [
    "name",
    "target_amount",
    "target_date",
  ] as const;
  const missingFields = requiredFields.filter(
    (field) => !goal[field],
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  const validatedGoal = {
    ...goal,
    user_id,
    color: goal.color || "#10b981",
    target_date:
      goal.target_date ||
      new Date().toISOString().split("T")[0], // Sets the current date if not specified.
  };

  const { error, data } = await supabase
    .from("savings_goals")
    .insert(validatedGoal) // Simplify to the object
    .select()
    .single();

  if (error)
    throw new Error("Create error: " + error.message);
  return data!;
}

export async function updateGoalApi(
  newGoal: SavingsGoalUpdate,
  user_id: string | undefined,
): Promise<SavingsGoal> {
  if (!user_id) throw new Error("User ID is required");

  const { id, ...updateData } = newGoal;
  if (!id) throw new Error("Transaction ID is required");

  const { error, data } = await supabase
    .from("savings_goals")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error)
    throw new Error(
      `Update goal ${id} failed: ${error.message ?? "Unknown error"} ${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  if (!data)
    throw new Error("No data returned after update");

  return data;
}

export async function updateGoalCurrentAmount(
  goalId: string,
  delta: number,
  user_id: string | undefined,
): Promise<SavingsGoal> {
  if (!user_id) throw new Error("User ID is required");
  if (!goalId) throw new Error("Goal ID is required");

  // Get the current target
  const { data: currentGoal, error: fetchError } =
    await supabase
      .from("savings_goals")
      .select("current_amount")
      .eq("id", goalId)
      .eq("user_id", user_id)
      .single();

  if (fetchError || !currentGoal) {
    throw new Error("Goal not found or access denied");
  }

  const newAmount = Math.max(
    0,
    (currentGoal.current_amount ?? 0) + delta,
  );

  const { error, data } = await supabase
    .from("savings_goals")
    .update({ current_amount: newAmount })
    .eq("id", goalId)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Update current amount failed: ${error.message}`,
    );
  }
  if (!data)
    throw new Error("No data returned after update");

  return data;
}
