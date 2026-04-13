import { useState, useRef, useEffect } from "react";

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (e: { target: { value: string } }) => void;
  min?: string; // YYYY-MM
  max?: string; // YYYY-MM
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface ParsedMonth {
  year: number;
  month: number; // 0-11
}

export default function MonthPicker({
  value,
  onChange,
  min,
  max,
}: MonthPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const parseMonth = (str?: string): ParsedMonth | null => {
    if (!str) return null;
    const [y, m] = str.split("-").map(Number);
    return { year: y, month: m - 1 };
  };

  const minDate = parseMonth(min);
  const maxDate = parseMonth(max);

  const clamp = (y: number, m: number) => {
    if (
      minDate &&
      (y < minDate.year ||
        (y === minDate.year && m < minDate.month))
    ) {
      return { y: minDate.year, m: minDate.month };
    }
    if (
      maxDate &&
      (y > maxDate.year ||
        (y === maxDate.year && m > maxDate.month))
    ) {
      return { y: maxDate.year, m: maxDate.month };
    }
    return { y, m };
  };

  const getSelected = () => {
    if (!value)
      return {
        y: new Date().getFullYear(),
        m: new Date().getMonth(),
      };
    const [y, m] = value.split("-").map(Number);
    return { y, m: m - 1 };
  };

  const { y: initialYear, m: initialMonth } = clamp(
    getSelected().y,
    getSelected().m,
  );

  const [year, setYear] = useState<number>(initialYear);
  const [month, setMonth] = useState<number>(initialMonth);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;
    const [y, m] = value.split("-").map(Number);
    const { y: newY, m: newM } = clamp(y, m - 1);
    setYear(newY);
    setMonth(newM);
  }, [value]);

  //  Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  // Checking the accessibility of arrows
  const canGoPrev = () => {
    const { y, m } = clamp(year, month - 1);
    return !(y === year && m === month);
  };
  const canGoNext = () => {
    const { y, m } = clamp(year, month + 1);
    return !(y === year && m === month);
  };

  const incrementMonth = (delta: number) => {
    if (delta === -1 && !canGoPrev()) return;
    if (delta === 1 && !canGoNext()) return;

    let newMonth = month + delta;
    let newYear = year;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    const { y, m } = clamp(newYear, newMonth);
    setYear(y);
    setMonth(m);
    const formatted = `${y}-${String(m + 1).padStart(2, "0")}`;
    onChange({ target: { value: formatted } });
  };

  const handleMonthClick = (index: number) => {
    const { y, m } = clamp(year, index);
    setYear(y);
    setMonth(m);
    const formatted = `${y}-${String(m + 1).padStart(2, "0")}`;
    onChange({ target: { value: formatted } });
    setOpen(false);
  };

  const displayValue = `${months[month]} ${year}`;

  return (
    <div
      className="relative w-64"
      ref={ref}
    >
      {/* Input with integrated arrows */}
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500">
        <button
          onClick={() => incrementMonth(-1)}
          disabled={!canGoPrev()}
          className={`px-3 py-2 rounded-l-md transition ${
            canGoPrev()
              ? "hover:bg-gray-100 dark:hover:bg-gray-800"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          ←
        </button>

        <input
          readOnly
          id="month"
          value={displayValue}
          onClick={() => setOpen((prev) => !prev)}
          className="flex-1 text-center py-2 bg-transparent dark:text-white cursor-pointer outline-none"
        />

        <button
          onClick={() => incrementMonth(1)}
          disabled={!canGoNext()}
          className={`px-3 py-2 rounded-r-md transition ${
            canGoNext()
              ? "hover:bg-gray-100 dark:hover:bg-gray-800"
              : "opacity-40 cursor-not-allowed"
          }`}
        >
          →
        </button>
      </div>

      {/* Month selection popup */}
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-3">
            <button
              disabled={
                year <= (minDate?.year ?? -Infinity)
              }
              onClick={() => {
                if (year > (minDate?.year ?? -Infinity))
                  setYear(year - 1);
              }}
              className={`px-2 py-1 rounded ${
                year > (minDate?.year ?? -Infinity)
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              ←
            </button>

            <span className="font-medium text-gray-900 dark:text-white">
              {year}
            </span>

            <button
              disabled={year >= (maxDate?.year ?? Infinity)}
              onClick={() => {
                if (year < (maxDate?.year ?? Infinity))
                  setYear(year + 1);
              }}
              className={`px-2 py-1 rounded ${
                year < (maxDate?.year ?? Infinity)
                  ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((m, idx) => {
              const disabled = isDisabled(year, idx);
              const isSelected = idx === month;
              return (
                <button
                  key={m}
                  disabled={disabled}
                  onClick={() => handleMonthClick(idx)}
                  className={`py-2 text-sm rounded transition ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : isSelected
                        ? "bg-emerald-500 text-white dark:bg-emerald-700"
                        : "hover:bg-gray-100 dark:hover:bg-emerald-400"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  function isDisabled(y: number, m: number) {
    if (minDate) {
      if (y < minDate.year) return true;
      if (y === minDate.year && m < minDate.month)
        return true;
    }
    if (maxDate) {
      if (y > maxDate.year) return true;
      if (y === maxDate.year && m > maxDate.month)
        return true;
    }
    return false;
  }
}
