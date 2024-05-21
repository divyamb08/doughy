import PaymentStatusRow from "./PaymentStatusRow";
import "../styles/LeaderModal.css";

const PaymentStatusSection = ({ payments }) => {
  return (
    <div className="main">
      {payments.map((transaction, index) => (
        <PaymentStatusRow key={index} transaction={transaction} />
      ))}
    </div>
  );
};

export default PaymentStatusSection;
