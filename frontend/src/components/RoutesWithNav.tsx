import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import IssueTrackerLayoutMobx from "./layout/IssueTrackerLayoutMobx";
import { observer } from "mobx-react-lite";
import { useUser } from "../stores/rootStore";

const RoutesWithNav: React.FC = observer(() => {
    const user = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        user.refreshUser().finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!loading && !user.isAuthenticated &&
            location.pathname !== "/login" && location.pathname !== "/register") {
            message.error("Session expired. Please log in again.");
            navigate("/login", { replace: true });
        }
    }, [user.isAuthenticated, loading, location.pathname,navigate]);

    const handleLogout = async () => {
        await user.logout();
        message.info("Logged out");
        navigate("/login", { replace: true });
    };

    if (loading) {
        return (
            <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
                <Spin size="large" />
            </div>
        );
    }

    const isLoggedIn = user.isAuthenticated;

    return (
        <Routes>
            <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" replace /> :
                    <LoginForm onLoginSuccess={() => navigate("/", { replace: true })}
                               onSwitchToRegister={() => navigate("/register")} />}
            />
            <Route
                path="/register"
                element={isLoggedIn ? <Navigate to="/" replace /> :
                    <RegisterForm onRegisterSuccess={() => {
                        message.success("Registered!");
                        navigate("/login");
                    }} onSwitchToLogin={() => navigate("/login")} />}
            />
            <Route
                path="/*"
                element={isLoggedIn ? <IssueTrackerLayoutMobx onLogout={handleLogout} /> : <Navigate to="/login" replace />}
            />
        </Routes>
    );
});

export default RoutesWithNav;
