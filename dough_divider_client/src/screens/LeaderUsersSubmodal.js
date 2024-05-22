import UserPayments from "../components/UserPayments";
import "../styles/Modal.css";
import "../styles/LeaderModal.css";
import addUsr from "../assets/user_add.png";
import createTxn from "../assets/create_txn.png";
import { useState } from "react";
import { GET_ALL_USERS } from "../gqlApi/gql.js";
import { useQuery } from "@apollo/client";

const LeaderUsersSubmodal = ({
  payments,
  setPayments,
  setSenderNote,
  setActiveScreen,
  setMemberLookup,
  splitSchema,
  setSplitSchema,
  transactionTotal,
  setTransactionTotal,
}) => {
  const { data: allUsers, loading: loadingUsers } = useQuery(GET_ALL_USERS);
  const [userNotFound, setUserNotFound] = useState(false);
  const showUserNotFound = () => {
    if (userNotFound) {
      return <div> User(s) not found. Please try again. </div>;
    }
  };

  const updateUsername = (event, index) => {
    let newPayments = [...payments];
    let newPayment = { ...newPayments[index] };
    newPayment["member"] = event.target.value;
    newPayments[index] = newPayment;

    setPayments(newPayments);
  };

  const updateAmount = (event, index) => {
    let newPayments = [...payments];
    let newPayment = { ...newPayments[index] };

    const newTotal = event.target.value;
    const newAmount = parseFloat(newTotal);

    // Edge case for blank / cleared out data
    if (isNaN(newAmount)) {
      return;
    }

    // User is in the middle of typing a decimal input -> ignore
    if (newTotal.endsWith(".")) {
      return;
    }

    // User tries to go past 2 decimals -> don't allow
    if (newTotal.indexOf(".") > -1 && newTotal.split(".")[1].length > 2) {
      event.target.value = newTotal.slice(0, -1);
      return;
    }

    const totalTransactionChange = newAmount - parseFloat(newPayment["amount"]);
    const newTransactionTotal =
      Math.ceil((transactionTotal + totalTransactionChange) * 100) / 100;
    setTransactionTotal(newTransactionTotal);

    newPayment["amount"] = newAmount;
    newPayments[index] = newPayment;

    setPayments(newPayments);
  };

  const addPayment = () => {
    //only if equal split on user
    let newPayments = [
      ...payments,
      {
        leader: payments[0].leader,
        member: "",
        amount: 0,
        completed: false,
        card: "N/A",
      },
    ];
    if (splitSchema === "equal") {
      const newEqualAmounts = getNewEqualAmounts(
        transactionTotal,
        payments.length + 1
      );

      for (let i = 0; i < newPayments.length; i++) {
        newPayments[i].amount = newEqualAmounts[i];
      }
    }

    setPayments(newPayments);
  };

  const removePayment = (index) => {
    let filteredPayments = payments.filter((_, idx) => idx !== index);

    if (splitSchema === "equal") {
      const newAmounts = getNewEqualAmounts(
        transactionTotal,
        payments.length - 1
      );

      for (let i = 0; i < filteredPayments.length; i++) {
        filteredPayments[i].amount = newAmounts[i];
      }
    } else {
      let filteredPayments = payments.filter((_, idx) => idx !== index);
      const newTransactionTotal = filteredPayments.reduce(
        (acc, index) => acc + parseFloat(index.amount),
        0
      );
      setTransactionTotal(newTransactionTotal);
    }

    setPayments(filteredPayments);
  };

  function submitUserInfo() {
    let newMemberLookup = {};
    while (loadingUsers) {}
    var allLoadedUsers = [];
    allUsers.getAllUsers.forEach(function (obj) {
      allLoadedUsers.push(obj.username);
    });
    for (let i = 0; i < payments.length; i++) {
      const member = payments[i].member;

      if (allUsers && !allLoadedUsers.includes(member)) {
        setUserNotFound(true);
        return;
      }
      newMemberLookup[member] = i;
    }

    setMemberLookup(newMemberLookup);
    setActiveScreen("payment");
  }

  const handleTransactionTotalChange = (event) => {
    let newTotal = event.target.value;

    // User is in the middle of typing a decimal input -> ignore
    if (newTotal.endsWith(".")) {
      return;
    }

    // User tries to go past 2 decimals -> don't allow
    if (newTotal.indexOf(".") > -1 && newTotal.split(".")[1].length > 2) {
      event.target.value = newTotal.slice(0, -1);
      return;
    }

    newTotal = parseFloat(newTotal);

    // Amount input is cleared out
    if (isNaN(newTotal)) {
      setTransactionTotal(0);
      let newPayments = [...payments];

      for (let i = 0; i < newPayments.length; i++) {
        newPayments[i].amount = 0;
      }

      setPayments(newPayments);
      return;
    }

    setTransactionTotal(newTotal);

    const newEqualAmounts = getNewEqualAmounts(newTotal, payments.length);
    let newPayments = [...payments];

    for (let i = 0; i < newPayments.length - 1; i++) {
      newPayments[i].amount = newEqualAmounts[i];
    }

    newPayments[newPayments.length - 1].amount =
      Math.round(
        (newTotal - (newPayments.length - 1) * newEqualAmounts[0]) * 100
      ) / 100;

    setPayments(newPayments);
  };

  const getNewEqualAmounts = (newTotal, n) => {
    // Ref: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    const subAmount = Math.ceil((newTotal * 100) / n) / 100;

    let newPayments = [];
    let total = 0;

    for (let i = 0; i < n - 1; i++) {
      newPayments[i] = subAmount;
      total += subAmount;
    }

    newPayments[n - 1] = Math.ceil((newTotal - total) * 100) / 100;
    return newPayments;
  };

  const handleSplitSchemaChange = (event) => {
    setSplitSchema(event.target.value);
    let newPayments = [...payments];

    // On a schema change (equal to custom or vice versa), just zero out all payments
    for (let i = 0; i < newPayments.length; i++) {
      newPayments[i].amount = 0;
    }

    setTransactionTotal(0);
    setPayments(newPayments);
  };

  return (
    <>
      <div className="modal-title">Start New Transaction</div>
      <div className="transaction-section-wrapper">
        <textarea
          id="transaction-note-textarea"
          className="transaction-note-textarea"
          placeholder="Enter sender's note here..."
          onChange={(event) => setSenderNote(event.target.value.trim())}
        ></textarea>
        <br />

        <div className="split-schema-wrapper">
          <div>Split Payments:</div>
          <select
            defaultValue="equal"
            onChange={(event) => handleSplitSchemaChange(event)}
          >
            <option value="equal">Equal</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <br />

        <div className="transaction-total-wrapper">
          <div style={{ paddingBottom: "10px" }}>Total Payment Amount:</div>
          {splitSchema === "custom" ? (
            <div>{transactionTotal}</div>
          ) : (
            <input
              className="transaction-total-input"
              type="number"
              step="0.01"
              onChange={(event) => handleTransactionTotalChange(event)}
              defaultValue={transactionTotal}
              placeholder="Enter total..."
            />
          )}
        </div>
        <br />

        <UserPayments
          payments={payments}
          splitSchema={splitSchema}
          updateUsername={updateUsername}
          updateAmount={updateAmount}
          removePayment={removePayment}
        />

        {showUserNotFound()}

        <div className="transaction-buttons-wrapper">
          <button onClick={() => addPayment()} className="usrButton">
            <img
              src={addUsr}
              alt="buttonpng"
              style={{ height: "30px", verticalAlign: "middle" }}
              border="0"
            />
            <p>Add User</p>
          </button>
          <button onClick={() => submitUserInfo()} className="usrButton">
            <img
              src={createTxn}
              alt="buttonpng"
              style={{ height: "30px", verticalAlign: "middle" }}
              border="0"
            />
            <p>Go to Payment</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default LeaderUsersSubmodal;
