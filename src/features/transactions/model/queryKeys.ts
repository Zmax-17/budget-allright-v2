import { TransactionFilter } from "@/entities/transaction/types";

export const transactionsKeys = {
  /** Base key used by mutations and the general list */
  all: (userId?: string) =>
    ["transactions", userId] as const,

  /** Key with filter used in useTransactionsByFilter and table*/
  byFilter: (
    userId?: string,
    filter: TransactionFilter = {},
  ) =>
    [
      ...transactionsKeys.all(userId),
      "byFilter",
      filter,
    ] as const,
} as const;
