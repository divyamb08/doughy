import { useState } from "react";
import LeaderUsersSubmodal from "./LeaderUsersSubmodal";
import LeaderPaymentSubmodal from "./LeaderPaymentSubmodal";
import LeaderWaitingSubmodal from "./LeaderWaitingSubmodal";
import "../styles/Modal.css";
import cancelPay from "../assets/cancel.png";

const LeaderModal = ({
  username,
  payments,
  setPayments,
  memberLookupInPayments,
  setMemberLookup,
  transactionState,
  setTransactionState,
  getCompletedTransactions,
  handleTransactionCancel,
}) => {
  const [senderNote, setSenderNote] = useState("");
  const [activeScreen, setActiveScreen] = useState("users");
  const [splitSchema, setSplitSchema] = useState("equal");
  const [transactionTotal, setTransactionTotal] = useState(0);

  // Referencing some code & styling from project 2 here:
  // https://github.com/CS-396-Full-Stack-Software-Eng/project-2-recipe-step-tracker-v2-cs2027/blob/main/recipe_tracker_client/src/components/EditModal.js#L96
  return (
    <div className="modal">
      <button
        style={{
          width: "40px",
          position: "relative",
          top: "15px",
          right: "-15px",
        }}
        className="usrButton"
        text="Cancel Transaction"
        onClick={() => handleTransactionCancel()}
      >
        <img
          src={cancelPay}
          alt="buttonpng"
          style={{ height: "30px", verticalAlign: "middle" }}
          border="0"
        />
      </button>
      {transactionState === "active" ? (
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
          transactionTotal={transactionTotal}
        />
      ) : activeScreen === "users" ? (
        <LeaderUsersSubmodal
          payments={payments}
          setPayments={setPayments}
          setSenderNote={setSenderNote}
          setActiveScreen={setActiveScreen}
          setMemberLookup={setMemberLookup}
          splitSchema={splitSchema}
          setSplitSchema={setSplitSchema}
          transactionTotal={transactionTotal}
          setTransactionTotal={setTransactionTotal}
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
      <br />
    </div>
  );
};

export default LeaderModal;
