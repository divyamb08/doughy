import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../gqlApi/gql";
import "../styles/Signup.css";

const Signup = ({ setScreen }) => {
  const [add_user] = useMutation(ADD_USER);
  const [signupUsername, setSignupUsername] = useState(null);
  const [signupFirstName, setSignupFirstName] = useState(null);
  const [signupLastName, setSignupLastName] = useState(null);
  const [signupEmail, setSignupEmail] = useState(null);
  const [signupPassword, setSignupPassword] = useState(null);

  const [usernameTryAgain, setUsernameTryAgain] = useState(false);
  const showUsernameTryAgain = () => {
    if (usernameTryAgain) {
      return (
        <div className="signup-error-message">
          Username taken. Please try another username.
        </div>
      );
    }
  };

  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [firstEmpty, setFirstEmpty] = useState(false);
  const [lastEmpty, setLastEmpty] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);

  const fieldToState = {
    username: setUsernameEmpty,
    first: setFirstEmpty,
    last: setLastEmpty,
    email: setEmailEmpty,
    password: setPasswordEmpty,
  };

  const showCanNotBeEmpty = (field, state) => {
    if (state) {
      return (
        <div className="signup-error-message">
          {field[0].toUpperCase() + field.slice(1)} can not be empty.
        </div>
      );
    }
  };

  return (
    <div className="signup">
      <div className="signup-title"> Sign Up </div>
      <form
        className="signup-form-container"
        onSubmit={(e) => {
          e.preventDefault();
          setUsernameTryAgain(false);
          for (const field of Object.keys(fieldToState)) {
            fieldToState[field](false);
          }
          add_user({
            variables: {
              username: signupUsername,
              password: signupPassword,
              email: signupEmail,
              firstName: signupFirstName,
              lastName: signupLastName,
            },
            onError: (error) => {
              if (error.message.includes("UNIQUE")) {
                setUsernameTryAgain(true);
              }
              for (const field of Object.keys(fieldToState)) {
                if (
                  error.message.includes(field) &
                  !error.message.includes("UNIQUE")
                ) {
                  fieldToState[field](true);
                }
              }
            },
            onCompleted: (data) => {
              setScreen("login");
            },
          });
        }}
      >
        <textarea
          className="signup-textarea"
          placeholder="First Name"
          type="text"
          value={signupFirstName ? signupFirstName : ""}
          onChange={(e) => setSignupFirstName(e.target.value)}
        ></textarea>
        {showCanNotBeEmpty("first", firstEmpty)}
        <textarea
          className="signup-textarea"
          placeholder="Last Name"
          type="text"
          value={signupLastName ? signupLastName : ""}
          onChange={(e) => setSignupLastName(e.target.value)}
        ></textarea>
        {showCanNotBeEmpty("last", lastEmpty)}
        <textarea
          className="signup-textarea"
          placeholder="Email"
          type="text"
          value={signupEmail ? signupEmail : ""}
          onChange={(e) => setSignupEmail(e.target.value)}
        ></textarea>
        {showCanNotBeEmpty("email", emailEmpty)}
        <textarea
          className="signup-textarea"
          placeholder="Username"
          type="text"
          value={signupUsername ? signupUsername : ""}
          onChange={(e) => setSignupUsername(e.target.value)}
        ></textarea>
        {showUsernameTryAgain()}
        {showCanNotBeEmpty("username", usernameEmpty)}
        <textarea
          className="signup-textarea"
          placeholder="Password"
          type="text"
          value={signupPassword ? signupPassword : ""}
          onChange={(e) => setSignupPassword(e.target.value)}
        ></textarea>
        {showCanNotBeEmpty("password", passwordEmpty)}
        <button className="signup-submit-button" type="submit">
          Sign Up
        </button>
      </form>
      <div className="signup-login">
        Already have an account?{" "}
        <a onClick={() => setScreen("login")} className="signup-login-url">
          Login here!
        </a>
      </div>
    </div>
  );
};

export default Signup;
