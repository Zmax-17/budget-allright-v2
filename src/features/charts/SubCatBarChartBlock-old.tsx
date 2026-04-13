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

interface SubCatBarChartBlockProps {
  data: SubCategoryItem[];
}

export default function SubCatBarChartBlock({
  data,
}: SubCatBarChartBlockProps) {
  return (
    <div>
      <ResponsiveContainer
        width="40%"
        height={240}
      >
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sub_category" />
          <YAxis
            scale="log" // Logarithmic scale
            domain={[1, "auto"]} // From 1 to avoid log(0)
          />
          <Legend />
          <Tooltip />
          <Bar
            dataKey="amount"
            name="Withdraw"
            barSize={30}
            radius={[4, 4, 0, 0]}
            label={{ position: "top" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.sub_category ?? index}`}
                fill={entry.color || "#ccc"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
