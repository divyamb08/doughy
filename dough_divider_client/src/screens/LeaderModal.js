import { useState } from "react";
import LeaderUsersSubmodal from "./LeaderUsersSubmodal";
import LeaderPaymentSubmodal from "./LeaderPaymentSubmodal";
import LeaderWaitingSubmodal from "./LeaderWaitingSubmodal";
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
    </div>
  );
};

export default LeaderModal;
