import "../styles/LeaderModal.css";

const UserPaymentRow = ({
  payment,
  splitSchema,
  updateUsername,
  updateAmount,
  index,
}) => {
  return (
    <div className="payment-row-wrapper" key={index}>
      <input
        className="username-input"
        type="text"
        onChange={(event) => updateUsername(event, index)}
        defaultValue={payment.member}
        placeholder="Enter username..."
      />
      {splitSchema === "equal" ? (
        <div>{payment.amount}</div>
      ) : (
        <input
          className="amount-input"
          type="number"
          step="0.01"
          onChange={(event) => updateAmount(event, index)}
          defaultValue={payment.amount}
          placeholder="Enter amount..."
        />
      )}
    </div>
  );
};

export default UserPaymentRow;
