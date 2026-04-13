import { FaSpinner } from "react-icons/fa";

interface LoadingSpinnerProps {
  message?: string;
}
/**
 * Fullscreen loading indicator
 * @param message - text below the spinner (default "Loading...")
 */
export default function LoadingSpinner({
  message = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-inherit dark:bg-gray-900 text-gray-800 dark:text-white"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <FaSpinner
        className="animate-spin text-emerald-600 text-4xl mb-4"
        aria-hidden="true"
      />
      <p className="text-lg">{message}</p>
    </div>
  );
}
