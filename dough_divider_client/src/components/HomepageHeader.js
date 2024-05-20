import "../styles/Homepage.css";
import Button from "./Button";

const HomepageHeader = ({
  username,
  possibleRefresh,
  refreshTransactionsHandler,
}) => {
  return (
    <div className="homepage-header-wrapper">
      <div>
        Currently Logged In As: <b>{username}</b>
      </div>

      <div className="past-transactions-header-wrapper">
        <div className="past-transactions-header">Past Transactions</div>
        {possibleRefresh && (
          <Button
            height="30px"
            width="100px"
            fontSize="16px"
            color="lightgray"
            text="Refresh"
            onClickHandler={refreshTransactionsHandler}
          ></Button>
        )}
      </div>
    </div>
  );
};

export default HomepageHeader;
