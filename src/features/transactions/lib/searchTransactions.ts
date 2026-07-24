import { Transaction } from "@/entities/transaction/types";
export function searchTransactions(
  transactions: Transaction[],
  query: string,
): Transaction[] {
  const q = query.trim().toLowerCase();
  if (!q) return transactions ?? [];

  return transactions.filter((tx) => {
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .format(new Date(tx.date))
      .replace(/\//g, ".");

    const searchableText = [
      tx.description?.toLowerCase() || "",
      tx.main_category?.toLowerCase() || "",
      tx.sub_category?.toLowerCase() || "",
      tx.amount?.toString() || "",
      tx.date || "", // 2025-09-08
      formattedDate, // 08.09.2025
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(q);
  });
}
