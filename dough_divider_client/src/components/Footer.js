import "../styles/Footer.css";
import newTxn from "../assets/newTxn.png";
import reloadTxn from "../assets/reloadTxn.png";

const Footer = ({ getCompletedTransactions, setTransactionState }) => {
  return (
    <div style={{ width: "60px" }} className="footer">
      <button onClick={() => getCompletedTransactions()} className="usrButton">
        <img
          src={reloadTxn}
          alt="reloadTxn"
          style={{ height: "60px", verticalAlign: "middle" }}
          border="0"
        />
      </button>

      <button
        onClick={() => setTransactionState("pending")}
        className="usrButton addButton"
      >
        <img
          src={newTxn}
          alt="newTxn"
          style={{ height: "60px", verticalAlign: "middle" }}
          border="0"
        />
      </button>
    </div>
  );
};

export default Footer;
