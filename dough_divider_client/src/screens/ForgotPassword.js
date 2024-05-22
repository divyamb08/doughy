import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../gqlApi/gql";
import "../styles/ForgotPassword.css";

const ForgotPassword = ({ setScreen }) => {
  const [fpUsername, setFPUsername] = useState("");
  const [fpNewPassword, setNewPassword] = useState("");
  const [change_password] = useMutation(CHANGE_PASSWORD);
  const [tryAgain, setTryAgain] = useState(false);

  const showTryAgain = () => {
    if (tryAgain) {
      return <div className="fp-error-message">Username does not exist.</div>;
    }
  };

  return (
    <div className="fp">
      <div className="fp-title">Forgot Password</div>
      <form
        className="fp-form-container"
        onSubmit={(e) => {
          e.preventDefault();
          change_password({
            variables: { username: fpUsername, newPassword: fpNewPassword },
            onCompleted: (data) => {
              setScreen("login");
            },
            onError: (error) => {
              setTryAgain("true");
            },
          });
        }}
      >
        <input
          className="fp-textarea"
          placeholder="Username"
          type="text"
          value={fpUsername}
          onChange={(e) => setFPUsername(e.target.value)}
        />
        {showTryAgain()}
        <input
          className="fp-textarea"
          placeholder="New Password"
          type="password"
          value={fpNewPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="fp-submit-button" type="submit">
          Change Password
        </button>
      </form>
      <div className="fp-login">
        <a className="fp-login-url" onClick={() => setScreen("login")}>
          Back to Login
        </a>
      </div>
    </div>
  );
};
export default ForgotPassword;
