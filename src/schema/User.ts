export interface User {
    id : number,
    username : string,
    password : string,
    enabled : boolean,
    createdTimestamp : number,
    lastAuthenticationTimestamp: number,
    lastAuthenticationAddress : string,
    lastAuthorizationTimestamp : number,
    lastAuthorizationAddress : string,
    roles : string []
}