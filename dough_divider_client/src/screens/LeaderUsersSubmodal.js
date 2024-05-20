import "../styles/Modal.css";

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
    const newEqualAmounts = getNewEqualAmounts(
      transactionTotal,
      payments.length + 1
    );
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

    for (let i = 0; i < newPayments.length; i++) {
      newPayments[i].amount = newEqualAmounts[i];
    }

    setPayments(newPayments);
  };

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

    if (event.target.value == "custom") {
      return;
    }

    const newEqualAmounts = getNewEqualAmounts(
      transactionTotal,
      payments.length
    );
    let newPayments = [...payments];

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

        <div>
          <div>Split Payments:</div>
          <select
            defaultValue="equal"
            onChange={(event) => handleSplitSchemaChange(event)}
          >
            <option value="equal">Equal</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <div>Total Payment Amount:</div>
          {splitSchema === "custom" ? (
            <div>{transactionTotal}</div>
          ) : (
            <input
              type="number"
              step="0.01"
              onChange={(event) => handleTransactionTotalChange(event)}
              defaultValue={transactionTotal}
              placeholder="Enter total..."
            />
          )}
        </div>

        <div>
          {payments.map((payment, index) => (
            <div key={index}>
              <input
                type="text"
                onChange={(event) => updateUsername(event, index)}
                defaultValue={payment.member}
                placeholder="Enter username..."
              />
              {splitSchema === "equal" ? (
                <div>{payment.amount}</div>
              ) : (
                <input
                  type="number"
                  step="0.01"
                  onChange={(event) => updateAmount(event, index)}
                  defaultValue={payment.amount}
                  placeholder="Enter amount..."
                />
              )}
              <br />
            </div>
          ))}
        </div>
        <div className="transaction-buttons-wrapper">
          <button onClick={() => addPayment()}>Add User</button>
          <button onClick={() => submitUserInfo()}>Enter Payment Info</button>
        </div>
      </div>
    </>
  );
};

export default LeaderUsersSubmodal;
