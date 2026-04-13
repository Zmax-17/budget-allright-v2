import { format } from "date-fns";
import { useModal } from "../../../context/ModalContext";
import { Link } from "react-router-dom";
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
} from "react-icons/md";
import { useDelTransaction } from "../model/useDelTransaction";
import { Transaction } from "@/entities/transaction/types";
import React, { useCallback } from "react";

interface TransactionRowProps {
  transaction: Transaction;
}

function TransactionRow({
  transaction,
}: TransactionRowProps) {
  const { openModal } = useModal();
  const { isDeleting, delTransaction } =
    useDelTransaction();

  const {
    description,
    amount,
    main_category,
    // sub_category, // If need, change in the TransactionTable grid-cols-6 and below
    date,
    type,
  } = transaction;

  const handleEdit = useCallback(() => {
    openModal("edit-transaction", transaction);
  }, [openModal, transaction]);

  const handleDelete = useCallback(() => {
    openModal("delete-transaction", {
      title: `Delete transaction "${description}"?`,
      description: "This action cannot be undone.",
      onConfirm: () => delTransaction(transaction.id),
      isDeleting,
    });
  }, [
    openModal,
    description,
    transaction.id,
    delTransaction,
    isDeleting,
  ]);

  return (
    <div
      // Change to grid-cols-6 if sub category needed
      className="
       group grid grid-cols-5 gap-x-[2.4rem] gap-y-[2rem] items-center
        px-[2.4rem] py-[1.6rem]
        border-b border-emerald-200 dark:border-gray-800
        hover:bg-emerald-50 dark:hover:bg-emerald-900/20
        transition-colors duration-150
        text-emerald-950 dark:text-white
        text-base 
      "
    >
      {/* Transaction by category link */}
      <div>
        <Link
          to={`/transactions/category/${main_category}`}
          className="
            font-medium
            text-emerald-700 dark:text-emerald-400
            hover:text-emerald-900 group-hover:text-emerald-900 dark:hover:text-emerald-300  dark:group-hover:text-emerald-300
            underline underline-offset-2
            transition-colors duration-200 
          "
        >
          {main_category}
        </Link>
      </div>

      <div>
        <span
          className={
            type === "income"
              ? "text-green-600 dark:text-green-400 font-semibold"
              : "text-red-600 dark:text-red-400 font-semibold"
          }
        >
          {amount} kr
        </span>
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        {date ? format(new Date(date), "dd.MM.yyyy") : "-"}
      </div>
      <div className="truncate text-gray-700 dark:text-gray-300 group-hover:text-emerald-900  dark:group-hover:text-emerald-300">
        {description}
      </div>
      {/* // If needed, uncomment line below and change
      grid-cols-6 in TransactionTable and in this table */}
      {/* <div>{sub_category}</div> */}
      <div className="flex items-center gap-2">
        <button
          className="
            p-2
            rounded-md
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            transition-colors
          "
          onClick={handleEdit}
        >
          <MdOutlineModeEdit className="text-lg" />
        </button>

        <button
          className="
            p-2
            rounded-md
            bg-red-400
            hover:bg-red-600
            text-white
            transition-colors
            dark:bg-red-500
          "
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <MdDeleteOutline className="text-lg" />
        </button>
      </div>
    </div>
  );
}
export default React.memo(TransactionRow);
