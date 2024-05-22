import "../styles/Homepage.css";
import Button from "./Button";

const HomepageHeader = ({ username, handleLougout, transactionState }) => {
  return (
    <div className="homepage-header-wrapper">
      <div className="navbar">
        <div className="homepage-user">
          Currently Logged In As: <b>{username}</b>
        </div>

        {transactionState === "inactive" && (
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
