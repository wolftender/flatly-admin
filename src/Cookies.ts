export const setCookie = (cookieName : string, cookieValue : any, expires? : number) => {
    const encodedValue : string = encodeURIComponent (String (cookieValue));
    let expirationString : string = "";

    if (expires) {
        const expirationDate : Date = new Date (Date.now () + expires);
        expirationString = `; ${expirationDate.toUTCString ()}`;
    }

    document.cookie = `${cookieName}=${encodedValue}${expirationString}; path=/`;
}

export const getCookie = (name : string) => {
    const cookies : string [] = document.cookie.split (';');

    for (const cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split ('=');
        cookieName = cookieName.replace (/^\s+/,'');

        if (cookieName === name) {
            return decodeURIComponent (cookieValue);
        }
    }

    return null;
}

export const deleteCookie = (name : string) => {
    const date : string = (new Date (0)).toUTCString ();
    document.cookie = `${name}=; expires=${date}`;
}