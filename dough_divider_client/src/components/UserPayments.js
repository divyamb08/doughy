import UserPaymentRow from "./UserPaymentRow";
import "../styles/LeaderModal.css";

const UserPayments = ({
  payments,
  splitSchema,
  updateUsername,
  updateAmount,
}) => {
  return (
    <div>
      {payments.map((payment, index) => (
        <UserPaymentRow
          key={index}
          payment={payment}
          splitSchema={splitSchema}
          updateUsername={updateUsername}
          updateAmount={updateAmount}
          index={index}
        />
      ))}
    </div>
  );
};

export default UserPayments;
