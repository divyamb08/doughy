import "../styles/LeaderModal.css";
// prettier-ignore
const PaymentStatusRow = ({ transaction }) => {
  const rowClass = "payment-status-row " + 
    (transaction.completed ? "completed-row" : 
      (transaction.card === "N/A" ? "waiting-row" : "rejected-row"));
  return (
    <div
      className={rowClass
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
