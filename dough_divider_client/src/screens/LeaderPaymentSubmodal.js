import { ADD_TRANSACTION } from "../gqlApi/gql";
import { useMutation } from "@apollo/client";
import PaymentSection from "../components/PaymentSection";
import "../styles/Modal.css";

const LeaderPaymentSubmodal = ({
  payments,
  setPayments,
  senderNote,
  setTransactionState,
}) => {
  const [addTransaction, {}] = useMutation(ADD_TRANSACTION);

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
    <PaymentSection
      updateCardHandler={(event) => updateLeaderCard(event)}
      sendHandler={() => handleTransactionSend()}
    />
  );
};

export default LeaderPaymentSubmodal;
