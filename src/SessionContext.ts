import React from "react";
import { getCookie } from "./Cookies";

export interface Session {
    token? : string,
    setToken : (token? : string) => void
}

export const SessionContext = React.createContext ({
    token: undefined,
    setToken: (token? : string) => { }
} as Session);

export const loadTokenFromCookies = () => {
    return getCookie ('login_token');
}