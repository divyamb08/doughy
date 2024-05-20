import { ADD_TRANSACTION } from "../gqlApi/gql";
import { useMutation } from "@apollo/client";
import "../styles/Modal.css";

const LeaderPaymentSubmodal = ({
  payments,
  setPayments,
  senderNote,
  setTransactionState,
}) => {
  const [
    addTransaction,
    { data: dataAdd, loading: loadingAdd, error: errorAdd },
  ] = useMutation(ADD_TRANSACTION);

  const updateLeaderCard = (event) => {
    let newPayments = [...payments];
    let newPayment = { ...newPayments[0] };
    newPayment["card"] = event.target.value;
    newPayments[0] = newPayment;

    setPayments(newPayments);
  };

  const handleTransactionSend = () => {
    setTransactionState("active");

    for (let i = 0; i < payments.length; i++) {
      addTransaction({
        variables: { ...payments[i], note: senderNote },
      });
    }
  };

  return (
    <>
      <div className="modal-title">Add Payment Info</div>
      <div>
        <div>Card Number:</div>
        <input
          type="text"
          onChange={(event) => updateLeaderCard(event)}
          placeholder="Enter card number..."
        />
      </div>
      <button onClick={() => handleTransactionSend()}>Send!</button>
    </>
  );
};

export default LeaderPaymentSubmodal;
