import {
  parse,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";

/**
 * Returns start and end date of the month in "yyyy-MM-dd" format
 * Example: "2025-05" → { fromDate: "2025-05-01", toDate: "2025-05-31" }
 */
export function getMonthDateRange(selectedMonth: string) {
  const parsedDate = parse(
    selectedMonth,
    "yyyy-MM",
    new Date(),
  );
  const fromDate = format(
    startOfMonth(parsedDate),
    "yyyy-MM-dd",
  );
  const toDate = format(
    endOfMonth(parsedDate),
    "yyyy-MM-dd",
  );

  return { fromDate, toDate };
}
