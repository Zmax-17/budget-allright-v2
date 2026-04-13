import { LineItem } from "@/entities/dashboard/ui-types";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const formatDate = (date: string) =>
  format(parseISO(date), "dd.MM.yyyy");

type LineChartBlockProps = {
  data: LineItem[];
};

export default function LineChartBlock({
  data,
}: LineChartBlockProps) {
  const { darkMode } = useTheme();

  const axisColor = darkMode ? "#D1FAE5" : "#374151";
  const gridColor = darkMode
    ? "rgba(209,250,229,0.1)"
    : "#e5e7eb";

  return (
    <ResponsiveContainer
      width="60%"
      height={240}
    >
      <LineChart data={data}>
        <CartesianGrid
          stroke={gridColor}
          strokeDasharray="3 3"
        />

        <Line
          type="monotone"
          dataKey="income"
          stroke="#4ade80"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="withdraw"
          stroke="#f87171"
          strokeWidth={2}
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke={axisColor}
          tick={{ fill: axisColor }}
        />

        <YAxis
          stroke={axisColor}
          tick={{ fill: axisColor }}
        />

        <Legend />

        <Tooltip
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: darkMode
              ? "#065F46"
              : "#f3f4f6",
            borderRadius: 8,
            border: "none",
          }}
          labelStyle={{
            color: darkMode ? "#fff" : "#111827",
          }}
          itemStyle={{
            color: darkMode ? "#fff" : "#111827",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
