import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/v1/auth/verify-otp', {
        email,
        otp,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
      <form onSubmit={handleVerify} className="w-full max-w-sm">
        <input
          className="border border-gray-300 p-2 w-full mb-4"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="btn-primary w-full" type="submit">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;
