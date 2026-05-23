import React, { useState } from 'react';
import API from '../../services/api';
import { ShieldCheck, RefreshCw, LogOut, Loader2 } from 'lucide-react';

function OTPVerificationScreen({ username, onVerificationSuccess, onLogout }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await API.post('/verify-otp/', {
        username: username?.trim() || '',
        otp: otp.trim()
      });

      if (res.data.is_verified) {
        onVerificationSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired 6-digit verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMsg('');
    try {
      await API.post('/login/', { username });
      setMsg('A fresh authorization code has been sent to your email.');
    } catch (err) {
      setError('Failed to dispatch code. Please try again shortly.');
    }
  };

  return (
    // 👑 CONTAINER OVERHAUL: Full padding bounds tracking layout fixes
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-slate-100 box-border w-full">
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full space-y-6 text-center animate-fadeIn box-border">

        <div className="bg-blue-600/10 text-blue-500 p-4 rounded-full w-fit mx-auto border border-blue-500/20">
          <ShieldCheck size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black tracking-tight">Enter Verification Code</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Please check your email. Enter the secure 6-digit OTP passcode below to unlock your account workspace.
          </p>
        </div>

        {error && <p className="text-xs text-rose-500 font-bold bg-rose-500/10 py-2.5 px-3 rounded-xl border border-rose-500/20 break-words">{error}</p>}
        {msg && <p className="text-xs text-emerald-500 font-bold bg-emerald-500/10 py-2.5 px-3 rounded-xl border border-emerald-500/20 break-words">{msg}</p>}

        <form onSubmit={handleVerify} className="space-y-4 w-full box-border">
          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            // 👑 FIXED: Tells the browser engine to expect exactly 6 numerical digits (0-9)
            pattern="[0-9]{6}"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full text-center tracking-[0.25em] sm:tracking-widest text-2xl font-black py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 text-white outline-none transition-colors box-border"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98 outline-none"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Verification Code'}
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 text-[11px] font-bold text-slate-400 w-full box-border">
          <button onClick={handleResend} type="button" className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors bg-transparent border-none outline-none">
            <RefreshCw size={12} /> Resend Code
          </button>
          <button onClick={onLogout} type="button" className="hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors bg-transparent border-none outline-none">
            <LogOut size={12} /> Cancel Session
          </button>
        </div>

      </div>
    </div>
  );
}

export default OTPVerificationScreen;