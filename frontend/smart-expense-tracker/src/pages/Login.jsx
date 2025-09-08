import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/inputs/input';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS, BASE_URL } from '../utils/apiPaths';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // 🔹 loading state

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
    const loggedInUser = response.data.user;

    // Ensure profileImageUrl is absolute
    const backendURL = BASE_URL;
    if (loggedInUser.profileImageUrl && !loggedInUser.profileImageUrl.startsWith("https")) {
      loggedInUser.profileImageUrl = `${backendURL}/uploads/${loggedInUser.profileImageUrl}`;
    }

    localStorage.setItem("user", JSON.stringify(loggedInUser));
    updateUser(loggedInUser); // UserContext update

    navigate("/verify-otp", { state: { email } });

  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please login to your account
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Enter your email"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 characters"
            type="password"
          />
          {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading} // 🔹 disable while loading
            className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending OTP...' : 'LOGIN'}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{' '}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
