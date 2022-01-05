import React, { FormEvent, useContext, useState } from "react";
import { apiUrl } from "../api";
import Header from "../components/Header";
import PageLayout from "../components/PageLayout";
import { setCookie } from "../Cookies";
import { Session, SessionContext } from "../SessionContext";

const LoginPage : React.FC = () => {
    const [password, setPassword] : any = useState ("");
    const [username, setUsername] : any = useState ("");
    const [error, setError] : any = useState (null);

    const session : Session = useContext (SessionContext);

    const submitForm = (ev : FormEvent<HTMLFormElement>) => {
        ev.preventDefault ();
        
        fetch (`${apiUrl}/auth`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify ({
                username: username,
                password: password
            })
        }).then ((res : Response) => {
            res.json ().then (data => {
                if (res.status == 200) {
                    setCookie ('login_token', data.jwtToken, 1000 * 3600 * 12);
                    session.setToken (data.jwtToken);
                } else {
                    setError (data.message);
                }
            })
        }).catch (err => {
            console.error (err);
            setError ('request error, try again later');
        });
    };

    return (
        <PageLayout title="Login">
            <div className="loginWrapper">
                <form className="inputForm centeredForm" onSubmit={submitForm}>
                    {!!error ? <div className="error">{error}</div> : <></>}
                    <div className="formRow">
                        <label htmlFor="username">Username: </label>
                        <input onChange={(ev) => {
                            setUsername (ev.target.value);
                        }} type="text" name="username" />
                    </div>
                    <div className="formRow">
                        <label htmlFor="password">Password: </label>
                        <input onChange={(ev) => {
                            setPassword (ev.target.value);
                        }} type="password" name="password" />
                    </div>
                    <div className="formFooter">
                        <input type="submit" className="bigButton" value="Login" />
                    </div>
                </form>
            </div>
        </PageLayout>
    )
}

export default LoginPage;