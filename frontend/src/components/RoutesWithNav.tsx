import React, {useContext, useEffect, useState} from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {message, Spin} from 'antd';
import {UserContext} from "./context/UserContext";
import http from "../api/http";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import IssueTrackerLayout from "./layout/IssueTrackerLayout";

const RoutesWithNav: React.FC = () => {
    const {user, refreshUser} = useContext(UserContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    // При първоначално зареждане – само веднъж – опитваме refreshUser.
    useEffect(() => {
        refreshUser()
            .catch(() => {
            })
            .finally(() => setLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


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
                <Spin tip="Loading session..." size="large"/>
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
