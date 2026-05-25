import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import OTPVerificationScreen from "./features/auth/OTPVerificationScreen"; 
import ExpenseTracker from './features/dashboard/ExpenseTracker';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  const [authStage, setAuthStage] = useState('login'); // Stages: 'login', 'register', 'otp', 'dashboard'
  const [pendingUsername, setPendingUsername] = useState('');

  const handleLogout = () => {
    setAuthStage('login');
    setPendingUsername('');
  };

  return (
    <div className="min-h-screen p-0 md:p-6 relative font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <InteractiveBackground />

      {/* CORE ROUTING PIPELINE GATEWAY */}
      <div className="relative w-full">
        {authStage === 'login' && (
          <Login
            // 👑 UPDATE: Receive both username and verification status from Login.jsx
            onLoginSuccess={(user, isVerified) => {
              setPendingUsername(user);
              if (isVerified === true) {
                setAuthStage('dashboard'); // 🚀 If verified already, jump straight to dashboard!
              } else {
                setAuthStage('otp');       // Fallback to OTP screen if email works later
              }
            }}
            switchToRegister={() => setAuthStage('register')}
          />
        )}

        {authStage === 'otp' && (
          <OTPVerificationScreen
            username={pendingUsername}
            onVerificationSuccess={() => setAuthStage('dashboard')}
            onLogout={handleLogout}
          />
        )}

        {authStage === 'register' && (
          <Register
            onRegisterSuccess={() => setAuthStage('login')}
            switchToLogin={() => setAuthStage('login')}
          />
        )}

        {authStage === 'dashboard' && (
          <ExpenseTracker onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;