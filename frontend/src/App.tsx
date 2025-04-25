import React, {useEffect, useState} from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import IssueTrackerLayout from './components/layout/IssueTrackerLayout';
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";

// a little wrapper so we can use `useNavigate` inside our element prop
const RegisterPage: React.FC<{ onRegisterSuccess: () => void }> = ({ onRegisterSuccess }) => {
    const navigate = useNavigate();
    return (
        <RegisterForm
            onRegisterSuccess={() => {
                onRegisterSuccess();    // you could show a “please log in” toast here
                navigate('/login');     // send them to the login page
            }}
        />
    );
};

const App: React.FC = () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
        Boolean(localStorage.getItem('token'))
    );

    // In case another tab logs you out/in
    useEffect(() => {
        const onStorage = () => {
            setIsLoggedIn(Boolean(localStorage.getItem('token')));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Login page */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace />
                        ) : (
                            <LoginForm onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />

                {/* Register page */}
                {/*<Route*/}
                {/*    path="/register"*/}
                {/*    element={*/}
                {/*        isLoggedIn ? (*/}
                {/*            <Navigate to="/" replace />*/}
                {/*        ) : (*/}
                {/*            <RegisterForm onRegisterSuccess={handleLoginSuccess} />*/}
                {/*        )*/}
                {/*    }*/}
                {/*/>*/}

                <Route
                    path="/register"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace/>
                        ) : (
                            <RegisterPage onRegisterSuccess={() => {/* maybe show a toast */}}/>
                        )
                    }
                />

                {/* Protected root */}
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <IssueTrackerLayout
                                // onLogout={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Fallback for any other route */}
                <Route
                    path="*"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

