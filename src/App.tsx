import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import PanelLayout from './components/PanelLayout';
import { deleteCookie } from './Cookies';
import LoginPage from './pages/Login';
import SessionPage from './pages/Session';
import UsersPage from './pages/Users';

import background from './resources/background.jpg';
import { loadTokenFromCookies, Session, SessionContext } from './SessionContext';

interface PageData {
    title : string,
    content : React.ReactNode
}

function App () {
    const [token, setToken] : any = useState (loadTokenFromCookies ());
    const [page, setPage] : any = useState ('users');

    const setTokenImpl = (token? : string) => {
        if (token) {
            setToken (token);
        } else {
            setToken (null);
            deleteCookie ('login_token');
        }
    };

    const pages : {[key : string] : PageData} = {
        users: { title: "User Management", content: <UsersPage /> },
        session: { title: "Current Session", content: <SessionPage /> }
    }

    const renderCurrentPage = () => {
        const navigation : React.ReactNode = (<Navigation page={page} pages={Object.keys (pages)} setPage={setPage} />)
 
        if (pages [page]) {
            const pageData : PageData = pages [page];
            return (<PanelLayout title={pageData.title} navigation={navigation}>
                {pageData.content}
            </PanelLayout>);
        } else {
            return (<PanelLayout title="Error" navigation={navigation}>
                <div className="error">there was an error while rendering this page</div>
            </PanelLayout>)
        }
    }

    return (
        <SessionContext.Provider value={{
            token: token,
            setToken: setTokenImpl
        } as Session}>
            <div className="applicationWrapper">
                <div className="background">
                    <div style={{
                        backgroundImage: `url(${background})`
                    }}></div>
                </div>
                <div className="applicationBody">
                    <div className="application">
                        {!!token 
                            ? renderCurrentPage ()
                            : <LoginPage />
                        }
                    </div>
                </div>
            </div> 
        </SessionContext.Provider>
    );
}

export default App;
