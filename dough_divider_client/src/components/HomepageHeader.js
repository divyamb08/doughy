import "../styles/Homepage.css";
import Button from "./Button";

const HomepageHeader = ({
  username,
  possibleRefresh,
  refreshTransactionsHandler,
  handleLougout,
  transactionState,
}) => {
  return (
    <div className="homepage-header-wrapper">
      <div className="navbar">
        <div className="homepage-user">
          Currently Logged In As: <b>{username}</b>
        </div>

        <div className="past-transactions-header-wrapper">
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

        {transactionState == "inactive" && (
          <Button
            height="30px"
            width="100px"
            fontSize="16px"
            color="lightgray"
            text="Logout"
            otherClasses="logout-button"
            onClickHandler={handleLougout}
          ></Button>
        )}
      </div>
      <hr className="navLine" />
    </div>
  );
};

export default HomepageHeader;
