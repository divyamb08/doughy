const TransactionRow = ({ transaction }) => {
  return (
    <div className="transaction-wrapper">
      <div className="transaction-header">{transaction.note}</div>
      <div className="transaction-data">
        Sent By: <i>{transaction.leader}</i>
      </div>
      <div className="transaction-data">
        Amount: <i>${transaction.amount}</i>
      </div>
    </div>
  );
};

export default TransactionRow;
