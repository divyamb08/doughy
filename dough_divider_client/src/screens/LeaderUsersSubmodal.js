import "../styles/Modal.css";

const LeaderUsersSubmodal = ({
  payments,
  setPayments,
  setSenderNote,
  setActiveScreen,
  memberLookupInPayments,
  setMemberLookup,
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
    newPayment["amount"] = parseInt(event.target.value);
    newPayments[index] = newPayment;

    setPayments(newPayments);
  };

  const addPayment = () => {
    setPayments([
      ...payments,
      {
        leader: payments[0].leader,
        member: "",
        amount: 0,
        completed: false,
        card: "N/A",
      },
    ]);
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
          {payments.map((payment, index) => (
            <div key={index}>
              <input
                type="text"
                onChange={(event) => updateUsername(event, index)}
                defaultValue={payment.member}
                placeholder="Enter username..."
              />
              <input
                type="text"
                onChange={(event) => updateAmount(event, index)}
                defaultValue={payment.amount}
                placeholder="Enter amount..."
              />
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
