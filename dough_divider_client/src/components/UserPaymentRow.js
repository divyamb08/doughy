import "../styles/LeaderModal.css";
import delBut from "../assets/delete.png";

const UserPaymentRow = ({
  payment,
  splitSchema,
  updateUsername,
  updateAmount,
  index,
  removePayment,
}) => {
  return (
    <div className="payment-row-wrapper" key={index}>
      <input
        className="username-input"
        type="text"
        onChange={(event) => updateUsername(event, index)}
        defaultValue={payment.member}
        placeholder="Enter username..."
        style={{ maxWidth: "100px" }}
        disabled={index === 0} // Group leader can't edit themselves
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
          style={{ maxWidth: "40px", borderRadius: "5px" }}
        />
      )}
      {/* Make it so that group leader can't be removed */}
      {index !== 0 && (
        <button
          onClick={() => removePayment(index)}
          style={{
            width: "100%",
            padding: 0,
            border: "none",
            background: "none",
          }}
        >
          <img
            src={delBut}
            alt="buttonpng"
            style={{ height: "30px", verticalAlign: "middle" }}
            border="0"
          />
        </button>
      )}
    </div>
  );
};

export default UserPaymentRow;
