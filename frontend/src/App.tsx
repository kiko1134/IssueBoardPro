import React, { useState } from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import IssueTrackerLayout from './components/layout/IssueTrackerLayout';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    if (isLoggedIn) {
        return <IssueTrackerLayout />;
    }

    return showRegister ? (
        <RegisterForm
            onRegisterSuccess={() => {
                setShowRegister(false); // След регистрация – връщаме към login
            }}
            onSwitchToLogin={() => setShowRegister(false)}
        />
    ) : (
        <LoginForm
            onLoginSuccess={() => setIsLoggedIn(true)}
            onSwitchToRegister={() => setShowRegister(true)}
        />
    );
};

export default App;

