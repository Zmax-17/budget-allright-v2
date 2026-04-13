import {
  Transaction,
  TransactionCreate,
  TransactionFilter,
  TransactionUpdate,
} from "@/entities/transaction/types";
import supabase from "@/shared/services/supabase";

/**
 * Gets all transactions for the current user, sorted by date (newest on top)
 * @param user_id - UUID of the authenticated user
 * @throws Error if user_id is not specified or a request error occurs
 */
export async function getAllTransactions(
  user_id: string | undefined,
): Promise<Transaction[]> {
  if (!user_id) throw new Error("User ID is required");
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: false });

  if (error)
    throw new Error(
      `Get transactions failed: ${error.message ?? "Unknown error"}${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  return data ?? [];
}

export async function createTransaction(
  transaction: TransactionCreate,
  user_id: string | undefined,
): Promise<Transaction> {
  if (!user_id) throw new Error("User ID is required");

  const requiredFields = [
    "description",
    "amount",
    "main_category",
    "date",
    "type",
  ] as const;
  const missingFields = requiredFields.filter(
    (field) => !transaction[field],
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(", ")}`,
    );
  }

  const validatedTransaction = {
    ...transaction,
    user_id,
    amount: Number(transaction.amount), // Convert to number
    date:
      transaction.date ||
      new Date().toISOString().split("T")[0], // Sets the current date if not specified.
  };

  const { error, data } = await supabase
    .from("transactions")
    .insert(validatedTransaction) // Simplify to the object
    .select()
    .single();

  if (error)
    throw new Error("Create error: " + error.message);
  return data!;
}

/**
 * Updates an existing transaction for the current user
 * @param newTransaction - Object containing fields to update (must include 'id')
 * @param user_id - UUID of the authenticated user
 * @throws Error if user_id or id is missing, or update fails
 */
export async function updateTransactionApi(
  newTransaction: TransactionUpdate,
  user_id: string | undefined,
): Promise<Transaction> {
  if (!user_id) throw new Error("User ID is required");

  const { id, ...updateData } = newTransaction;
  if (!id) throw new Error("Transaction ID is required");

  const { error, data } = await supabase
    .from("transactions")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error)
    throw new Error(
      `Update transaction ${id} failed: ${error.message ?? "Unknown error"} ${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  if (!data)
    throw new Error("No data returned after update");

  return data;
}

/**
 * Deletes a transaction by ID if it belongs to the current user
 * @param id - UUID of the transaction to delete
 * @param user_id - UUID of the authenticated user
 * @returns Object with count of deleted rows (usually 1 or 0)
 * @throws Error if user_id is missing or deletion fails
 */
export async function deleteTransaction(
  id: string,
  user_id: string | undefined,
): Promise<{ count: number }> {
  if (!user_id) throw new Error("User ID is required");

  const { error, count } = await supabase
    .from("transactions")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user_id); // Avoid accidentally deleting someone else's transaction

  if (error)
    throw new Error(
      `Delete transaction ${id} failed: ${error.message ?? "Unknown error"} ${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );
  return { count };
}

/**
 * Gets filtered data for the current user.
 * @param filter - Filter object (currently only type) and sort (type, sortBy, sortDirection)
 * @param user_id - UUID of the authorized user
 * @returns Array of transactions sorted by date (newest first)
 * @throws Error if user_id is missing or a request error occurs
 */
export async function getTransactionsByFilter(
  filter: TransactionFilter = {},
  user_id?: string,
): Promise<Transaction[]> {
  if (!user_id) throw new Error("User ID is required");

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id);

  if (filter.type && filter.type !== "all") {
    query = query.eq("type", filter.type);
  }

  // Sorting (default - by date descending)
  const sortField = filter.sort?.field ?? "date";
  const sortDirection = filter.sort?.direction ?? "desc";
  const ascending = sortDirection === "asc";

  query = query.order(sortField, { ascending });

  const { data, error } = await query;

  if (error)
    throw new Error(
      `Filtered transactions error: ${error.message ?? "Unknown error"} ${
        error.code ? ` (code: ${error.code})` : ""
      }`,
    );

  return data ?? [];
}

export async function getTransactionsByCategory(
  category: string,
  user_id: string | undefined,
): Promise<Transaction[]> {
  if (!user_id) throw new Error("User ID is required");

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .eq("main_category", category)
    .order("date", { ascending: false });

  if (error)
    throw new Error(
      `Fetch transactions by category "${category}" failed: ${
        error.message ?? "Unknown error"
      }`,
    );
  return data ?? [];
}
