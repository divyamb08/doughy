import React from "react";
import "../styles/PastTransaction.css";

const PastTransactions = ({
  completedTransactions,
  setSelectedTransaction,
}) => {
  const parseDatetimeString = (datetime) => {
    let [date, time] = datetime.split(", ");
    date = new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });

    return `${date} @ ${time}`;
  };

  return (
    <div className="past-transactions">
      {completedTransactions.map((transaction, index) => (
        <div
          key={index}
          className="transaction-card"
          onClick={() => setSelectedTransaction(transaction)}
        >
          <div className="expense-name">{transaction.note}</div>
          <hr></hr>
          <div className="amount">${transaction.amount.toFixed(2)}</div>
          <div className="date">
            {parseDatetimeString(transaction.datetime)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastTransactions;
