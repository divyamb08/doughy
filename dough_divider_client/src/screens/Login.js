import { useState } from "react";
import { useMutation } from "@apollo/client";
import { AUTHENTICATE_USER } from '../gqlApi/gql'
import '../styles/login.css'

const Login = ({ username, setUsername }) => {
    const [authenticate_user] = useMutation(AUTHENTICATE_USER);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [tryAgain, setTryAgain] = useState(false);
    const showTryAgain = () => {
        if (tryAgain) {
            return (
                <div className="login-error-message">
                    Login failed. Please try again.
                </div>
            )
        }
    }

    return (
        <div className="login">
            <div className="login-title"> Login </div>
            <form
                className="login-form-container"
                onSubmit={(e) => {
                    e.preventDefault();
                    setTryAgain(false);
                    authenticate_user({
                        variables: { un: loginUsername, pw: loginPassword },
                        onCompleted: (data) => {
                            console.log(data);
                            if (data.login) {
                                setUsername(loginUsername);
                            }
                            else {
                                setLoginUsername('');
                                setLoginPassword('');
                                setTryAgain(true);
                            }
                        },
                    });
                }}
            >
                <textarea
                    className="login-textarea"
                    placeholder="Username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                ></textarea>
                <textarea
                    className="login-textarea"
                    placeholder="Password"
                    type="text"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                ></textarea>
                {showTryAgain()}
                <button className="login-submit-button" type="submit">
                    Login
                </button>

            </form>
            <div className="login-signup"> Don't have an account? <a href="url" className="login-signup-url"> Sign up here! </a> </div>
        </div>
    );


}

export default Login;

