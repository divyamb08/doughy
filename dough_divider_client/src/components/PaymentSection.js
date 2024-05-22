import Button from "./Button";
import "../styles/Modal.css";

const PaymentSection = ({ updateCardHandler, sendHandler }) => {
  return (
    <div className="payment-modal-wrapper">
      <div className="modal-title">Add Payment Info</div>
      <div className="payment-wrapper">
        <div style={{ marginLeft: "15px" }}>Card Number:</div>
        <input
          className="card-input"
          type="text"
          onChange={updateCardHandler}
          placeholder="Enter card number..."
          style={{ marginRight: "15px" }}
        />
      </div>
      <Button
        height="30px"
        width="100px"
        fontSize="16px"
        color="lightgray"
        text="Send!"
        onClickHandler={sendHandler}
      ></Button>
      <br />
    </div>
  );
};

export default PaymentSection;
