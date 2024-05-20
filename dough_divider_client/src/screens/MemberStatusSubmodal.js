import { useMutation } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../gqlApi/gql";

const MemberStatusSubmodal = ({
  receivedTransaction,
  setReceivedTransaction,
  setActiveScreen,
}) => {
  const [
    updateTransaction,
    { data: dataUpdate, loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_TRANSACTION);

  const handleTransactionReject = () => {
    updateTransaction({
      variables: {
        transactionId: receivedTransaction.transactionId,
        completed: false,
        card: "TRANSACTION REJECTED",
      },
    });

    setReceivedTransaction({});
    setActiveScreen("status");
  };

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
      <button onClick={() => handleTransactionReject()}>Reject</button>
    </>
  );
};

export default MemberStatusSubmodal;
