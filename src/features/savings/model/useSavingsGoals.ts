import { useQuery } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { SavingsGoal } from "@/entities/savings/types";
import { getAllSavingsGoals } from "../api/apiSavings";

export function useSavingsGoals(): UseSavingsGoalsResult {
  const { user } = useAuth();

  const { isLoading, error, data } = useQuery<
    SavingsGoal[],
    PostgrestError
  >({
    queryKey: ["savingsGoals", user?.id], // Unique key for different users
    queryFn: () => getAllSavingsGoals(user?.id), // We pass user.id
    enabled: !!user?.id, // The request is executed only if the user is authorized.
    staleTime: 1000 * 60,
  });

  return {
    isLoading,
    error: error ?? null,
    savingsGoals: data ?? [],
  };
}

export type UseSavingsGoalsResult = {
  isLoading: boolean;
  error: PostgrestError | null;
  savingsGoals: SavingsGoal[];
};
