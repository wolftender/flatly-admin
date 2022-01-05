import React, { useState } from "react";
import { User } from "../schema/User";
import Modal from "./Modal";

export interface UserCreateRequest {
    username? : string,
    password? : string,
    roles? : string []
}

export interface UserEditorProps {
    allFieldsRequired? : boolean,
    user? : User,
    onSave : (user : UserCreateRequest) => Promise<void>,
    onCancel : () => void 
}

const createRequestFromUser = (user? : User) => {
    if (!user) {
        return {
            username: '',
            password: '',
            roles: []
        } as UserCreateRequest;
    }

    return {
        username: user.username,
        password: '',
        roles: user.roles
    } as UserCreateRequest;
}

const UserEditor : React.FC<UserEditorProps> =  (props : UserEditorProps) => {
    const [user, setUser] : any = useState (createRequestFromUser (props.user));
    const [error, setError] : any = useState (null);
    const [saving, setSaving] : any = useState (false);

    const save = () => {
        if (!saving) {
            setSaving (true);
            props.onSave (user).then (() => {
                setSaving (false);
            }).catch (err => {
                setError (err.message);
                setSaving (false);
            })
        }
    };

    const onUsernameChange = (ev : React.ChangeEvent<HTMLInputElement>) => {
        const newUser : UserCreateRequest = Object.assign ({}, user);
        newUser.username = ev.target.value;
        setUser (newUser);
    }

    const onPasswordChange = (ev : React.ChangeEvent<HTMLInputElement>) => {
        const newUser : UserCreateRequest = Object.assign ({}, user);
        newUser.password = ev.target.value;
        setUser (newUser);
    }

    const onPermissionChecked = (permissionId : string, value : boolean) => {
        const newUser : UserCreateRequest = Object.assign ({}, user);

        if (!newUser.roles) {
            newUser.roles = [];
        }

        if (value) {
            newUser.roles.push (permissionId);
        } else {
            const index : number = newUser.roles.indexOf (permissionId);
            if (index >= 0) {
                newUser.roles.splice (index, 1);
            }
        }

        setUser (newUser);
    }

    const isPermissionActive = (permissionId : string) => {
        return (user.roles.indexOf (permissionId) != -1);
    }

    return (<Modal title="User Editor" buttons={[
        { name: "save", action: save },
        { name: "cancel", action: () => { props.onCancel (); } }
    ]}>
        <div className="modalFormWrapper">
            {!!saving ? <div className="info">saving...</div> : <></>}
            {!!error ? <div className="error">{error}</div> : <></>}
            <form className="modalForm">
                <div className="label"><label htmlFor="username">Username: </label></div>
                <div className="input"><input type="text" name="username" onChange={onUsernameChange} value={user.username} /></div>
                <div className="label"><label htmlFor="password">Password: </label></div>
                <div className="input"><input type="text" name="password" onChange={onPasswordChange} value={user.password} /></div>
                <div className="label"><span>Permissions: </span></div>
                <div className="input checkboxGroupInput">
                    <div className="checkboxWrapper">
                        <input type="checkbox" name="perm_read" 
                            checked={isPermissionActive ('READ')}
                            onChange={(ev) => onPermissionChecked ('READ', !!ev.target.checked)} />
                        <label htmlFor="perm_read">READ</label>             
                    </div>
                    <div className="checkboxWrapper">
                        <input type="checkbox" name="perm_write"
                            checked={isPermissionActive ('WRITE')} 
                            onChange={(ev) => onPermissionChecked ('WRITE', !!ev.target.checked)} />  
                        <label htmlFor="perm_write">WRITE</label>             
                    </div>
                    <div className="checkboxWrapper">
                        <input type="checkbox" name="perm_admin"
                            checked={isPermissionActive ('ADMIN')} 
                            onChange={(ev) => onPermissionChecked ('ADMIN', !!ev.target.checked)} />
                        <label htmlFor="perm_admin">ADMIN</label>               
                    </div>
                </div>
            </form>
        </div>
    </Modal>);
}

export default UserEditor;