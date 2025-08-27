import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[13px] text-slate-800">{label}</label>
            <div className="relative w-full">
                <input
                    className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-sm"
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />

                {type === 'password' && (
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={togglePassword}
                    >
                        {showPassword ? (
                            <FaRegEye className="text-primary" size={18} />
                        ) : (
                            <FaRegEyeSlash className="text-slate-500" size={18} />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Input;
