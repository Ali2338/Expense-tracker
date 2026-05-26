import React, { useState } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import OTPVerificationScreen from "./features/auth/OTPVerificationScreen"; 
import ExpenseTracker from './features/dashboard/ExpenseTracker';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  const [authStage, setAuthStage] = useState('login');
  const [pendingUsername, setPendingUsername] = useState('');

  const handleLogout = () => {
    setAuthStage('login');
    setPendingUsername('');
  };

  return (
    <div className="min-h-screen p-0 md:p-6 relative font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <InteractiveBackground />

      <div className="relative w-full">
        {authStage === 'login' && (
          <Login
            onLoginSuccess={(user, isVerified) => {
              setPendingUsername(user);
              if (isVerified === true) {
                setAuthStage('dashboard'); 
              } else {
                setAuthStage('otp');       
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