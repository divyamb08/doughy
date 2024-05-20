import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../gqlApi/gql";

const MemberPaymentSubmodal = ({
  receivedTransacation,
  setReceivedTransaction,
  setActiveScreen,
  setPossibleRefresh,
}) => {
  const [memberCard, setMemberCard] = useState(receivedTransacation.card);

  const [
    updateTransaction,
    { data: dataUpdate, loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_TRANSACTION);

  const handleTransactionResponse = () => {
    updateTransaction({
      variables: {
        transactionId: receivedTransacation.transactionId,
        completed: true,
        card: memberCard,
      },
    });

    setReceivedTransaction({});
    setActiveScreen("status");
    setPossibleRefresh(true);
  };

  return (
    <>
      <div className="modal-title">Add Payment Info</div>
      <div>
        <div>Card Number:</div>
        <input
          type="text"
          onChange={(event) => setMemberCard(event.target.value)}
          placeholder="Enter card number..."
        />
      </div>
      <button onClick={() => handleTransactionResponse()}>Send!</button>
    </>
  );
};

export default MemberPaymentSubmodal;
