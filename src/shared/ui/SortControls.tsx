import {
  SortConfig,
  SortDirection,
  SortKey,
} from "@/entities/dashboard/types";
import { FaSort } from "react-icons/fa";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

interface SortControlsProps {
  sortConfig: SortConfig;
  setSortConfig: React.Dispatch<
    React.SetStateAction<SortConfig>
  >;
}
/**
 * Sorting panel for tables/graphs
 * Allows you to toggle sorting by income/expenses
 */
export default function SortControls({
  sortConfig,
  setSortConfig,
}: SortControlsProps) {
  const sortButtons = [
    {
      icon: <FaSort />,
      title: "Default",
      config: { key: null, direction: null } as SortConfig,
      isActive: sortConfig.key === null,
    },
    {
      icon: <HiArrowUp />,
      title: "Sort Expenses Asc",
      config: {
        key: "withdraw" as SortKey,
        direction: "asc" as SortDirection,
      },
      isActive:
        sortConfig.key === "withdraw" &&
        sortConfig.direction === "asc",
    },
    {
      icon: <HiArrowDown />,
      title: "Sort Expenses Desc",
      config: {
        key: "withdraw" as SortKey,
        direction: "desc" as SortDirection,
      },
      isActive:
        sortConfig.key === "withdraw" &&
        sortConfig.direction === "desc",
    },
  ];

  return (
    <div className="w-fit sm:w-fit rounded-sm flex gap-2 m-2 border border-emerald-100 flex-wrap">
      {sortButtons.map(
        ({ icon, title, config, isActive }, index) => (
          <button
            key={index}
            onClick={() => setSortConfig(config)}
            aria-label={title}
            className={`p-2 rounded-sm cursor-pointer disabled:cursor-not-allowed hover:bg-emerald-800 active:text-white transition duration-200 ${
              isActive
                ? "bg-emerald-600 text-white"
                : "bg-transparent text-emerald-600"
            }`}
          >
            {icon}
          </button>
        ),
      )}
    </div>
  );
}
