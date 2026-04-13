import { TransactionCreate } from "@/entities/transaction/types";

/**
 * Demo transactions are an array of objects that can be inserted directly into the database.
 * (They correspond to TransactionCreate, but without id, created_at, etc.)
 */
export type DemoTransaction = TransactionCreate;
/**
 * A ready-made array of all demo transactions for all years/quarters
 */
export type DemoTransactions = readonly DemoTransaction[];
