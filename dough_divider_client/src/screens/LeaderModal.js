import { useState } from "react";
import LeaderUsersSubmodal from "./LeaderUsersSubmodal";
import LeaderPaymentSubmodal from "./LeaderPaymentSubmodal";
import LeaderWaitingSubmodal from "./LeaderWaitingSubmodal";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../gqlApi/gql";
import "../styles/Modal.css";

const LeaderModal = ({
  username,
  payments,
  setPayments,
  memberLookupInPayments,
  setMemberLookup,
  transactionState,
  setTransactionState,
  getCompletedTransactions,
}) => {
  const [senderNote, setSenderNote] = useState("");
  const [activeScreen, setActiveScreen] = useState("users");

  const [deleteTransaction, { data: dataDeleted, loading: loadingDeleted }] =
    useMutation(DELETE_TRANSACTION);

  const handleTransactionCancel = () => {
    // If transaction was already sent, delete transactions from active transactions table
    if (transactionState == "active") {
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];

        deleteTransaction({
          variables: {
            leader: payment.leader,
            member: payment.member,
          },
        });
      }
    }

    setTransactionState("inactive");
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
  };

  // Referencing some code & styling from project 2 here:
  // https://github.com/CS-396-Full-Stack-Software-Eng/project-2-recipe-step-tracker-v2-cs2027/blob/main/recipe_tracker_client/src/components/EditModal.js#L96
  return (
    <div className="modal">
      {transactionState == "active" ? (
        <LeaderWaitingSubmodal
          username={username}
          payments={payments}
          setPayments={setPayments}
          senderNote={senderNote}
          setTransactionState={setTransactionState}
          memberLookupInPayments={memberLookupInPayments}
          setMemberLookup={setMemberLookup}
          setActiveScreen={setActiveScreen}
          getCompletedTransactions={getCompletedTransactions}
        />
      ) : activeScreen == "users" ? (
        <LeaderUsersSubmodal
          payments={payments}
          setPayments={setPayments}
          setSenderNote={setSenderNote}
          setActiveScreen={setActiveScreen}
          memberLookupInPayments={memberLookupInPayments}
          setMemberLookup={setMemberLookup}
        />
      ) : (
        <LeaderPaymentSubmodal
          username={username}
          payments={payments}
          setPayments={setPayments}
          senderNote={senderNote}
          setTransactionState={setTransactionState}
        />
      )}
      <button onClick={() => handleTransactionCancel()}>
        Cancel Transaction
      </button>
    </div>
  );
};

export default LeaderModal;
