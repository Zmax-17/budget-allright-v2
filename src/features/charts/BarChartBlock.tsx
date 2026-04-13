import { BarItem } from "../../entities/dashboard/ui-types";
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
import { useTheme } from "../../context/ThemeContext";

interface BarChartBlockProps {
  data: BarItem[];
  onCategoryClick?: (categoryName: string) => void;
}

export default function BarChartBlock({
  data,
  onCategoryClick,
}: BarChartBlockProps) {
  const { darkMode } = useTheme();

  const handleBarClick = (entry: { payload?: BarItem }) => {
    if (entry.payload?.name) {
      onCategoryClick?.(entry.payload.name);
    }
  };

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={340}
      >
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid
            stroke={
              darkMode ? "rgba(209,250,229,0.1)" : "#e5e7eb"
            }
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="name"
            angle={-15}
            textAnchor="end"
            interval={0}
            height={60}
            stroke={darkMode ? "#D1FAE5" : "#374151"}
            tick={{
              fill: darkMode ? "#D1FAE5" : "#374151",
            }}
          />
          <YAxis
            scale="log"
            domain={[1, "auto"]}
            allowDataOverflow
            tickFormatter={(value) => `${value}`}
            stroke={darkMode ? "#D1FAE5" : "#374151"}
            tick={{
              fill: darkMode ? "#D1FAE5" : "#374151",
            }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            iconSize={0}
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
            dataKey="income"
            name="Income"
            barSize={30}
            radius={[4, 4, 0, 0]}
            label={{
              position: "top",
              fill: darkMode ? "#D1FAE5" : "#4B5563",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`income-${index}`}
                fill={entry.color || "#2ECC71"}
              />
            ))}
          </Bar>

          <Bar
            dataKey="withdraw"
            name="Withdraw"
            barSize={30}
            radius={[4, 4, 0, 0]}
            label={{ position: "top" }}
            cursor="pointer"
            onClick={handleBarClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={`withdraw-${entry.name}-${index}`}
                fill={entry.color || "#f87171"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
