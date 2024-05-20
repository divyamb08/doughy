import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TRANSACTION } from "../gqlApi/gql";
import PaymentSection from "../components/PaymentSection";

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
    <PaymentSection
      updateCardHandler={(event) => setMemberCard(event.target.value)}
      sendHandler={() => handleTransactionResponse()}
    />
  );
};

export default MemberPaymentSubmodal;
