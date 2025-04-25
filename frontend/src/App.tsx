import React, {useEffect, useState} from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import IssueTrackerLayout from './components/layout/IssueTrackerLayout';
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {message} from "antd";

// a little wrapper so we can use `useNavigate` inside our element prop
const RegisterPage: React.FC<{ onRegisterSuccess?: () => void }> = ({onRegisterSuccess}) => {
    // const navigate = useNavigate();
    // return (
    //     <RegisterForm
    //         onRegisterSuccess={() => {
    //             // onRegisterSuccess();
    //             navigate('/login');
    //         }}
    //     />
    // );

    const navigate = useNavigate();

    const onSuccess = () => {
        message.success('Registration successful! Please log in.');
        // onRegisterSuccess();
        navigate('/login',{ replace: true });
    };
    const switchToLogin = () => navigate('/login');

    return (
        <RegisterForm
            onRegisterSuccess={onSuccess}
            onSwitchToLogin={switchToLogin}
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

    // Wrapper for login route
    const LoginPage: React.FC = () => {
        const navigate = useNavigate();
        const onLoginSuccess = () => {
            handleLoginSuccess();
            navigate('/', {replace: true});
        };
        const onSwitchToRegister = () => {
            navigate('/register');
        };
        return (
            <LoginForm
                onLoginSuccess={onLoginSuccess}
                onSwitchToRegister={onSwitchToRegister}
            />
        );
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Login page */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace/>
                        ) : (
                            <LoginPage/>
                        )
                    }
                />

                {/* Register page */}
                <Route
                    path="/register"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace/>
                        ) : (
                            <RegisterPage/>
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
                            <Navigate to="/login" replace/>
                        )
                    }
                />

                {/* Fallback for any other route */}
                <Route
                    path="*"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" replace/>
                        ) : (
                            <Navigate to="/login" replace/>
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

