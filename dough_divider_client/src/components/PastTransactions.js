import React from "react";
import "../styles/PastTransaction.css";

const PastTransactions = ({
  completedTransactions,
  setSelectedTransaction,
}) => {
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
            {new Date(transaction.date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastTransactions;
