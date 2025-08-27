
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/inputs/input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance'; 
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    

    const {updateUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
        setError('Please enter a valid email address');
        return;
    }
    if(!password){
        setError('Please enter your password');
        return;
    }
    setError("");

    // login API call
    try{
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password,
        });
         // Expect: message and userId (no token/user yet)
         navigate('/verify-otp', { state: { email } });


    }catch(error){
        if(error.response && error.response.data.message){
            setError(error.response.data.message);
        }else{
            setError('Something went wrong, please try again later');
        }
    }
}


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

                <form onSubmit={handleLogin} className="">
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
                    {error && <p className='text-red-500 text-sm pb-2.5'>{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary">
                        LOGIN
                    </button>

                    <p className='text-[13px] text-slate-800 mt-3'>
                        Don't have an account?{' '}
                        <Link className='font-medium text-primary underline' to='/signup'>
                            Sign Up
                        </Link>
                    </p>

                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
