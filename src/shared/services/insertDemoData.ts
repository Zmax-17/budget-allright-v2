import toast from "react-hot-toast";
import supabase from "./supabase";
import { DEMO_TRANSACTIONS } from "@/demo";

export async function insertDemoTransactions(): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    toast.error("User not logged in");
    return;
  }
  if (authError) {
    toast.error("Auth error: " + authError.message);
    return;
  }
  // Removing the announcement of demo transactions for April 2025 - December 2026
  const { error: deleteError } = await supabase
    .from("transactions")
    .delete()
    .match({ user_id: user.id }) // To remove all demo data, comment out the lines below gte, lte
    .gte("date", "2025-04-01")
    .lte("date", "2026-12-31");

  if (deleteError) {
    toast.error(" Delete error");
    console.error(deleteError);
    return;
  }

  const payload = DEMO_TRANSACTIONS.map((t) => ({
    ...t,
    user_id: user.id,
  }));

  const { error } = await supabase
    .from("transactions")
    .insert(payload);

  if (error) {
    toast.error("Failed to insert demo transactions");
    console.error(error);
    return;
  }

  toast.success("Demo transactions inserted successfully");
}
