import { useMutation } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../gqlApi/gql";
import Button from "../components/Button.js";

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
      <br />
      <div>
        <div>Expense: ${receivedTransaction.amount}</div>
        <div>Sender Note: {receivedTransaction.note}</div>
      </div>

      <Button
        height="30px"
        width="100px"
        fontSize="16px"
        color="lightgray"
        text="Accept"
        onClickHandler={() => setActiveScreen("payment")}
      ></Button>
      <Button
        height="30px"
        width="100px"
        fontSize="16px"
        color="lightgray"
        text="Reject"
        onClickHandler={() => handleTransactionReject()}
      ></Button>
    </>
  );
};

export default MemberStatusSubmodal;
