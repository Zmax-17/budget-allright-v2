import { SubmitHandler, useForm } from "react-hook-form";
import { useAddTransaction } from "../model/useAddTransaction";
import { useUpdateTransaction } from "../model/useUpdateTransaction";
import { useModal } from "../../../context/ModalContext";
import { useEffect } from "react";
import { format } from "date-fns";

import {
  categories,
  MainCategory,
  SubCategory,
} from "../../categories/categories";

import { Transaction } from "@/entities/transaction/types";

interface TransactionsFormProps {
  transaction?: Transaction;
}

type TransactionType = "income" | "withdraw";

interface TransactionFormData {
  amount?: number;
  description: string;
  main_category?: MainCategory;
  sub_category?: SubCategory;
  date: string;
  type?: TransactionType;
}

export default function TransactionForm({
  transaction,
}: TransactionsFormProps) {
  const { closeModal } = useModal();
  const isEdit = Boolean(transaction?.id);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: transaction?.amount,
      description: transaction?.description ?? "",
      main_category: transaction?.main_category as
        | MainCategory
        | undefined,
      sub_category: transaction?.sub_category as
        | SubCategory
        | undefined,
      date: transaction?.date
        ? format(new Date(transaction.date), "yyyy-MM-dd")
        : "",
      type: transaction?.type as
        | TransactionType
        | undefined,
    },
  });

  useEffect(() => {
    if (!transaction?.id) return;

    reset({
      amount: transaction.amount,
      description: transaction.description ?? "",
      main_category: transaction.main_category as
        | MainCategory
        | undefined,
      sub_category: transaction.sub_category as
        | SubCategory
        | undefined,
      date: transaction.date
        ? format(new Date(transaction.date), "yyyy-MM-dd")
        : "",
      type: transaction.type as TransactionType | undefined,
    });
  }, [transaction, reset]);

  const mainCategory = watch("main_category");
  const subCategories: readonly SubCategory[] = mainCategory
    ? (categories[mainCategory]?.sub ?? [])
    : [];

  const { isAdding, addTransaction } = useAddTransaction();
  const { isUpdating, updateTransaction } =
    useUpdateTransaction();

  const onSubmit: SubmitHandler<TransactionFormData> = (
    data,
  ) => {
    if (isEdit && transaction?.id) {
      updateTransaction({
        id: transaction.id,
        ...data,
        amount: Number(data.amount),
      });
    } else {
      addTransaction({
        ...data,
        amount: Number(data.amount),
      });
    }
    closeModal();
  };

  const labelCls =
    "block text-xs sm:text-sm lg:text-base min-[3840px]:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5 lg:mb-2";
  const inputCls =
    "w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 sm:py-2.5 lg:py-3 min-[3840px]:py-4 text-sm sm:text-base lg:text-lg min-[3840px]:text-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[42px] sm:min-h-[44px] lg:min-h-[48px] min-[3840px]:min-h-[56px]";

  return (
    <form
      role="form"
      aria-labelledby="transaction-form-title"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-gray-900 shadow-lg w-full rounded-xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 min-[3840px]:p-14 max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl min-[2560px]:max-w-[1100px] min-[3840px]:max-w-[1400px]"
    >
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {isEdit ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        <div className="md:col-span-2">
          <label className={labelCls}>Title</label>
          <input
            {...register("description", {
              required: "Title required",
            })}
            className={inputCls}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register("amount", {
              required: "Amount required",
              valueAsNumber: true,
              min: {
                value: 0.01,
                message: "Amount must be positive",
              },
            })}
            className={inputCls}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Type</label>
          <select
            {...register("type", {
              required: "Select type",
            })}
            className={inputCls}
          >
            <option value="">-- Select --</option>
            <option value="income">Income</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Main Category</label>
          <select
            {...register("main_category", {
              required: "Select main category",
            })}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setValue(
                  "main_category",
                  value as MainCategory,
                );
                setValue("sub_category", undefined);
              }
            }}
            className={inputCls}
          >
            <option value="">-- Select --</option>
            {Object.keys(categories).map((main) => (
              <option
                key={main}
                value={main}
              >
                {main}
              </option>
            ))}
          </select>
        </div>

        {subCategories.length > 0 && (
          <div>
            <label className={labelCls}>Sub Category</label>
            <select
              {...register("sub_category")}
              className={inputCls}
            >
              <option value="">-- Select --</option>
              {subCategories.map((sub) => (
                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className={labelCls}>Date</label>
          <input
            type="date"
            {...register("date", {
              required: "Date required",
            })}
            className={inputCls}
          />
        </div>

        <div className="md:col-span-2 flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className="flex-1 py-3 rounded-md font-semibold transition text-white
              bg-emerald-600 hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600
              disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAdding
              ? "Adding..."
              : isUpdating
                ? "Editing..."
                : isEdit
                  ? "Edit"
                  : "Add"}
          </button>

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
