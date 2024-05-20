import { useState } from "react";
import MemberStatusSubmodal from "./MemberStatusSubmodal";
import MemberPaymentSubmodal from "./MemberPaymentSubmodal";
import "../styles/Modal.css";

const MemberModal = ({
  receivedTransaction,
  setReceivedTransaction,
  getCompletedTransactions,
}) => {
  const [activeScreen, setActiveScreen] = useState("status");

  return (
    <div className="modal">
      {activeScreen === "status" ? (
        <MemberStatusSubmodal
          receivedTransaction={receivedTransaction}
          setActiveScreen={setActiveScreen}
        />
      ) : (
        <MemberPaymentSubmodal
          receivedTransacation={receivedTransaction}
          setReceivedTransaction={setReceivedTransaction}
          setActiveScreen={setActiveScreen}
        />
      )}
    </div>
  );
};

export default MemberModal;
