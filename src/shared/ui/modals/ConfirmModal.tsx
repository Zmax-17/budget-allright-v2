import { useModal } from "@/context/ModalContext";

type ConfirmModalProps = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "danger" | "success";
};

export default function ConfirmModal({
  title,
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "danger",
}: ConfirmModalProps) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
      : "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400";

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">
        {title}
      </h2>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {description}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={closeModal}
          className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                     font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition
                     text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {cancelText}
        </button>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-xl text-white font-medium transition cursor-pointer disabled:cursor-not-allowed ${confirmButtonClass}`}
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </div>
  );
}
