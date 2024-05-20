const MemberStatusSubmodal = ({ receivedTransaction, setActiveScreen }) => {
  return (
    <>
      <div className="modal-title">
        Transaction Request From: '{receivedTransaction.leader}'
      </div>
      <div>
        <div>Expense: ${receivedTransaction.amount}</div>
        <div>Sender Note: {receivedTransaction.note}</div>
      </div>
      <button onClick={() => setActiveScreen("payment")}>Accept</button>
    </>
  );
};

export default MemberStatusSubmodal;
