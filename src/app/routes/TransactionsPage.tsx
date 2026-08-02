import TransactionsTable from "../../features/transactions/ui/TransactionsTable";
import Modal from "../../components/Modal";

export default function Transactions() {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <Modal />
      <TransactionsTable />
    </div>
  );
}
