import React, {useState} from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import IssueTrackerLayout from './components/layout/IssueTrackerLayout';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

const App: React.FC = () => {
    // const [isLoggedIn, setIsLoggedIn] = useState(true);
    // const [showRegister, setShowRegister] = useState(false);
    //
    // if (isLoggedIn) {
    //     return <IssueTrackerLayout />;
    // }
    //
    // return showRegister ? (
    //     <RegisterForm
    //         onRegisterSuccess={() => {
    //             setShowRegister(false); // След регистрация – връщаме към login
    //         }}
    //         onSwitchToLogin={() => setShowRegister(false)}
    //     />
    // ) : (
    //     <LoginForm
    //         onLoginSuccess={() => setIsLoggedIn(true)}
    //         onSwitchToRegister={() => setShowRegister(true)}
    //     />
    // );

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                {/* if already logged in, redirect away from /login */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn
                            ? <Navigate to="/" replace/>
                            : <LoginForm onLoginSuccess={() => setIsLoggedIn(true)}/>
                    }
                />

                {/* same guard for /register */}
                <Route
                    path="/register"
                    element={
                        isLoggedIn
                            ? <Navigate to="/" replace/>
                            : <RegisterForm onRegisterSuccess={() => setIsLoggedIn(true)}/>
                    }
                />

                {/* protected root route */}
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? <IssueTrackerLayout/>
                            : <Navigate to="/login" replace/>
                    }
                />

                {/* catch-all: send unknown URLs to root or login */}
                <Route
                    path="*"
                    element={
                        isLoggedIn
                            ? <Navigate to="/" replace/>
                            : <Navigate to="/login" replace/>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

