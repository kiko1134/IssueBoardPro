import React, {useEffect, useState} from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import IssueTrackerLayout from './components/layout/IssueTrackerLayout';
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {message} from "antd";
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
    exp: number;  // expiration as Unix timestamp (seconds)
}

const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const {exp} = jwtDecode<DecodedToken>(token);
        if (exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }
        return token;
    } catch {
        localStorage.removeItem('token');
        return null;
    }
}


// a little wrapper so we can use `useNavigate` inside our element prop
const RegisterPage: React.FC = () => {

    const navigate = useNavigate();

    const onSuccess = () => {
        message.success('Registration successful! Please log in.');
        // onRegisterSuccess();
        navigate('/login', {replace: true});
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

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        () => !!getValidToken());

    // In case another tab logs you out/in
    useEffect(() => {
        const onStorage = () => {
            setIsLoggedIn(!!getValidToken());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const token = getValidToken();
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        const {exp} = jwtDecode<DecodedToken>(token);
        const timeout = exp * 1000 - Date.now();

        const timer = setTimeout(() => {
            //time's up
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            message.error('Session expired. Please log in again.');
        }, timeout);

        return () => clearTimeout(timer);
    }, [isLoggedIn]);

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
                                 onLogout={handleLogout}
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

