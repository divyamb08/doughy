import { useState } from "react";
import {
  ADD_COMPLETED_TRANSACTION,
  LEADER_SUBSCRIPTION,
  DELETE_TRANSACTION,
} from "../gqlApi/gql";
import { useMutation, useSubscription } from "@apollo/client";

// "Submodal" for after the group leader sends transaction &
// is waiting on the other group members to respond
const LeaderWaitingSubmodal = ({
  username,
  payments,
  setPayments,
  senderNote,
  setTransactionState,
  memberLookupInPayments,
  setMemberLookup,
  setActiveScreen,
  getCompletedTransactions,
  transactionTotal,
}) => {
  const [numPaymentsComplete, setNumPaymentsComplete] = useState(1);

  const { data: dataLeader, loading: loadingLeader } = useSubscription(
    LEADER_SUBSCRIPTION,
    {
      variables: { leader: username },
      onData: (result) => {
        const updatedTransaction = result.data.data.getTransactionByLeader;
        const updatedPaymentIndex =
          memberLookupInPayments[updatedTransaction["member"]];

        let paymentsUpdated = [...payments];
        let newPayment = { ...paymentsUpdated[updatedPaymentIndex] };

        if (!newPayment.completed && updatedTransaction["completed"]) {
          setNumPaymentsComplete(numPaymentsComplete + 1);
        }

        newPayment.completed = updatedTransaction["completed"];
        newPayment.card = updatedTransaction["card"];
        paymentsUpdated[updatedPaymentIndex] = newPayment;
        setPayments(paymentsUpdated);
      },
    }
  );

  const [
    addCompletedTransaction,
    { data: dataCompleted, loading: loadingCompleted },
  ] = useMutation(ADD_COMPLETED_TRANSACTION);

  const [deleteTransaction, { data: dataDeleted, loading: loadingDeleted }] =
    useMutation(DELETE_TRANSACTION);

  const handlePaymentSubmit = () => {
    setTransactionState("inactive");
    setActiveScreen("users");

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];

      // Delete transaction from active transactions table
      deleteTransaction({
        variables: {
          leader: payment.leader,
          member: payment.member,
        },
      });

      // Add transaction to completed list
      addCompletedTransaction({
        variables: {
          leader: payment.leader,
          member: payment.member,
          amount: payment.amount,
          note: senderNote,
        },
      });

      // Clear out state vars for possible (future) transactions
      setPayments([
        {
          leader: username,
          member: username,
          amount: 0,
          completed: true,
          card: "N/A",
        },
      ]);
      setMemberLookup({
        username: 0,
      });
    }

    getCompletedTransactions();
  };

  return (
    <>
      <div className="modal-title">Sender Note: {senderNote}</div>
      <div>
        <div>[CURRENT PAYMENTS]</div>
        <div>Leader | Member | Amount | Completed | Card</div>
        <br />
        {payments.map((transaction, index) => (
          <div key={index}>
            {transaction.leader} | {transaction.member} | {transaction.amount} |{" "}
            {transaction.completed.toString()} | {transaction.card}
          </div>
        ))}
      </div>
      {numPaymentsComplete == payments.length && (
        <button onClick={() => handlePaymentSubmit()}>Submit Payments!</button>
      )}
    </>
  );
};

export default LeaderWaitingSubmodal;
