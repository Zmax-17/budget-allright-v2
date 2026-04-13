import { ReactNode } from "react";
import clsx from "clsx";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-xl",
        className,
      )}
    >
      {icon && <div className="mb-4 text-5xl">{icon}</div>}
      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
