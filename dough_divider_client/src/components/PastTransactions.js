import TransactionRow from "./TransactionRow";
import "../styles/Homepage.css";

const PastTransactions = ({ completedTransactions }) => {
  return (
    <div className="past-transactions-wrapper">
      {completedTransactions.map((transaction, index) => (
        <TransactionRow transaction={transaction} key={index} />
      ))}
    </div>
  );
};

export default PastTransactions;
