import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../api";
import HiddenValue from "../components/HiddenValue";
import { Session, SessionContext } from "../SessionContext";

const SessionPage : React.FC<any> = () => {
    const [ userData, setUserData ] : any = useState (null);
    const [ error, setError ] : any = useState (null);
    const [ rawResponse, setRawResponse ] : any = useState (null);

    const session : Session = useContext (SessionContext);

    useEffect (() => {
        fetch (`${apiUrl}/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':  `Bearer ${session.token}`
            }
        }).then ((res : Response) => {
            res.json ().then (data => {
                setUserData (data);
                setRawResponse (JSON.stringify (data));
            })
        }).catch (err => {
            setError (err);
        });
    }, []);

    return (
        <div className="sessionPage pageWithPadding">
            {!!error ? <div className="error">{error}</div> : <></>}
            <div className="info" style={{wordWrap: "break-word"}}>
                <strong>token: </strong><HiddenValue show={false}>{session.token}</HiddenValue>
            </div>
            <button onClick={() => {
                session.setToken (undefined);
            }}>End Session</button>
            <br />
            <table className="table" cellSpacing={0} cellPadding={0}>
                <thead>
                    <tr>
                        <td style={{width: "25%"}}>name</td>
                        <td style={{width: "75%"}}>value</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>username</td>
                        <td>{!!userData ? userData.username : 'loading...'}</td>
                    </tr>
                    <tr>
                        <td>permissions</td>
                        <td>{!!userData ? userData.authorities.join (', ') : 'loading...'}</td>
                    </tr>
                </tbody>
            </table>
            <h2>raw response: </h2>
            <pre className="code">
                {rawResponse}
            </pre>
        </div>
    );
}

export default SessionPage;