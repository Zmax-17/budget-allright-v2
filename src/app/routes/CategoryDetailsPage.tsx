import { useNavigate, useParams } from "react-router-dom";

import { getCategoryColor } from "@/features/categories/categories.ts";
import { FiArrowLeft } from "react-icons/fi";
import { useTransactionsByCategory } from "../../features/transactions/model/useTransactionsByCategory.ts";
import { useTheme } from "@/context/ThemeContext.tsx";
import LoadingSpinner from "@/shared/ui/LoadingSpinner.tsx";

/**
 * Category Details Page
 * Displays a color-coded list of transactions in the selected category
 */
export default function CategoryDetailsPage() {
  const { darkMode } = useTheme();
  const theme = darkMode ? "dark" : "light";
  const navigate = useNavigate();

  const { category } = useParams<{ category: string }>();

  const {
    transactions = [],
    isLoading,
    error,
  } = useTransactionsByCategory(category || "");

  if (isLoading)
    return <LoadingSpinner message="Category loading..." />;

  if (!category) {
    return (
      <p className="text-red-600 text-center py-8">
        Category not found
      </p>
    );
  }
  if (error)
    return (
      <p className="text-center text-red-500">
        An error has occurred: {error.message}
      </p>
    );

  const categoryColor = getCategoryColor(category, theme); // Default to "Uncategorized" color if not found

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-gray-900">
      <button
        type="button"
        onClick={() => navigate("/transactions")}
        aria-label="Return to transaction list"
        className="bg-white dark:bg-gray-800 text-emerald-500 font-bold p-2 rounded-xl cursor-pointer 
  hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-700 dark:hover:text-white 
  focus:outline-2 focus:outline-offset-2 focus:outline-emerald-900 active:text-white active:bg-emerald-700 
  active:translate-y-0.5 transition-colors duration-200 inline-flex items-center "
      >
        <FiArrowLeft className="mr-2 text-lg" />
        Back to Transactions
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center ">
        Transactions in category:{" "}
        <span
          className="font-semibold"
          style={{ color: categoryColor }} // Inline style for category color
        >
          {category}
        </span>
      </h2>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          There are no transactions in this category for the
          selected period.
        </p>
      ) : (
        <ul
          role="list"
          className="space-y-4"
        >
          {transactions.map((t) => {
            const subCategoryColor = getCategoryColor(
              t.sub_category ?? "Uncategorized",
              theme,
            );

            return (
              <li
                key={t.id}
                role="listitem"
                style={{
                  backgroundColor: darkMode
                    ? `${subCategoryColor}15`
                    : `${subCategoryColor}20`, // Lightened background color for sub-category
                  borderLeft: `4px solid ${subCategoryColor}`, // Border color for sub-category
                }}
                className="p-4 rounded-lg shadow-sm  text-gray-800 dark:text-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">
                    {t.description}
                  </span>
                  <span
                    className={
                      t.type === "income"
                        ? "text-green-600 dark:text-green-400 text-xl font-bold"
                        : "text-red-600 dark:text-red-400 text-xl font-bold"
                    }
                  >
                    {t.amount} kr
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.date}
                </div>

                {t.sub_category && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t.sub_category}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
