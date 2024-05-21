import UserPayments from "../components/UserPayments";
import Button from "../components/Button.js";
import "../styles/Modal.css";
import "../styles/LeaderModal.css";
import addUsr from "../assets/user_add.png";
import createTxn from "../assets/create_txn.png";

//

const LeaderUsersSubmodal = ({
  payments,
  setPayments,
  setSenderNote,
  setActiveScreen,
  memberLookupInPayments,
  setMemberLookup,
  splitSchema,
  setSplitSchema,
  transactionTotal,
  setTransactionTotal,
}) => {
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
    const newAmount = parseFloat(event.target.value);

    // Edge case for blank / cleared out data
    if (isNaN(newAmount)) {
      return;
    }

    const totalTransactionChange = newAmount - parseFloat(newPayment["amount"]);
    const newTransactionTotal =
      Math.floor((transactionTotal + totalTransactionChange) * 100) / 100;
    setTransactionTotal(newTransactionTotal);

    truncateDecimals(event, newAmount); // Prevent UI from going past 2 decimals

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

  /////
  const removePayment = (index) => {
    const filteredPayments = payments.filter((_, idx) => idx !== index);
    setPayments(filteredPayments);
    const newTransactionTotal = filteredPayments.reduce(
      (acc, index) => acc + parseFloat(index.amount),
      0
    );
    setTransactionTotal(newTransactionTotal);
    // update user and amt
    let newPayments = [...payments];

  };

  ////

  const submitUserInfo = () => {
    let newMemberLookup = {};

    for (let i = 0; i < payments.length; i++) {
      const member = payments[i].member;
      newMemberLookup[member] = i;
    }

    setMemberLookup(newMemberLookup);
    setActiveScreen("payment");
  };

  const handleTransactionTotalChange = (event) => {
    const newTotal = parseFloat(event.target.value);

    truncateDecimals(event, newTotal); // Prevent UI from going past 2 decimals
    setTransactionTotal(newTotal);

    const newEqualAmounts = getNewEqualAmounts(newTotal, payments.length);
    let newPayments = [...payments];

    for (let i = 0; i < newPayments.length; i++) {
      newPayments[i].amount = newEqualAmounts[i];
    }

    setPayments(newPayments);
  };

  const getNewEqualAmounts = (newTotal, n) => {
    // Ref: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    const subAmount = Math.floor((newTotal * 100) / n) / 100;

    let newPayments = [];
    let total = 0;

    for (let i = 0; i < n - 1; i++) {
      newPayments[i] = subAmount;
      total += subAmount;
    }

    newPayments[n - 1] = Math.floor((newTotal - total) * 100) / 100;
    return newPayments;
  };

  const handleSplitSchemaChange = (event) => {
    setSplitSchema(event.target.value);
    let newPayments = [...payments];

    const newEqualAmounts = getNewEqualAmounts(
      transactionTotal,
      payments.length
    );

    if (event.target.value === "custom") {
      //wierd stuff when going from equal to custom
      //just set all to 0
      for (let i = 0; i < newPayments.length; i++) {
        newPayments[i].amount = 0;
        newEqualAmounts[i] = 0;
        setTransactionTotal(0);
      }
      return;
    }
    //

    for (let i = 0; i < newPayments.length; i++) {
      newPayments[i].amount = newEqualAmounts[i];
    }

    setPayments(newPayments);
  };

  const truncateDecimals = (event, value) => {
    event.target.value = Math.floor(value * 100) / 100;
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
          <div style={{paddingBottom: "10px"}}>Total Payment Amount:</div>
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
            <p>Goto Payment</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default LeaderUsersSubmodal;
