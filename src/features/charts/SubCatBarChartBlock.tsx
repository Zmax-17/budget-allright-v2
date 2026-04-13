import { SubCategoryItem } from "@/entities/dashboard/ui-types";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface SubCatBarChartBlockProps {
  data: SubCategoryItem[];
}

export default function SubCatBarChartBlock({
  data,
}: SubCatBarChartBlockProps) {
  const { darkMode } = useTheme();

  return (
    <div>
      <ResponsiveContainer
        width="40%"
        height={240}
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            stroke={
              darkMode ? "rgba(209,250,229,0.1)" : "#e5e7eb"
            }
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="sub_category"
            stroke={darkMode ? "#D1FAE5" : "#374151"}
            tick={{
              fill: darkMode ? "#D1FAE5" : "#374151",
            }}
          />

          <YAxis
            scale="log"
            domain={[1, "auto"]}
            stroke={darkMode ? "#D1FAE5" : "#374151"}
            tick={{
              fill: darkMode ? "#D1FAE5" : "#374151",
            }}
            tickFormatter={(value: number) => `${value}`}
          />

          <Legend
            wrapperStyle={{
              color: darkMode ? "#fff" : "#111827",
            }}
          />

          <Tooltip
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

          <Bar
            dataKey="amount"
            name="Withdraw"
            barSize={30}
            radius={[4, 4, 0, 0]}
            label={{
              position: "top",
              fill: darkMode ? "#FCA5A5" : "#DC2626",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.sub_category ?? index}`}
                fill={entry.color || "#f87171"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
