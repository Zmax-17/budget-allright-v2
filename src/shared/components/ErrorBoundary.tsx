import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

// Fallback component displayed when an error occurs
function ErrorFallback({
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
        Oops! Something went wrong
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center">
        Something went wrong. Please try again later.
      </p>

      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={[location.pathname, location.search]}
      onReset={() => {
        // Optionally reset global state here if needed
        console.error("Error boundary reset");
      }}
      onError={(error, info) => {
        // Log the error to Sentry / LogRocket / show toast
        console.error(
          "Caught an error:",
          error,
          info.componentStack,
        );
        toast.error("An error occurred. Please try again.");
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
