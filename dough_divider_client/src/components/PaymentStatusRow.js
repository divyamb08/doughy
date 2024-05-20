import "../styles/LeaderModal.css";

const PaymentStatusRow = ({ transaction }) => {
  return (
    <div
      className={
        "payment-status-row" + (transaction.completed ? " completed-row" : "")
      }
    >
      <div>Member: {transaction.member}</div>
      <div>Amount: {transaction.amount}</div>
      <div>Completed: {transaction.completed.toString()}</div>
      <div>Card: {transaction.card}</div>
    </div>
  );
};

export default PaymentStatusRow;
