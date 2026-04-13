import { SubmitHandler, useForm } from "react-hook-form";
import { useAddGoal } from "../../model/useAddGoal";
import { useUpdateGoal } from "../../model/useUpdateGoal";
import { useModal } from "@/context/ModalContext";

import {
  SavingsGoalCreate,
  SavingsGoalRow,
} from "@/entities/savings/types";
import clsx from "clsx";
import toast from "react-hot-toast";

export default function SavingsGoalForm({
  goal,
}: {
  goal?: SavingsGoalRow;
}) {
  const { closeModal } = useModal();
  const isEdit = !!goal?.id;

  const { isAdding, addGoal } = useAddGoal();
  const { isUpdating, updateGoal } = useUpdateGoal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted, isDirty },
    watch,
  } = useForm<SavingsGoalCreate>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: goal
      ? {
          name: goal.name,
          target_amount: goal.target_amount,
          description: goal.description ?? "",
          color: goal.color ?? "",
          target_date: goal.target_date ?? "",
        }
      : {
          name: "",
          target_amount: 0,
          description: "",
          color: "",
          target_date: "",
        },
  });

  const selectedColor = watch("color");

  const GOAL_COLORS = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ef4444", // red
    "#14b8a6", // teal
  ] as const;

  const onSubmit: SubmitHandler<SavingsGoalCreate> = (
    data,
  ) => {
    if (isEdit && !isDirty) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }
    if (isEdit && goal) {
      updateGoal({ id: goal.id, ...data });
    } else {
      addGoal(data);
    }
    closeModal();
  };

  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 sm:py-2.5 lg:py-3 min-[3840px]:py-4 " +
    "text-sm sm:text-base lg:text-lg min-[3840px]:text-xl " +
    "bg-white dark:bg-gray-800 text-black dark:text-white " +
    "placeholder-gray-400 dark:placeholder-gray-500 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 " +
    "min-h-[42px] sm:min-h-[44px] lg:min-h-[48px] min-[3840px]:min-h-[56px]";

  const labelCls =
    "block text-xs sm:text-sm lg:text-base min-[3840px]:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5 lg:mb-2";

  return (
    <form
      role="form"
      aria-labelledby="savings-goal-form-title"
      onSubmit={handleSubmit(onSubmit)}
      className="
        bg-white dark:bg-gray-900
        shadow-lg w-full rounded-xl sm:rounded-2xl
        max-h-[85vh] overflow-y-auto
        p-4 sm:p-6 lg:p-8 xl:p-10 min-[3840px]:p-14
        max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl
        min-[2560px]:max-w-[1100px] min-[3840px]:max-w-[1400px]
      "
    >
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {isEdit ? "Edit Goal" : "Add Goal"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className={labelCls}>Name *</label>
          <input
            {...register("name", { required: "Required" })}
            className={inputCls}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        {/* Target Amount */}
        <div>
          <label className={labelCls}>
            Target Amount *
          </label>
          <input
            type="number"
            step="0.01"
            min={1}
            {...register("target_amount", {
              required: "Required",
              valueAsNumber: true,
              validate: (value) =>
                (!isNaN(value) && value > 0) ||
                "Must be a positive number",
            })}
            className={clsx(
              inputCls,
              errors.name &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
            )}
          />
          {errors.target_amount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.target_amount.message}
            </p>
          )}
        </div>
        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            {...register("description")}
            className={inputCls}
          />
        </div>

        {/* Color */}
        <div className="md:col-span-2">
          <label className={labelCls}>Color</label>
          <div className="flex gap-3">
            {GOAL_COLORS.map((c) => (
              <label
                key={c}
                className={`${labelCls} + cursor-pointer`}
              >
                <input
                  type="radio"
                  value={c}
                  {...register("color")}
                  className="sr-only"
                />
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full border-2",
                    selectedColor === c
                      ? "border-gray-900 dark:border-white"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: c }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className={labelCls}>Target Date</label>
          <input
            type="date"
            {...register("target_date", {
              required: "Required",
            })}
            title={
              !isValid ? "Fill all required fields" : ""
            }
            className={clsx(
              inputCls,
              errors.target_date &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
            )}
          />
          {errors.target_date && (
            <p className="text-red-500 text-xs mt-1">
              {errors.target_date.message}
            </p>
          )}
        </div>

        {isSubmitted && !isValid && (
          <p className="text-red-500 text-sm md:col-span-2">
            Please fill all required fields
          </p>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-3 pt-2">
          {/* Submit */}
          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className={clsx(
              "flex-1 py-3 rounded-md font-semibold transition text-white",
              isAdding || isUpdating
                ? "opacity-70 bg-emerald-400 cursor-not-allowed"
                : isEdit && !isDirty
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600",
            )}
          >
            {isAdding
              ? "Adding..."
              : isUpdating
                ? "Saving..."
                : isEdit
                  ? isDirty
                    ? "Save changes"
                    : "No changes"
                  : "Add"}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={closeModal}
            className="
                flex-1 py-3 rounded-md font-semibold transition
                text-gray-700 dark:text-gray-300
                border border-gray-300 dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-800
                cursor-pointer
              "
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
