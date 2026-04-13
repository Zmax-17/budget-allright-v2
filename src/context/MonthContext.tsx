import { format, startOfMonth } from "date-fns";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface MonthContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const MonthContext = createContext<
  MonthContextType | undefined
>(undefined);

interface MonthProviderProps {
  children: ReactNode;
}

export default function MonthProvider({
  children,
}: MonthProviderProps) {
  const [selectedMonth, setSelectedMonth] =
    useState<string>(() =>
      format(startOfMonth(new Date()), "yyyy-MM"),
    );
  const value = useMemo(
    () => ({ selectedMonth, setSelectedMonth }),
    [selectedMonth],
  );

  return (
    <MonthContext.Provider value={value}>
      {children}
    </MonthContext.Provider>
  );
}
export function useMonth(): MonthContextType {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error(
      "useMonth must be used within MonthProvider",
    );
  }
  return context;
}
