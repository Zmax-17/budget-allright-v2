import { FiSearch, FiX } from "react-icons/fi";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search by description, category...",
  className = "",
  disabled = false,
}: SearchInputProps) {
  return (
    <div
      className={`relative w-full max-w-xs ${className}`}
    >
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        size={16}
      />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="
    absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
