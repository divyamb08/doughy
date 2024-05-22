import { useState } from "react";
import Homepage from "./screens/Homepage";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import "./App.css";
import ForgotPassword from "./screens/ForgotPassword";

const App = () => {
  // Empty string indicates not logged in yet, nonempty means logged in
  const [username, setUsername] = useState("");
  const [screen, setScreen] = useState("login");

  /*
    'inactive':  User has currently not initiated any transactions
    'pending': User is setting up a transaction as a group leader
    'active': User has sent out a transaction as a group leader, waiting for member responses
  */
  const [transactionState, setTransactionState] = useState("inactive");

  return (
    <>
      {username === "" ? (
        screen === "login" ? (
          <Login setUsername={setUsername} setScreen={setScreen} />
        ) : screen === "signup" ? (
          <Signup setScreen={setScreen} />
        ) : (
          <ForgotPassword setScreen={setScreen} />
        )
      ) : (
        <>
          <Homepage
            username={username}
            setUsername={setUsername}
            transactionState={transactionState}
            setTransactionState={setTransactionState}
          />
        </>
      )}
    </>
  );
};

export default App;
