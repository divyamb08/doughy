const TransactionDetailCard = ({ transaction, onClose }) => {
  if (!transaction) return null;

  // Copied from 'PastTransacions.js'
  const parseDatetimeString = (datetime) => {
    let [date, time] = datetime.split(", ");
    date = new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });

    return `${date} @ ${time}`;
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Transaction Detail</h2>
        <p>Leader: {transaction.leader}</p>
        <p>Member: {transaction.member}</p>
        <p>Amount: ${transaction.amount}</p>
        <p>Note: {transaction.note || "No additional notes"}</p>
        <p>Date: {parseDatetimeString(transaction.datetime)}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default TransactionDetailCard;
