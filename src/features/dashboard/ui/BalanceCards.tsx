import { format, isValid } from "date-fns";
import Card from "./Card";

export interface BalanceCardsProps {
  /** Current balance in NOK */
  balance: number;
  /** Income for selected month */
  income: number;
  /** Withdraw for selected month */
  withdraw: number;
  /** Month in format yyyy-MM */
  selectedMonth: string;
}

export default function BalanceCards({
  balance,
  income,
  withdraw,
  selectedMonth,
}: BalanceCardsProps) {
  const date = new Date(selectedMonth);

  const formattedMonth = isValid(date)
    ? format(date, "MMMM")
    : "Invalid date";

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="container-sm flex flex-wrap justify-center gap-4">
      <div className="w-full flex justify-center mb-6">
        <h3
          className="
              text-2xl font-bold text-center text-white
              p-4 rounded-xl
              bg-gradient-to-r
              from-green-300 via-emerald-500 to-emerald-800
              dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-900
              shadow-lg dark:shadow-emerald-900/30
            "
        >
          {formattedMonth}
        </h3>
      </div>

      <Card
        type="balance"
        title="Balance"
        value={formatCurrency(balance)}
      />

      <Card
        type="income"
        title="Income"
        value={formatCurrency(income)}
      />

      <Card
        type="withdraw"
        title="Withdraw"
        value={formatCurrency(withdraw)}
      />
    </div>
  );
}
