import { useMutation } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../gqlApi/gql";
import "../styles/MemberStatus.css";
import acptBtn from "../assets/accept.png";
import rejBtn from "../assets/reject.png";

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
      <div className="modal-header">
        <div className="modal-title-member">
          '{receivedTransaction.leader}'
          <p className="small-text">is requesting</p>
        </div>
        <div className="amount-text">${receivedTransaction.amount}</div>
      </div>
      <br />
      <div>
        <div className="note">Note:</div>
        <div className="note-text">{receivedTransaction.note}</div>
      </div>
      <div className="transaction-buttons-wrapper">
        <button className="acptBtn" onClick={() => setActiveScreen("payment")}>
          <img
            src={acptBtn}
            alt="accept payment"
            style={{ height: "30px", verticalAlign: "middle" }}
            border="0"
          />
          <p>Accept</p>
        </button>

        <button className="rejBtn" onClick={() => handleTransactionReject()}>
          <img
            src={rejBtn}
            alt="reject payment"
            style={{ height: "30px", verticalAlign: "middle" }}
            border="0"
          />
          <p>Reject</p>
        </button>
      </div>
    </>
  );
};

export default MemberStatusSubmodal;
