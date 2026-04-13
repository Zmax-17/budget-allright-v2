import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { Transaction } from "@/entities/transaction/types";
import { SavingsGoal } from "@/entities/savings/types";

// General type for all confirm-delete modals
type ConfirmDeleteData = {
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
};

// The only place where new modals are added
interface ModalDataMap {
  // Transactions
  "add-transaction": undefined;
  "edit-transaction": Transaction;
  "delete-transaction": ConfirmDeleteData;

  // Savings Goals
  "add-savings-goal": undefined;
  "edit-savings-goal": SavingsGoal;
  "delete-savings-goal": ConfirmDeleteData;

  // Add money to goal
  "add-money-to-goal": SavingsGoal;

  // Withdraw money from reached goal
  "confirm-complete-goal": {
    title: string;
    description?: string;
    confirmText?: string;
    onConfirm: () => void;
    isDeleting?: boolean;
  };
}

type ModalName = keyof ModalDataMap;

type ModalState =
  | { isOpen: false; name: null; data: null }
  | {
      [K in ModalName]: {
        isOpen: true;
        name: K;
        data: ModalDataMap[K];
      };
    }[ModalName];

interface ModalContextType {
  modal: ModalState;
  openModal: <K extends ModalName>(
    name: K,
    data?: ModalDataMap[K], // data is optional if undefined
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<
  ModalContextType | undefined
>(undefined);

export default function ModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    name: null,
    data: null,
  });

  const openModal = useCallback(
    <K extends ModalName>(
      name: K,
      data?: ModalDataMap[K],
    ) => {
      // We use casting to any or ModalState only here, inside the setter,
      // to "calm down" the complex TS type allocation logic.
      // Externally (for the function user), everything will remain strongly typed.
      setModal({
        isOpen: true,
        name,
        data: (data ?? null) as any, // only here, inside
      });
    },
    [],
  );

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, name: null, data: null });
  }, []);

  return (
    <ModalContext.Provider
      value={{ modal, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useModal must be used within ModalProvider",
    );
  }
  return context;
}
