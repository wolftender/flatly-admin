import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../api";
import PanelLayout from "../components/PanelLayout"
import UserEditor, { UserCreateRequest } from "../components/UserEditor";
import { User } from "../schema/User";
import { Session, SessionContext } from "../SessionContext";

const UsersPage : React.FC<any> = () => {
    const [users, setUsers] : any = useState ([]);
    const [error, setError] : any = useState (null);
    const [currentUser, setCurrentUser] : any = useState (null);
    const [userEditorOpen, setUserEditorOpen] : any = useState (false);

    const session : Session = useContext (SessionContext);

    const refreshUserList = () => {
        fetch (`${apiUrl}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        }).then ((res : Response) => {
            res.json ().then (data => {
                if (res.status != 200) {
                    if (res.status == 403) {
                        setError ('you are not allowed to access user endpoints, ADMIN permission is required!');
                    } else {
                        console.error (JSON.stringify (data));
                        setError (data.message ? data.message : `server responsed with error ${res.status}`);
                    }
                } else {
                    setUsers (data);
                }
            });
        }).catch (err => {
            console.error (err);
            setError (err);
        });
    }

    useEffect (() => {
        refreshUserList ();
    }, []);

    const rows : React.ReactNode [] = [];
    for (const user of users) {
        const userStruct : User = user as User;
        const row = (<tr key={user.id}>
            <td>{userStruct.id}</td>
            <td>{userStruct.username}</td>
            <td>{(new Date (userStruct.createdTimestamp)).toLocaleString ()}</td>
            <td>{(new Date (userStruct.lastAuthenticationTimestamp)).toLocaleString ()}</td>   
            <td><a href="#">inspect</a> | <a href="#" onClick={() => {
                setCurrentUser (Object.assign ({}, userStruct));
                setUserEditorOpen (true);
            }}>edit</a> | <a href="#">delete</a></td>       
        </tr>);

        rows.push (row);
    }

    const serializeNonEmpty = (user : UserCreateRequest) => {
        const object : any = { };
        
        if (user.username) object.username = user.username;
        if (user.password) object.password = user.password;

        if (user.roles) object.roles = user.roles;
        else object.roles = [];

        return JSON.stringify (object);
    }

    const saveUser = async (user : UserCreateRequest) => {
        const url : string = !!currentUser ? `${apiUrl}/users/${currentUser.id}` : `${apiUrl}/users`
        const res : Response = await fetch (url, {
            method: !!currentUser ? 'PUT' : 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: serializeNonEmpty (user)
        });

        const data = await res.json ();

        if (res.status != 200) {
            if (res.status == 500) throw new Error ('internal server error');
            else if (res.status == 403) throw new Error ('not logged in');
            else throw new Error (`${res.status} ${data.message}`)
        } else {
            setUserEditorOpen (false);
            refreshUserList ();
        }
    };

    return (<div className="usersPage pageWithPadding">
        {userEditorOpen ? <UserEditor user={currentUser} onSave={saveUser} onCancel={() => {
            setUserEditorOpen (false);
        }} /> : <></>}
        {!!error ? <div className="error">{error}</div> : <></>}
        <br />
        <button onClick={() => {
            setCurrentUser (null);
            setUserEditorOpen (true);
        }}>add user</button>
        <br />
        <table className="table" cellSpacing={0} cellPadding={0}>
            <thead>
                <tr>
                    <td>id</td>
                    <td>username</td>
                    <td>created</td>
                    <td>last autd</td>
                    <td>actions</td>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </div>)
}

export default UsersPage;