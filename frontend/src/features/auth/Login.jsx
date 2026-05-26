import React, { useState } from 'react';
import API from '../../services/api';
import { LogIn, Eye, EyeOff, Loader2, Wallet } from 'lucide-react';

function Login({ onLoginSuccess, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await API.post('/login/', { username, password });
      setIsLoading(false);
      
      if (res.data.is_verified === true || res.data.is_verified === false) {
        onLoginSuccess(username,res.data.is_verified); 
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.detail || 'Invalid username or password credentials.');
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex items-center justify-center p-0 sm:p-4 selection:bg-blue-500 selection:text-white box-border overflow-hidden">

      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row overflow-hidden h-full md:h-[600px]">
        
        <div className="hidden md:flex md:w-1/2 relative p-10 flex-col justify-between text-white overflow-hidden bg-slate-950 shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" 
            alt="Financial Tracking Graphic" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 via-slate-950/80 to-slate-950"></div>
          
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <Wallet size={24} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">LedgerFlow</span>
          </div>

          <div className="my-auto relative z-10 space-y-4">
            <h1 className="text-3xl font-black leading-tight">Smart Financial Tracking, Simplified.</h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Track your spending anywhere, manage your recurring bills, and view real-time insights on a clean, interactive dashboard.
            </p>
          </div>
        </div>

        {/* Right Side: Dynamic Form Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 h-full overflow-y-auto box-border">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Please enter your log in details.
            </p>
          </div>
          
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-3.5 rounded-xl text-xs font-semibold mb-4 animate-pulse text-center break-words">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 w-full box-border">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50 outline-none transition-all text-sm box-border"
                placeholder="Enter your username" disabled={isLoading} required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/50 outline-none transition-all text-sm pr-12 box-border"
                  placeholder="••••••••" disabled={isLoading} required 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-1 rounded bg-transparent border-none outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4 group active:scale-[0.99] outline-none"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><LogIn size={18} /> Continue</>}
            </button>
          </form>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-8">
            New to our financial system?{' '}
            <button onClick={switchToRegister} className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none">
              Create an Account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;