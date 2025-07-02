import React, {useContext, useEffect, useState} from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {message, Spin} from 'antd';
import {UserContext} from "./context/UserContext";
import http from "../api/http";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import IssueTrackerLayout from "./layout/IssueTrackerLayout";

const RoutesWithNav: React.FC = () => {
    const {user, refreshUser} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshUser()
            .finally(() => setLoading(false));
    }, [refreshUser]);

    useEffect(() => {
        if (!loading &&
            user === null &&
            location.pathname !== '/login' &&
            location.pathname !== '/register') {
            message.error('Session expired. Please log in again.');
            navigate('/login', {replace: true});
        }
    }, [user, loading, navigate, location.pathname]);


    const handleLogout = async () => {
        try {
            await http.post('/auth/logout');
            await refreshUser();
            message.info('Logged out');
            navigate('/login', {replace: true});
        } catch (error) {
            message.error('Logout failed');
        }
    };

    if (loading) {
        return (
            <div style={{display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
                <Spin size="large"/>
            </div>
        );
    }

    const isLoggedIn = Boolean(user);

    return (
        <Routes>
            <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" replace/> :
                    <LoginForm onLoginSuccess={() => navigate('/', {replace: true})}
                               onSwitchToRegister={() => navigate('/register')}/>}
            />
            <Route
                path="/register"
                element={isLoggedIn ? <Navigate to="/" replace/> : <RegisterForm onRegisterSuccess={() => {
                    message.success('Registered!');
                    navigate('/login');
                }} onSwitchToLogin={() => navigate('/login')}/>}
            />
            <Route
                path="/*"
                element={isLoggedIn ? <IssueTrackerLayout onLogout={handleLogout}/> : <Navigate to="/login" replace/>}
            />
        </Routes>
    );
};

export default RoutesWithNav;
