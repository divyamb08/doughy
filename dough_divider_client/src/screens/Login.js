import { useState } from "react";
import { useMutation } from "@apollo/client";
import { AUTHENTICATE_USER } from "../gqlApi/gql";
import "../styles/Login.css";

const Login = ({ setUsername, setScreen }) => {
  const [authenticate_user] = useMutation(AUTHENTICATE_USER);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [tryAgain, setTryAgain] = useState(false);

  const showTryAgain = () => {
    if (tryAgain) {
      return (
        <div className="login-error-message">
          Login failed. Please try again.
        </div>
      );
    }
  };

  return (
    <div className="login">
      <div className="login-title">DoughDivider</div>
      <form
        className="login-form-container"
        onSubmit={(e) => {
          e.preventDefault();
          setTryAgain(false);
          authenticate_user({
            variables: { un: loginUsername, pw: loginPassword },
            onCompleted: (data) => {
              if (data.login) {
                setUsername(loginUsername);
              } else {
                setLoginUsername("");
                setLoginPassword("");
                setTryAgain(true);
              }
            },
          });
        }}
      >
        <input
          className="login-textarea"
          placeholder="Username"
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          className="login-textarea"
          placeholder="Password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        {showTryAgain()}
        <button className="login-submit-button" type="submit">
          Login
        </button>
      </form>
      <div className="login-signup">
        Don't have an account?{" "}
        <a className="login-signup-url" onClick={() => setScreen("signup")}>
          Sign up here!
        </a>
      </div>
      <div className="login-signup">
        <a
          className="login-signup-url"
          onClick={() => setScreen("changepassword")}
        >
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default Login;
